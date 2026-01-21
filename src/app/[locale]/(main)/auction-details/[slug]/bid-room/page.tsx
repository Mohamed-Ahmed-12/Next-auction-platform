"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Bids, Auction } from "@/types/main";
import { Alert, Button, Badge } from "flowbite-react";
import { HiInformationCircle, HiTrendingUp } from "react-icons/hi";
import { RiAuctionLine, RiHistoryLine } from "react-icons/ri";
import { SlEnergy } from "react-icons/sl";
import { useFetch } from "@/hooks/useFetcher";
import { useAuth } from "@/context/authContext";
import { useFormik } from "formik";
import { formatTimestamp } from "@/helpers/dates";
import ProtectedRoute from "@/guards/ProotectedRoute";
import Timer from "@/components/common/Timer";
import { toast } from "react-toastify";
import { useLocale, useTranslations } from 'next-intl';

export default function AuctionBidPage() {
    const t = useTranslations("AuctionBid");
    const locale = useLocale();
    const { slug } = useParams() as { slug: string };
    const { data: initialData, error, loading } = useFetch<Auction>(`auction/${slug}/`);
    const { user } = useAuth();
    const token = user?.access || null;
    const socketRef = useRef<WebSocket | null>(null);

    const [auction, setAuction] = useState<Auction | null>(null);
    const [bids, setBids] = useState<Bids[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    // Create a local tick to keep the UI reactive to time changes
    const [now, setNow] = useState(new Date());

    const searchParams = useSearchParams();
    const prefillAmount = searchParams.get("prefill");

    // Inside your WebSocket useEffect or a separate effect
    useEffect(() => {
        if (isConnected && prefillAmount && socketRef.current) {
            // Option A: Automatically send the bid as soon as connected
            socketRef.current.send(JSON.stringify({ amount: Number(prefillAmount) }));

            // Clean up the URL so a page refresh doesn't re-bid
            window.history.replaceState(null, '', window.location.pathname);

        }
    }, [isConnected,prefillAmount]); // Only trigger once the socket is ready


    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const lastBidAmount: number = useMemo(() => {
        if (bids.length > 0) return bids[0].amount;
        return auction?.bids?.[0]?.amount || auction?.start_price || 0;
    }, [bids, auction]);

    // Calculate if ended based on actual timestamps, not the status string
    const isActuallyEnded = useMemo(() => {
        const endTime = auction?.ended_at || auction?.end_date;
        if (!endTime) return false;
        return now.getTime() >= new Date(endTime).getTime();
    }, [auction?.ended_at, auction?.end_date, now]);

    // Sync initial fetch with local state
    useEffect(() => {
        if (initialData) {
            setAuction(initialData);
            setBids(initialData.bids || []);
        }
    }, [initialData]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            amount: Number(lastBidAmount) + Number(auction?.min_increment || 0),
        },
        validate: (values) => {
            const errors: { amount?: string } = {};
            const minAcceptable = Number(lastBidAmount) + Number(auction?.min_increment || 0);
            if (values.amount < minAcceptable) {
                errors.amount = t('minBidError', { amount: minAcceptable });
            }
            return errors;
        },
        onSubmit: (values) => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                setErrorMessage(t('connectionLost'));
                return;
            }
            socketRef.current.send(JSON.stringify({ amount: values.amount }));
        }
    });

    useEffect(() => {
        if (!auction?.id || !token) return;
        const socket = new WebSocket(`ws://192.168.1.5:8000/ws/place-bid/${auction.id}/?token=${token}`);
        socketRef.current = socket;
        socket.onopen = () => setIsConnected(true);
        socket.onclose = () => setIsConnected(false);

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.error) {
                setErrorMessage(message.error);
                toast.error(message.error);
            }

            if (message.bid) {
                setErrorMessage("");
                setBids((prev) => {
                    if (prev.find(b => b.id === message.bid.id)) return prev;
                    return [message.bid, ...prev];
                });
                formik.resetForm();

                if (message.new_end_time) {
                    setAuction((prev) => prev ? { ...prev, ended_at: message.new_end_time } : null);
                    toast.info(t('antiSniping'));
                }
            }
        };

        return () => socket.close();
    }, [auction?.id, token]);

    if (loading) return <div className="p-20 text-center"><RiAuctionLine className="animate-spin text-4xl mx-auto text-indigo-600" /></div>;
    if (error || !auction) return <div className="p-20 text-center text-red-500 font-bold">{t('notFound')}</div>;

    return (
        <ProtectedRoute>
            <header className="bg-white border-b border-slate-100 py-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge color={isConnected ? "success" : "failure"} className="rounded-full px-2">
                                    <span className={`mr-1 inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                                    {isConnected ? t('liveConnection') : t('offline')}
                                </Badge>
                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('auctionId')}: {auction.id}</span>
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{auction.title}</h1>
                        </div>
                        <div>
                            <Timer start_date={auction.start_date} end_date={auction.ended_at ?? auction.end_date} status={auction.status} />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 my-10 max-w-7xl">
                {isActuallyEnded && (
                    <Alert color="failure" icon={HiInformationCircle} withBorderAccent className="mb-6" >
                        <span className="font-bold">{t('endedAlert')}</span>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <RiAuctionLine size={120} />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 mb-2">{t('currentHighestBid')}</p>
                                <h2 className="text-7xl font-black text-slate-900 mb-2">
                                    <span className="text-4xl font-light text-slate-400">$</span>
                                    {Number(lastBidAmount).toLocaleString()}
                                </h2>
                                {bids[0] ? (
                                    <div className="flex items-center gap-2 bg-indigo-50 px-4 py-1 rounded-full border border-indigo-100">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span className="text-sm font-medium text-indigo-700">{t('heldBy')} <strong>{bids[0].created_by}</strong></span>
                                    </div>
                                ) : (
                                    <span className="text-slate-400 text-sm italic">{t('startingPrice')}</span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-slate-50">
                                <div className="text-center">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('minIncrement')}</p>
                                    <p className="text-lg font-bold text-slate-700">${auction.min_increment}</p>
                                </div>
                                <div className="text-center border-l border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('totalBids')}</p>
                                    <p className="text-lg font-bold text-slate-700">{bids.length}</p>
                                </div>
                            </div>
                        </div>

                        {!isActuallyEnded && (
                            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
                                <div className="flex items-center gap-2 mb-6">
                                    <SlEnergy className="text-yellow-400" />
                                    <h2 className="text-lg font-bold tracking-tight">{t('placeYourBid')}</h2>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                                    {[1, 2, 5, 10].map((m) => {
                                        const amount = Number(lastBidAmount) + (Number(auction.min_increment) * m);
                                        return (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => formik.setFieldValue("amount", amount)}
                                                className="py-3 px-2 rounded-xl border border-slate-700 hover:bg-white hover:text-slate-900 transition-all font-bold text-sm"
                                            >
                                                +${(Number(auction.min_increment) * m).toLocaleString()}
                                            </button>
                                        );
                                    })}
                                </div>

                                <form onSubmit={formik.handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xl">$</span>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            className="w-full bg-slate-800 border-none rounded-2xl py-5 pl-10 pr-4 text-2xl font-black focus:ring-2 focus:ring-indigo-500 transition-all"
                                        />
                                    </div>
                                    {formik.errors.amount && <p className="text-red-400 text-xs font-bold px-2">{formik.errors.amount}</p>}
                                    {errorMessage && <p className="text-red-400 text-xs font-bold px-2">{errorMessage}</p>}
                                    <Button
                                        type="submit"
                                        size="xl"
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-2xl transition-transform active:scale-95"
                                    >
                                        <span className="flex items-center gap-2 text-lg font-black uppercase tracking-wider">
                                            {t('confirmBid')} <HiTrendingUp />
                                        </span>
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                                    <RiHistoryLine className="text-indigo-600" /> {t('bidHistory')}
                                </h2>
                                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold capitalize">{auction.status}</span>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {bids.map((bid, idx) => (
                                    <div
                                        key={bid.id}
                                        className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${idx === 0 ? 'bg-indigo-50 border border-indigo-100 shadow-sm' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-bold text-slate-800">{bid.created_by}</span>
                                                <span className={`text-sm font-black ${idx === 0 ? 'text-indigo-600' : 'text-slate-600'}`}>
                                                    ${Number(bid.amount).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium">{formatTimestamp(bid.created_at,locale)}</p>
                                        </div>
                                    </div>
                                ))}
                                {bids.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 text-sm">{t('noActivity')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}