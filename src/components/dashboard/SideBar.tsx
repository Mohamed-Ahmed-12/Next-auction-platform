"use client";

import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems } from "flowbite-react";
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
        // { label: t("about"), href: "#about", icon: IoIosInformationCircle },
        // { label: t("contact"), href: "#contact", icon: MdContactPhone },
        // { label: t("blog"), href: "#blog", icon: ImBlogger },
        // { label: t("faq"), href: "#faq", icon: FaQuestion },
        // { label: t("career"), href: "#career", icon: FaPeopleGroup },
      ]
    },
  ];

  const accountItems: MenuItem[] = [
    {
      label: t("settings"), children: [
        {
          label: "Roles & Permissions",
          href: "/roles-and-perm",
          icon: IoPeople
        },
      ], icon: IoSettings
    },
    { label: t("profile"), href: "/dashboard/profile", icon: HiUser },

    { label: t("logout"), href: "/logout", icon: HiArrowSmRight },
  ];

  const isActive = (href: string) => pathname === href;
  const isCollapseOpen = (children: MenuItem[]): boolean => {
    return children.some(child => child.href && pathname.startsWith(child.href));
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      if (item.children) {
        return (
          <SidebarCollapse
            key={item.label}
            icon={item.icon}
            label={item.label}
            open={isCollapseOpen(item.children)}
          >
            {renderMenuItems(item.children)}
          </SidebarCollapse>
        );
      }
      return (
        <SidebarItem
          key={item.href || item.label}
          href={item.href}
          icon={item.icon}
          active={!!(item.href && isActive(item.href))}
          as={Link}
        >
          {item.label}
        </SidebarItem>
      );
    });
  };

  return (
    <Sidebar aria-label="Sidebar" className={cls}>
      <SidebarItems>
        <SidebarItemGroup>{renderMenuItems(menuItems)}</SidebarItemGroup>
        <SidebarItemGroup>{renderMenuItems(pages)}</SidebarItemGroup>
        <SidebarItemGroup>{renderMenuItems(accountItems)}</SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}