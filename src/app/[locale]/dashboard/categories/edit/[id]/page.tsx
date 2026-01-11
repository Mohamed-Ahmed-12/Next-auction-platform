'use client'
import FormBuilder from "@/components/dashboard/FormBuilder";
import PageHeader from "@/components/dashboard/PageHeader";
import { categoryFormFields } from "@/schemas/formSchemas/categoryForm";
import { useFetch } from "@/hooks/useFetcher";
import { updateCategory } from "@/services/CategoryService";
import { Category } from "@/types/main";
import { useParams } from "next/navigation"

export default function EditCategoryPage() {
    const { id } = useParams();
    const shouldFetch = id && typeof id === 'string';
    const { data: category, loading, error } = useFetch<Category>(shouldFetch ? `category/${id}` : '');

    // --- RENDER LOGIC ---

    if (!id) {
        return <p>Invalid or missing Category ID.</p>
    }

    if (loading) {
        return <p>Loading category data...</p>
    }

    if (error) {
        return <p className="text-red-600">Error loading category: {error}</p>
    }

    if (!category) {
        return <p>Category not found.</p>
    }

    // Now you have the 'category' object to use in a form
    return (
        <>
            <FormBuilder title={`Edit Category: ${category.title}`} formFields={categoryFormFields} onSubmit={updateCategory} defaultValues={category} successRedirect="/dashboard/categories" />
        </>
    )
}