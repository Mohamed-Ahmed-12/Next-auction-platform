
"use client"
import FormBuilder from "@/components/dashboard/FormBuilder"
import { UserFormFields } from "@/schemas/formSchemas/userForm"
import { createUser } from "@/services/UsersService"
import { UserManagement } from "@/types/users"
export default function CreateUserPage() {
    return (
        <>
            <FormBuilder<UserManagement> title="New User" formFields={UserFormFields} onSubmit={createUser} successRedirect="/dashboard/users" />
        </>
    )
}
