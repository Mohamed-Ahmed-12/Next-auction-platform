"use client"
import FormBuilder from "@/components/dashboard/FormBuilder"
import { AuctionFormFields } from "@/schemas/formSchemas/AuctionForm"   
import { createAuction } from "@/services/AuctionService"
import { Auction } from "@/types/main"

export default function CreateCategoryPage() {
    return (
        <>
            <FormBuilder<Auction> title="New Auction" formFields = {AuctionFormFields} onSubmit={createAuction} successRedirect="/dashboard/auctions"/>
        </>
    )
}