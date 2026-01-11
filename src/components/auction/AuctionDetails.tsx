"use client";

import React, { useState, useMemo } from 'react';
import { useFetch } from "@/hooks/useFetcher";
import { Auction } from '@/types/main';
import { Avatar, Button, Label, TextInput } from 'flowbite-react';
import { FiClock, FiInfo, FiTrendingUp, FiMapPin } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { RiAuctionLine } from 'react-icons/ri';
import { BiLogIn, BiMoney, BiTrophy } from 'react-icons/bi';
import { Link, useRouter } from "@/i18n/navigation";
import { durationFromStrings, formatTimestamp } from '@/helpers/dates';
import { useAuth } from '@/context/authContext';
import { LoginModal } from '../users/LoginModal';
import Timer from '../common/Timer';
import AuctionStatusBadge from '../common/AuctionStatusBadge';
import { toast } from 'react-toastify';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function AuctionDetails({ slug }: { slug: string }) {
    const { data, error, loading } = useFetch<Auction>(`auction/${slug}/`);
    const { isAuthenticated } = useAuth();
    const [openModal, setOpenModal] = useState(false);
    const [bidAmount, setBidAmount] = useState<string>("");
    const router = useRouter();

    // Calculate highest bid safely
    const highestBid = useMemo(() => {
        if (!data) return 0;
        const lastBid = data.bids && data.bids.length > 0 ? data.bids[0].amount : 0;
        return Math.max(Number(lastBid), Number(data.start_price));
    }, [data]);


    const handleQuickBid = () => {
        const minRequired = highestBid + Number(data?.min_increment || 0);
        const bidValue = Number(bidAmount);

        if (bidValue < minRequired) {
            toast.error(`Minimum bid is $${minRequired}`);
            return;
        }

        // approach: Pass the intended bid via URL query parameters
        // This allows the Live Room to "pick up" the bid automatically or pre-fill the form
        router.push(`/auction-details/${slug}/bid-room?prefill=${bidValue}`);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium">Loading Auction Details...</p>
        </div>
    );

    if (error || !data) return <div className="text-center my-20 text-red-600 font-bold">Auction not found.</div>;

    return (
        <div className="bg-gray-50/50 min-h-screen pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 pt-10 pb-6 mb-8">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <AuctionStatusBadge stat={data.status} />
                                <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {data.category?.title || 'General'}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                {data.title}
                            </h1>
                            <div className="flex items-center gap-4 mt-3 text-slate-500 text-sm font-medium">
                                <div className="flex items-center gap-1.5">
                                    <FiMapPin className="text-indigo-500" />
                                    <span>Verified Auction</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FiInfo className="text-indigo-500" />
                                    <span>ID: #{data.id.toString().slice(0, 8).toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Media & Content */}
                    <div className="lg:col-span-8 flex flex-col gap-8">
                        {/* Gallery */}
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <Gallery images={data.images && data.images.length > 0 ? data.images : [{ image: "/imgs/placeholder.jpg" }]} />
                        </div>

                        {/* Description Box */}
                        <section className="bg-white p-8 rounded-2xl border border-gray-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FiInfo className="text-indigo-600" /> Item Description
                            </h3>
                            <div
                                className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: data.desc }}
                            />
                        </section>

                        {/* Technical Specs Grid */}
                        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <DetailTile
                                icon={FiClock}
                                label="Total Duration"
                                value={`${durationFromStrings(data.start_date, data.end_date).days ?? 0} Days`}
                            />
                            <DetailTile
                                icon={BiMoney}
                                label="Starting At"
                                value={`$${Number(data.start_price).toLocaleString()}`}
                            />
                            <DetailTile
                                icon={FiTrendingUp}
                                label="Min Increment"
                                value={`$${Number(data.min_increment).toLocaleString()}`}
                            />
                        </section>
                    </div>

                    {/* RIGHT COLUMN: Bidding & Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* THE ACTION CARD */}
                        <div className="sticky top-24 z-10">
                            <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 border-2 border-indigo-600/10 overflow-hidden">
                                {/* Timer Header - Fixed visibility */}
                                <div className="bg-slate-50 p-5">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-2">Time Remaining</p>
                                    <Timer start_date={data.start_date} end_date={data.ended_at ?? data.end_date} status={data.status} />
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-500 mb-1">
                                                {data.bids.length > 0 ? "Current Bid" : "Starting Price"}
                                            </p>
                                            <h2 className="text-4xl font-black text-slate-900">
                                                ${highestBid.toLocaleString()}
                                            </h2>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-500 mb-1">Total Bids</p>
                                            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">
                                                {data.bids.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bidding Form */}
                                    {data.status === 'live' ? (
                                        isAuthenticated ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label className="mb-2 block text-xs font-bold uppercase text-slate-500">Your Offer</Label>
                                                    <TextInput
                                                        type="number"
                                                        value={bidAmount}
                                                        onChange={(e) => setBidAmount(e.target.value)}
                                                        placeholder={`Min: $${highestBid + Number(data.min_increment)}`}
                                                        className="mb-1"
                                                    />
                                                    <p className="text-[10px] text-slate-400">
                                                        Required increment: <span className="text-slate-900 font-bold">${data.min_increment}</span>
                                                    </p>
                                                </div>
                                                <Button onClick={handleQuickBid} className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                                    <RiAuctionLine className="mr-2 h-5 w-5" /> Place Bid
                                                </Button>
                                                <Link href={`/auction-details/${slug}/bid-room`} className="block">
                                                    <Button color="alternative" className="w-full">
                                                        <BiLogIn className="mr-2 h-5 w-5" /> Enter Live Bidding Room
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <Button size="lg" className="w-full bg-slate-900" onClick={() => setOpenModal(true)}>
                                                Sign In to Place Bid
                                            </Button>
                                        )
                                    ) : (
                                        <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-slate-500 font-bold">Bidding is closed for this item.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Recent Bids List */}
                            <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <BiTrophy className="text-yellow-500" /> Recent Activity
                                </h3>
                                <div className="space-y-4">
                                    {data.bids.slice(0, 5).map((bid: any, i: number) => (
                                        <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${i === 0 ? 'bg-indigo-50/50 border-indigo-100' : 'border-transparent'}`}>
                                            <div className="flex items-center gap-3">
                                                <Avatar size="sm" rounded placeholderInitials={bid.created_by[0]} />
                                                <div>
                                                    <p className="text-xs font-bold text-slate-800">{bid.created_by}</p>
                                                    <p className="text-[10px] text-slate-400">{formatTimestamp(bid.created_at)}</p>
                                                </div>
                                            </div>
                                            <p className={`text-sm font-black ${i === 0 ? 'text-indigo-600' : 'text-slate-700'}`}>
                                                ${Number(bid.amount).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                    {data.bids.length === 0 && <p className="text-center text-slate-400 text-sm py-4 italic">Be the first to bid!</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal isOpen={openModal} onClose={() => setOpenModal(false)} />
        </div>
    );
}

/* UI COMPONENTS */

function DetailTile({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center gap-4 hover:border-indigo-300 transition-colors">
            <div className="bg-indigo-50 p-3 rounded-xl">
                <Icon className="text-indigo-600 text-xl" />
            </div>
            <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{label}</p>
                <p className="text-sm font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function Gallery({ images }: { images: any[] }) {
    return (
        <Swiper
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            modules={[Pagination, Navigation, Autoplay]}
            autoplay={{ delay: 5000 }}
            className="rounded-xl aspect-[16/9]"
            loop={images.length > 1}
        >
            {images.map((img, index) => (
                <SwiperSlide key={index}>
                    <div className='relative w-full h-full bg-slate-100'>
                        <Image
                            src={img.image || img.src} // Handle different API response shapes
                            alt="Product Image"
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}