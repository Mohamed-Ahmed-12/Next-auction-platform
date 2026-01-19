'use client'
import FormBuilder from "@/components/dashboard/FormBuilder";
import { useFetch } from "@/hooks/useFetcher";
import { Auction } from "@/types/main";
import { useParams } from "next/navigation"
import { AuctionFormFields } from "@/schemas/formSchemas/AuctionForm";
import { updateAuction } from "@/services/AuctionService";

export default function EditAuctionPage() {
    const { slug } = useParams();
    const shouldFetch = slug && typeof slug === 'string';
    const { data: auction, loading, error } = useFetch<Auction>(shouldFetch ? `auction/${slug}/get-update/` : '');

    // --- RENDER LOGIC ---

    if (!slug) {
        return <p>Invalid or missing Auction ID.</p>
    }

    if (loading) {
        return <p>Loading auction data...</p>
    }

    if (error) {
        return <p className="text-red-600">Error loading auction: {error}</p>
    }

    if (!auction) {
        return <p>auction not found.</p>
    }

    // Now you have the 'category' object to use in a form
    return (
        <>
            <FormBuilder title={`Edit Auction: ${auction.slug}`} formFields={AuctionFormFields} onSubmit={updateAuction} defaultValues={auction} successRedirect="/dashboard/auctions" />
        </>
    )
}