"use client"
import AuctionDetails from '@/components/auction/AuctionDetails';
import { useParams } from 'next/navigation'
import React, { Suspense} from 'react'

export default function AuctionDetailsPage() {
    const { slug }: { slug: string } = useParams();

    return (
        <Suspense fallback={<h1>loading...</h1>}>
            <AuctionDetails slug={slug} />
        </Suspense>
    )
}
