"use client";

import { Drawer, DrawerItems, Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { useEffect, useState } from "react";
import LanguageSwitch from "../common/LanguageSwitch";
import NotificationsComponent from "../common/Notifications";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { HiArrowSmRight, HiChartPie, HiMenuAlt3, HiUser, HiViewBoards } from "react-icons/hi"; // Thicker, cleaner icon
import { useTranslations } from "next-intl";
import { SlEnergy } from "react-icons/sl";
import { IconType } from "react-icons";
import { RiAuctionLine } from "react-icons/ri";
import { FaPeopleGroup, FaQuestion } from "react-icons/fa6";
import { SiGoogleanalytics } from "react-icons/si";
import { BiCalendar } from "react-icons/bi";
import { IoIosInformationCircle } from "react-icons/io";
import { MdContactPhone, MdMiscellaneousServices } from "react-icons/md";
import { ImBlogger } from "react-icons/im";
import { IoSettings } from "react-icons/io5";

export function NavBarDashboard() {
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
            <div className="flex items-center bg-slate-50/50 rounded-2xl p-1 border border-slate-100">
              <LanguageSwitch />
              <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden xs:block" />
              <div className="flex items-center gap-1 px-1">
                <NotificationsComponent />
                {/* <UserComponent /> */}
              </div>
            </div>

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
        position="right" // Switched to right for better thumb reach on mobile
        className="bg-slate-50 p-0 w-80 shadow-2xl"
      >
        <div className="p-6 bg-white border-b border-slate-100 mb-2">
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-600">Navigation Menu</h2>
        </div>
        <DrawerItems className="px-2">
          <SideBarDashboard cls="!bg-transparent !w-full" />
        </DrawerItems>
      </Drawer>
    </>
  );
}

interface MenuItem {
  label: string;
  href?: string;
  icon?: IconType;
  children?: MenuItem[];
}


export function SideBarDashboard({ cls }: { cls?: string }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();

  const menuItems: MenuItem[] = [

    { label: t("dashboard"), href: "/dashboard", icon: HiChartPie },

    { label: t("auctions"), href: "/dashboard/auctions", icon: RiAuctionLine },

    { label: t("users"), href: "/dashboard/users", icon: FaPeopleGroup },

    { label: t("analytics"), href: "/dashboard/analytics", icon: SiGoogleanalytics },

    {

      label: t("masterData"),

      icon: HiViewBoards,

      children: [

        { label: t("categories"), href: "/dashboard/categories" },

      ],

    },

    { label: t("calendar"), href: "/dashboard/calendar", icon: BiCalendar },

  ];



  const pages: MenuItem[] = [
    {
      label: t("pages"),
      icon: MdMiscellaneousServices,
      children: [

        { label: t("about"), href: "#about", icon: IoIosInformationCircle },

        { label: t("contact"), href: "#contact", icon: MdContactPhone },

        { label: t("blog"), href: "#blog", icon: ImBlogger },

        { label: t("faq"), href: "#faq", icon: FaQuestion },

        { label: t("career"), href: "#career", icon: FaPeopleGroup },

      ]

    },

  ];



  const accountItems: MenuItem[] = [

    { label: t("profile"), href: "/dashboard/profile", icon: HiUser },

    { label: t("settings"), href: "/dashboard/settings", icon: IoSettings },

    { label: t("logout"), href: "/logout", icon: HiArrowSmRight },

  ];
  // Custom styling for active and inactive items to match AuctionBidPage
  const getSidebarTheme = () => ({
    root: {
      inner: "bg-transparent py-4 px-3"
    },
    item: {
      base: "flex items-center justify-center rounded-xl p-3 text-base font-medium transition-all duration-200",
      active: "bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold",
      inactive: "text-slate-600 hover:bg-white/50 hover:text-indigo-600",
      icon: {
        base: "h-5 w-5 flex-shrink-0 transition duration-75",
        active: "text-indigo-600",
      }
    },
    collapse: {
      button: "group flex w-full items-center rounded-2xl p-3 text-base font-medium text-slate-600 transition duration-75 hover:bg-white/50",
      label: { base: "ml-3 flex-1 whitespace-nowrap text-left" }
    }
  });

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      const active = item.href && pathname === item.href;
      const isCollapseOpen = (children: MenuItem[]): boolean => {

        return children.some(child => child.href && pathname.startsWith(child.href));

      };

      if (item.children) {
        return (
          <SidebarCollapse
            key={item.label}
            icon={item.icon}
            label={item.label}
            open={isCollapseOpen(item.children)}
            className="rounded-2xl mb-1"
          >
            <div className="ml-4 border-l-2 border-slate-100 pl-2 mt-1 space-y-1">
              {renderMenuItems(item.children)}
            </div>
          </SidebarCollapse>
        );
      }
      return (
        <SidebarItem
          key={item.href || item.label}
          href={item.href}
          icon={item.icon}
          active={!!active}
          as={Link}
          className={`mb-1 transition-all duration-300 ${active ? 'translate-x-1' : ''}`}
        >
          {item.label}
        </SidebarItem>
      );
    });
  };

  return (
    <Sidebar
      aria-label="Sidebar"
      theme={getSidebarTheme()} // Apply custom theme
      className={cls}
    >
      <SidebarItems>
        {/* Main Section */}
        <div className="mb-4">
          <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">{t('mainMenu')}</p>
          <SidebarItemGroup className="border-none !mt-0">
            {renderMenuItems(menuItems)}
          </SidebarItemGroup>
        </div>

        {/* Account Section */}
        <div className="pt-4 border-t border-slate-200">
          <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">{t('account')}</p>
          <SidebarItemGroup className="border-none !mt-0">
            {renderMenuItems(accountItems)}
          </SidebarItemGroup>
        </div>
      </SidebarItems>

      {/* Visual Footer in Sidebar */}
      <div className="mt-10 p-4 bg-indigo-600 rounded-3xl text-white relative overflow-hidden">
        <SlEnergy className="absolute -right-2 -bottom-2 text-white/20 w-16 h-16 rotate-12" />
        <p className="text-xs font-bold opacity-80">Ready to Bid?</p>
        <p className="text-sm font-black italic">Check new auctions!</p>
      </div>
    </Sidebar>
  );
}