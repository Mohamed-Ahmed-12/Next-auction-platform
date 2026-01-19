
"use client"
import FormBuilder from "@/components/dashboard/FormBuilder"
import { UserFormFields } from "@/schemas/formSchemas/userForm"
import { createUser } from "@/services/UsersService"
import { User } from "@/types/auth"
export default function CreateUserPage() {
    return (
        <>
            <FormBuilder<User> title="New User" formFields={UserFormFields} onSubmit={createUser} successRedirect="/dashboard/users" />
        </>
    )
}
