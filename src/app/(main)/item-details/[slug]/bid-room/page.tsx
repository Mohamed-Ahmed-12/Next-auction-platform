"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Bids, Item } from "@/types/main";
import { Alert, Card } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { RiAuctionLine } from "react-icons/ri";
import { SlEnergy } from "react-icons/sl";
import { FiActivity } from "react-icons/fi";
import { useFetch } from "@/hooks/useFetcher";
import { useAuth } from "@/context/authContext";
import { useFormik } from "formik";
import { formatTimestamp } from "@/helpers/dates";
import ProtectedRoute from "@/guards/ProotectedRoute";

export default function ItemPage() {
    const { slug } = useParams() as { slug: string };
    const { data, error, loading } = useFetch<Item>(`items/${slug}/`);
    const { user } = useAuth();

    const token = user?.access || null;
    const socketRef = useRef<WebSocket | null>(null);

    // Local bid list (updated by websocket)
    const [bids, setBids] = useState<Bids[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    // Compute last bid amount
    const lastBidAmount:number = useMemo(() => {
        if (bids.length > 0) return bids[0].amount;
        return data?.bids?.[0]?.amount || data?.start_price || 0;
    }, [bids, data]);

    // Initialize Formik
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            amount: Number(lastBidAmount) + Number(data?.min_increment || 0),
        },
        validate: (values) => {
            const errors: { amount?: string } = {};
            const minAcceptable =  Number(lastBidAmount) + Number(data?.min_increment);

            if (values.amount < minAcceptable) {
                errors.amount = `Bid must be at least ${minAcceptable}`;
            }
            return errors;
        },
        onSubmit: (values, { resetForm }) => {
            if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
                setErrorMessage("Connection lost. Please try again.");
                return;
            }

            socketRef.current.send(JSON.stringify({ amount: values.amount }));
            resetForm();
        }
    });

    // Setup WebSocket
    useEffect(() => {
        if (!data?.id || !token) return;

        const socket = new WebSocket(
            `ws://127.0.0.1:8000/ws/place-bid/${data.id}/?token=${token}`
        );
        socketRef.current = socket;

        socket.onopen = () => console.log("WebSocket Connected");

        socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.error) {
                    setErrorMessage(message.error);
                    return;
                }

                if (message.bid) {
                    const newBid = message.bid;
                    setErrorMessage("");
                    setBids((prev) => [newBid, ...prev]);
                }
            } catch (err) {
                console.error("Invalid WebSocket message:", event.data);
            }
        };

        socket.onerror = () => setErrorMessage("WebSocket error occurred");

        return () => socket.close();
    }, [data?.id, token]);

    // Initialize bids from API
    useEffect(() => {
        if (data?.bids) setBids(data.bids);
    }, [data]);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!data) return <h2>No item found</h2>;

    const auctionEnded = false;

    return (
        <ProtectedRoute>
            {/* HEADER */}
            <div className="bg-gray-50 mx-auto px-4 py-2">
                <h3 className="text-xl font-semibold text-indigo-800">Auction</h3>
                <h1 className="text-2xl font-bold">{data.title}</h1>
            </div>

            <div className="container mx-auto px-4 my-20 max-w-7xl">

                {/* AUCTION ENDED ALERT */}
                {auctionEnded && (
                    <Alert color="failure" icon={HiInformationCircle}>
                        <span className="font-medium">Auction ended!</span> No more bids allowed.
                    </Alert>
                )}

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 mt-6">

                    {/* LEFT COLUMN */}
                    <div className="col-span-3 lg:col-span-2 flex flex-col gap-6">

                        {/* CURRENT BID CARD */}
                        <Card className="shadow-none">
                            <h2 className="text-sm font-bold text-indigo-600 flex items-center">
                                <RiAuctionLine className="text-xl" /> Current Bid
                            </h2>

                            <div className="flex flex-col items-center gap-1">
                                <h2 className="text-6xl font-semibold">
                                    ${Number(lastBidAmount).toLocaleString()}
                                </h2>
                                {bids[0] && (
                                    <span>
                                        by{" "}
                                        <strong className="text-indigo-600">
                                            {bids[0].created_by || bids[0].created_by}
                                        </strong>
                                    </span>
                                )}
                            </div>

                            <hr className='text-gray-200 my-4' />

                            <div className="flex justify-around">
                                <div className="text-center">
                                    <span className="text-sm font-bold text-indigo-600">Next Min</span>
                                    <h2>${(Number(lastBidAmount) + Number(data.min_increment)).toLocaleString()}</h2>
                                </div>
                                <div className="text-center">
                                    <span className="text-sm font-bold text-indigo-600">Total Bids</span>
                                    <h2>{bids.length}</h2>
                                </div>
                            </div>
                        </Card>

                        {/* QUICK BID */}
                        <Card className="shadow-none">
                            <h2 className="text-sm font-bold text-indigo-600 flex items-center">
                                <SlEnergy className="text-xl rotate-20" /> Quick Bid
                            </h2>

                            <Alert>
                                Minimum bid must be at least $
                                {(Number(lastBidAmount) + Number(data.min_increment)).toLocaleString()}
                            </Alert>

                            {/* Quick Buttons */}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                {[1, 2, 3, 4].map((multiplier) => {
                                    const quickAmount =
                                        Number(lastBidAmount) +
                                        Number(data.min_increment) * multiplier;

                                    return (
                                        <Card
                                            key={multiplier}
                                            className="shadow-none text-center bg-indigo-50 cursor-pointer hover:bg-indigo-100"
                                            onClick={() =>
                                                formik.setFieldValue("amount", quickAmount)
                                            }
                                        >
                                            <span className="text-sm">Quick Bid</span>
                                            <span className="text-3xl font-semibold">
                                                ${quickAmount.toLocaleString()}
                                            </span>
                                        </Card>
                                    );
                                })}
                            </div>

                                <hr className='text-gray-200 my-4' />

                            {/* BID FORM */}
                            {!auctionEnded ? (
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="flex items-end gap-2">
                                        <fieldset className="flex flex-col gap-2 w-3/4">
                                            <label>Custom Amount</label>
                                            <input
                                                type="number"
                                                name="amount"
                                                value={formik.values.amount}
                                                onChange={formik.handleChange}
                                                className="p-2 rounded border border-gray-200"
                                            />
                                            {formik.errors.amount && (
                                                <p className="text-sm text-red-500">
                                                    {formik.errors.amount}
                                                </p>
                                            )}
                                        </fieldset>

                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white w-1/4 p-2 rounded hover:bg-blue-700"
                                        >
                                            Place Bid
                                        </button>
                                    </div>
                                    {errorMessage && (
                                        <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
                                    )}
                                </form>
                            ) : (
                                <p className="text-red-600 font-medium text-sm">
                                    Bidding has ended.
                                </p>
                            )}
                        </Card>
                    </div>

                    {/* RIGHT COLUMN (ACTIVITY) */}
                    <div className="col-span-3 lg:col-span-1">
                        <Card className="shadow-none">
                            <h2 className="text-sm font-bold text-indigo-600 flex items-center">
                                <FiActivity className="text-xl" /> Live Activity
                            </h2>

                            <div className="flex flex-col gap-3 mt-3">
                                {bids.map((bid) => (
                                    <div
                                        key={bid.id}
                                        className="border border-gray-300 rounded-lg bg-gray-50 p-3 flex gap-4 items-center"
                                    >
                                        <RiAuctionLine className="text-lg text-lime-500" />
                                        <div>
                                            <span>
                                                {bid.created_by} bid{" "}
                                                <span className="text-lime-500 font-bold">
                                                    ${Number(bid.amount).toLocaleString()}
                                                </span>
                                            </span>
                                            <div className="text-sm text-gray-700">
                                                {formatTimestamp(bid.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {bids.length === 0 && (
                                    <p className="text-gray-500 text-sm">No bids yet</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
