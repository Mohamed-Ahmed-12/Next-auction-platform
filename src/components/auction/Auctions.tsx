"use client"
import { Auction } from "@/types/main";
import React from "react";
import { useFetch } from "../../../hooks/useFetcher";
import Link from "next/link";
import { Button } from "flowbite-react";
import { AuctionCard } from "./AuctionCard";
const Auctions = ({ status }: { status: string }) => {
    const { data: auctions, loading, error } = useFetch<Auction[]>(`auction/?status=${status}`);
    if (loading) {
        return <h2>loading...</h2>
    }
    if (error) {
        return <h2>Error {error}</h2>
    }
    if (!auctions || auctions.length === 0) {
        return ;
    }
    return (
        <div className="flex flex-col my-20">
            <h1 className="font-bold text-3xl mb-5">{status} Auctions</h1>
            <div className="flex justify-between items-center mb-10">
                <span className="w-[70%]">Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth.</span>
                <Button color={"alternative"}>View All</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {
                    auctions.map((auction) => (
                       <AuctionCard key={auction.id} auction={auction} />
                    ))
                }

            </div>
            
        </div>
    )
}
export default Auctions;