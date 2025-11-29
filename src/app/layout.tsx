"use client"
import ProgressArrow from "@/components/common/Arrow";
import "./globals.css";
import NavBar from "@/components/common/Header";
import { Quicksand } from 'next/font/google';
import { AuthProvider } from "@/context/authContext";
import { ToastContainer } from "react-toastify";


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
        <AuthProvider>
          <NavBar />
          {children}
          <ProgressArrow />
          <ToastContainer autoClose={false} position="bottom-right"/>
        </AuthProvider>
      </body>
    </html>
  );
}
