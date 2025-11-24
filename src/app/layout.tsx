"use client"
import ProgressArrow from "@/components/common/Arrow";
import "./globals.css";
import NavBar from "@/components/common/Header";
import { Quicksand } from 'next/font/google';


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
        <NavBar />
        {children}
        <ProgressArrow />
      </body>
    </html>


  );
}
