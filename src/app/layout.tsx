"use client"
import ProgressArrow from "@/components/common/Arrow";
import "./globals.css";
import { Quicksand, Noto_Naskh_Arabic } from 'next/font/google';
import { AuthProvider, useAuth } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import { ThemeInit } from "../../.flowbite-react/init";
import { useEffect } from "react";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});
const noto = Noto_Naskh_Arabic({
  weight: ['400', '500', '600', '700'],

})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" className={`${quicksand.className} ${noto.className}`}>
      <body>
        <ThemeInit />
        <AuthProvider>
          {children}
          <LogoutSetter />
        </AuthProvider>
        <ProgressArrow />
        <ToastContainer autoClose={false} position="bottom-right" />
      </body>
    </html>
  );
}

const LogoutSetter = () => {
  const { logout } = useAuth();
  
  useEffect(() => {
    // Set the logout function in the network module
    import('@/lib/network').then(({ setLogoutFunction }) => {
      setLogoutFunction(logout);
    });
  }
  , [logout]);
  
  return null; // This component does not render anything
}