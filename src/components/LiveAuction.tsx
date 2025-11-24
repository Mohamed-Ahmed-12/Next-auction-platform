"use client"
import { fetchAuctionByStatus } from "@/lib/api";
import { Auction } from "@/types/main";
import React, { useEffect, useState } from "react";
const LiveAuctions = () => {
    const status = 'live';
    const [auctions, setAuctions] = useState<Auction[] | null>(null);
    useEffect(()=>{
        fetchAuctionByStatus(status)
        .then((data)=>{
            setAuctions(data)
        })
        .finally(()=>{

        })
    },[])
    useEffect(()=>{console.log(auctions)},[auctions])
    return (
        <>
            <h1>Live Auctions</h1>
        </>
    )
}
export default LiveAuctions;