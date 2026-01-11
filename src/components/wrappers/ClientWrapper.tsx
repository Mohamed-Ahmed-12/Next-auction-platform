"use client";
import {ThemeInit} from "../../../.flowbite-react/init"
import { AuthProvider, useAuth } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { ProgressBar } from "../common/ProgressBar";
import WebSiteActions from "../common/WebsiteActions";

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
            <WebSiteActions /> 
            <ProgressBar /> 
            <AuthProvider>
                {children}
                <LogoutSetter />
            </AuthProvider>
            
            <ToastContainer autoClose={2000} position="bottom-right" />
        </>
    );
}
