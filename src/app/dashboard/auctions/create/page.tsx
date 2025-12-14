"use client"
import FormBuilder from "@/components/dashboard/FormBuilder"
import PageHeader from "@/components/dashboard/PageHeader"
import { AuctionFormFields } from "@/schemas/formSchemas/AuctionForm"   
import { createAuction } from "@/services/AuctionService"
import { Auction } from "@/types/main"

export default function CreateCategoryPage() {
    return (
        <>
            <PageHeader title="New Auction" />
            <FormBuilder<Auction> formFields = {AuctionFormFields} onSubmit={createAuction} successRedirect="/dashboard/auctions"/>
        </>
    )
}