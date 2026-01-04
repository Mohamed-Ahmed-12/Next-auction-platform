
"use client"
import FormBuilder from "@/components/dashboard/FormBuilder"
import PageHeader from "@/components/dashboard/PageHeader"
import { UserFormFields } from "@/schemas/formSchemas/userForm"
import { createUser } from "@/services/UsersService"
import { User } from "@/types/auth"
export default function CreateUserPage() {
    return (
        <>
            <PageHeader title="New User" />
            <FormBuilder<User> formFields={UserFormFields} onSubmit={createUser} successRedirect="/dashboard/users" />
        </>
    )
}
