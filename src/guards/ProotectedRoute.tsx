import { useAuth } from "@/context/authContext";
import { Alert, Spinner } from "flowbite-react";
import React from "react";
import { HiInformationCircle } from "react-icons/hi";

export default function ProtectedRoute({ children,cls }: { children: React.ReactNode ,cls?:string}) {
    const { isAuthenticated, isLoading } = useAuth();

    // 1. Show loading state while checking authentication status
    if (isLoading) {
        return (
            <>
                <div className="flex justify-center items-center w-full h-full absolute top-0">
                <Spinner color="purple" aria-label="loading" />
            </div>
            </>
        );
    }

    // 2. If authenticated, render the child components (the protected content)
    if (isAuthenticated) {
        return <>{children}</>;
    }

    // 3. If not authenticated and loading is complete, show the error message
    return (
        <div className={cls}>
            <Alert color="failure" icon={HiInformationCircle}>
                <span className="font-medium">Sorry, you must be logged in to access that page.</span>
            </Alert>
        </div>
    )
}