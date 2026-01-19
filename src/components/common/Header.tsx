"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { Button, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { HiMenu, HiMenuAlt3 } from "react-icons/hi";
import { useTranslations } from "next-intl";

import { useAuth } from "@/context/authContext";
import { LoginModal } from "../users/LoginModal";
import NotificationsComponent from "./Notifications";
import { UserComponent } from "../users/UserDropdown";
import LanguageSwitch from "./LanguageSwitch";

const NavBar = () => {
    const t = useTranslations();
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    // States
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const NavLinks = [
        { label: t("header.home"), href: "/" },
        { label: t("dashboard.auctions"), href: "/auction-list" },
        { label: t("dashboard.about"), href: "/about" },
        { label: t("dashboard.contact"), href: "/contact" },
        { label: t("dashboard.faq"), href: "/faq" },
        { label: t("dashboard.blog"), href: "/blog" },
    ];

    const handleCloseDrawer = () => setIsDrawerOpen(false);

    useEffect(() => {
        // Close drawer on route change
        handleCloseDrawer();
    }, [pathname]);
    return (
        <>
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                    {/* 1. Logo Section */}
                    <div className="flex items-center gap-2 shrink-0">

                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-10 h-10 transition-transform group-hover:scale-110">
                                <Image src="/imgs/e-Auction.png" alt="logo" fill className="object-contain" />
                            </div>
                            <span className="hidden sm:block text-2xl font-black bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
                                BidRoom
                            </span>
                        </Link>
                    </div>

                    {/* 2. Desktop Navigation (Hidden on Mobile/Tablet) */}
                    <nav className="hidden lg:flex items-center justify-center flex-1 px-8">
                        <ul className="flex items-center gap-1">
                            {NavLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                                                ? "bg-indigo-50 text-indigo-700"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* 3. Actions Section (Auth/Language/Notifs) */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden md:block">
                            <LanguageSwitch />
                        </div>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 border-l pl-3 sm:pl-4 border-gray-200">
                                <NotificationsComponent />
                                <UserComponent />
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                pill
                                className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                onClick={() => setOpenModal(true)}
                            >
                                {t("header.login")}
                            </Button>
                        )}
                        
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-all active:scale-95"
                        >
                            <HiMenuAlt3 size={24} />
                        </button>
                    </div>

                    


                </div>
            </header>

            {/* Mobile/Tablet Side Drawer */}
            <Drawer open={isDrawerOpen} onClose={handleCloseDrawer} position="left" className="w-72">
                <DrawerHeader title="MENU" titleIcon={() => <HiMenu className="mr-2" />} />
                <DrawerItems>
                    <div className="flex flex-col h-full justify-between py-4">
                        <ul className="space-y-2">
                            {NavLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={handleCloseDrawer}
                                        className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${pathname === link.href
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 pt-6 border-t border-gray-100 xs:hidden">
                            <p className="text-xs font-bold text-gray-400 mb-4 px-4 uppercase tracking-widest">Language</p>
                            <LanguageSwitch />
                        </div>
                    </div>
                </DrawerItems>
            </Drawer>

            <LoginModal isOpen={openModal} onClose={() => setOpenModal(false)} />
        </>
    );
};

export default NavBar;