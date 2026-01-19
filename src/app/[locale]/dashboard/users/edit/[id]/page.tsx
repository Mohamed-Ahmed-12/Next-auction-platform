"use client"

import FormBuilder from "@/components/dashboard/FormBuilder";
import { useFetch } from "@/hooks/useFetcher";
import { UserFormFields } from "@/schemas/formSchemas/userForm";
import { updateUser } from "@/services/UsersService";
import { User } from "@/types/auth";
import { useParams } from "next/navigation"

export default function EditUserPage() {
    const { id } = useParams();
    const shouldFetch = id && typeof id === 'string';
    const { data: user, error, loading } = useFetch<User>(shouldFetch ? `auth/users/${id}/` : '')


    // --- RENDER LOGIC ---

    if (!id) {
        return <p>Invalid or missing User ID.</p>
    }

    if (loading) {
        return <p>Loading user data...</p>
    }

    if (error) {
        return <p className="text-red-600">Error loading user: {error}</p>
    }

    if (!user) {
        return <p>User not found.</p>
    }

    // Now you have the 'category' object to use in a form
    return (
        <>
            <FormBuilder title={`Edit User: ${user.username}`} formFields={UserFormFields} onSubmit={updateUser} defaultValues={user} successRedirect="/dashboard/users" />
        </>
    )
}
