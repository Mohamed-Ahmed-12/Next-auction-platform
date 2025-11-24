import React from 'react'
import { useFetch } from '../../../hooks/useFetcher'
import { Auction } from '@/types/main';
import AuctionLiveFeed from './BidForm';
import Link from 'next/link';

export default function AuctionDetails({ slug }: { slug: string }) {
    const { data, error, loading } = useFetch<Auction>(`auction/${slug}`);
    if (loading) {
        return <h2>loading...</h2>
    }
    if (error) {
        return <h2>Error {error}</h2>
    }
    if (!data) {
        return <h2>No Auction available.</h2>;
    }
    return (
        <div className="container mx-auto px-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl my-20">
            <h1 className="font-bold text-3xl mb-5">Auction Details</h1>

        </div>
    );
}