"use client";

import { Button, Drawer, DrawerItems } from "flowbite-react";
import { useEffect, useState } from "react";
import LanguageSwitch from "../common/LanguageSwitch";
import NotificationsComponent from "../common/Notifications";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { HiLogout, HiMenuAlt3, } from "react-icons/hi";
import { useTranslations } from "next-intl";
import { SideBarDashboard } from "./SideBar";
import { BiLogOut } from "react-icons/bi";
import { useAuth } from "@/context/authContext";

export function NavBarDashboard() {
  const {logout} = useAuth();
  const t = useTranslations('dashboard')
  const [isOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  useEffect(() => {
    // Close drawer on route change
    handleCloseDrawer();
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 transition-transform group-hover:scale-110">
              <Image src="/imgs/e-Auction.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent hidden sm:block">
              BidRoom
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center">
              <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden xs:block" />
              <div className="flex items-center gap-1 px-1">
                <NotificationsComponent />
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95"
              title="Logout"
            >
              <HiLogout size={22} />
            </button>

            {/* Drawer Toggle */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-95"
            >
              <HiMenuAlt3 size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Styled Drawer */}
      <Drawer
        open={isOpen}
        onClose={handleCloseDrawer}
        position="left" // Switched to right for better thumb reach on mobile
        className="bg-slate-50 p-0 w-80 shadow-2xl"
      >
        <div className="p-6 bg-white border-b border-slate-100 mb-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600">Navigation Menu</h2>
        </div>
        <DrawerItems className="px-2">
          <SideBarDashboard cls=" !w-full" />
        </DrawerItems>
      </Drawer>
    </>
  );
}