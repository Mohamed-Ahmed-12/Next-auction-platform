'use client'
import FormBuilder from "@/components/dashboard/FormBuilder";
import PageHeader from "@/components/dashboard/PageHeader";
import { useFetch } from "@/hooks/useFetcher";
import { Item } from "@/types/main";
import { useParams } from "next/navigation"
import { ItemFormFields } from "@/schemas/formSchemas/itemForm";
import { updateItem } from "@/services/ItemServices";

export default function EditItemPage() {
    const { slug } = useParams();
    const shouldFetch = slug && typeof slug === 'string';
    const { data: item, loading, error, refetch } = useFetch<Item>(shouldFetch ? `item/${slug}/get-update/` : '');

    // --- RENDER LOGIC ---

    if (!slug) {
        return <p>Invalid or missing Item ID.</p>
    }

    if (loading) {
        return <p>Loading item data...</p>
    }

    if (error) {
        return <p className="text-red-600">Error loading item: {error}</p>
    }

    if (!item) {
        return <p>item not found.</p>
    }

    return (
        <>
            <PageHeader title={`Edit Item: ${item.title}`} />
            <FormBuilder formFields={ItemFormFields} onSubmit={updateItem} defaultValues={item} successRedirect="/dashboard/items" />
        </>
    )
}