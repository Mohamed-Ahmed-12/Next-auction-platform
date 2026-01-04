"use client"
import NavBar from "@/components/common/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
        <NavBar />
        {children}
    </>
  );
}
