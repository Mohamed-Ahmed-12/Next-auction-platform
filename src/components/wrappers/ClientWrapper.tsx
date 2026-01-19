"use client";
import { ThemeInit } from "../../../.flowbite-react/init"
import { AuthProvider, useAuth } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { ProgressBar } from "../common/ProgressBar";
import WebSiteActions from "../common/WebsiteActions";
import { createTheme, ThemeProvider } from "flowbite-react";

const LogoutSetter = () => {
    const { logout } = useAuth();
    useEffect(() => {
        import('@/lib/network').then(({ setLogoutFunction }) => {
            setLogoutFunction(logout);
        });
    }, [logout]);
    return null;
};

const customTheme = createTheme({
    modal: {
        "header": {
            "close": {
                "base": "mx-0",
            }
        },
    }
})
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={customTheme}>
            <ThemeInit />
            <WebSiteActions />
            <ProgressBar />
            <AuthProvider>
                {children}
                <LogoutSetter />
            </AuthProvider>

            <ToastContainer autoClose={2000} position="bottom-right" />
        </ThemeProvider>
    );
}
