"use client"
import FormBuilder from "@/components/dashboard/FormBuilder"
import PageHeader from "@/components/dashboard/PageHeader"
import { categoryFormFiels } from "@/schemas/formSchemas/categoryForm"
import { createCategory } from "@/services/CategoryService"
import { Category } from "@/types/main"

export default function CreateCategoryPage() {
    return (
        <>
            <PageHeader title="New Category" />
            <FormBuilder<Category> formFields = {categoryFormFiels} onSubmit={createCategory} successRedirect="/dashboard/categories"/>
        </>
    )
}