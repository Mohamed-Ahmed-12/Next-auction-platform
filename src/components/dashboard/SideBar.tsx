"use client";

import { Button, Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser, HiViewBoards } from "react-icons/hi";
import { IoPeople, IoSettings } from "react-icons/io5";
import { RiAuctionLine } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { IconType } from "react-icons";
import { MdContactPhone, MdMiscellaneousServices } from "react-icons/md";
import { FaPeopleGroup, FaQuestion } from "react-icons/fa6";
import { ImBlogger } from "react-icons/im";
import { IoIosInformationCircle } from "react-icons/io";
import { BiCalendar } from "react-icons/bi";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { SlEnergy } from "react-icons/sl";
import LanguageSwitch from "../common/LanguageSwitch";
import { useRole } from "@/hooks/useRoleBased";


interface MenuItem {
  label: string;
  href?: string;
  icon?: IconType;
  children?: MenuItem[];
}
// Custom styling for active and inactive items to match AuctionBidPage
export const getSidebarTheme = () => ({
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
    label: { base: "ms-3 flex-1 whitespace-nowrap text-start" }
  }
});


export function SideBarDashboard({ cls }: { cls?: string }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const isAdmin = useRole('admin');

  const menuItems: MenuItem[] = [
    { label: t("dashboard"), href: "/dashboard", icon: HiChartPie },
    { label: t("auctions"), href: "/dashboard/auctions", icon: RiAuctionLine },
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
  const managementItems: MenuItem[] = [
    { label: t("users"), href: "/dashboard/users", icon: FaPeopleGroup },
    { label: "rolesPermissions", href: "/dashboard/management/roles-permissions", icon: IoSettings },
    { label: "systemSettings", href: "/dashboard/management/settings", icon: IoSettings },
  ];

  const accountItems: MenuItem[] = [
    { label: t("profile"), href: "/dashboard/profile", icon: HiUser },

  ];


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
            <div className="border-e-2 border-slate-100 p-3 space-y-1">
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
          className={`transition-all duration-300 mb-3 ${active ? 'translate-x-1' : ''}`}
        >
          {item.label}
        </SidebarItem>
      );
    });
  };

  return (
    <Sidebar aria-label="Sidebar" theme={getSidebarTheme()} className={cls}>
      <SidebarItems>
        {/* Main Section */}
        <div className="mb-4">
          <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">
            {t("mainMenu")}
          </p>
          <SidebarItemGroup className="border-none !mt-0">
            {renderMenuItems(menuItems)}
          </SidebarItemGroup>
        </div>
           {/* Management Section For Admin */}
          < div className="pt-4 border-t border-slate-200">
            <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">
              Management
            </p>
            <SidebarItemGroup className="border-none !mt-0">
              {renderMenuItems(managementItems)}
            </SidebarItemGroup>
          </div>

        {/* Account Section */}
        <div className="pt-4 border-t border-slate-200">
          <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3"> {t("account")} </p>
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
      {/* Language Switcher */}
      <div className="mt-6 px-4">
        <LanguageSwitch />
      </div>
    </Sidebar >
  );
}