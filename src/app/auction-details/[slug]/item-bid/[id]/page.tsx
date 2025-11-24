"use client";
import BidForm from '@/components/auction/BidForm';
import { useParams } from 'next/navigation';
import React from 'react';
import { useFetch } from '../../../../../../hooks/useFetcher';
import { Item } from '@/types/main';

export default function ItemPage() {
    const { id: itemId } = useParams() as { id: string };
    const { data, error, loading } = useFetch<Item>(`items/${itemId}/`);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!data) return <h2>No item found</h2>;


    return (
        <>
            <h1 className="text-xl font-bold mb-4">{data.title}</h1>
            <p className="mb-2">{data.desc}</p>
            <BidForm
                id={itemId}
                data={data}
            />
        </>
    );
}
