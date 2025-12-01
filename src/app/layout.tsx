"use client"
import ProgressArrow from "@/components/common/Arrow";
import "./globals.css";
import { Quicksand } from 'next/font/google';
import { AuthProvider } from "@/context/authContext";
import { ToastContainer } from "react-toastify";
import { ThemeInit } from "../../.flowbite-react/init";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={quicksand.className}>
      <body>
        <ThemeInit />
        <AuthProvider>
          {children}
        </AuthProvider>
        <ProgressArrow />
        <ToastContainer autoClose={false} position="bottom-right" />
      </body>
    </html>
  );
}
