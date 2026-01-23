"use client"
import NavBar from "@/components/common/Header";
import { ProgressBar } from "@/components/common/ProgressBar";
import WebSiteActions from "@/components/common/WebsiteActions";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <NavBar />
      <WebSiteActions />
      <ProgressBar />
      {children}
    </>
  );
}
