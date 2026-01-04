"use client";
import {ThemeInit} from "../../../.flowbite-react/init"
import { AuthProvider, useAuth } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import ProgressArrow from "@/components/common/Arrow";

const LogoutSetter = () => {
    const { logout } = useAuth();
    useEffect(() => {
        import('@/lib/network').then(({ setLogoutFunction }) => {
            setLogoutFunction(logout);
        });
    }, [logout]);
    return null;
};

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeInit />
            <AuthProvider>
                {children}
                <LogoutSetter />
            </AuthProvider>
            <ProgressArrow />
            <ToastContainer autoClose={2000} position="bottom-right" />
        </>
    );
}
