"use client"
import FormBuilder from "@/components/dashboard/FormBuilder";
import PageHeader from "@/components/dashboard/PageHeader";
import { ItemFormFields } from "@/schemas/formSchemas/itemForm";
import { createItem } from "@/services/ItemServices";
import { Item } from "@/types/main";

export default function CreateItemPage() {
    return (
        <>
            <PageHeader title="New Item" />
            <FormBuilder<Item> formFields={ItemFormFields} onSubmit={createItem} successRedirect="/dashboard/items"/>
        </>
    )
}