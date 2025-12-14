"use client";

import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";
import { usePathname } from "next/navigation";
import { HiArrowSmRight, HiChartPie, HiUser, HiViewBoards } from "react-icons/hi";
import { IoSettings } from "react-icons/io5";
import { RiAuctionLine } from "react-icons/ri";
import { SiGoogleanalytics } from "react-icons/si";
import { IconType } from "react-icons"; // Import IconType for the menu structure
import { MdContactPhone, MdMiscellaneousServices } from "react-icons/md";
import { FaPeopleGroup, FaQuestion } from "react-icons/fa6";
import { ImBlogger } from "react-icons/im";
import { IoIosInformationCircle } from "react-icons/io";
import { BiCalendar } from "react-icons/bi";

// --- 1. Define the Menu Structure Types ---
interface MenuItem {
  label: string;
  href?: string; // Optional for collapse parents
  icon?: IconType;
  children?: MenuItem[]; // Optional for nested items
}

// --- 2. Define the Menu Structure Data ---
const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: HiChartPie,
  },
  {
    label: "Auctions",
    icon: RiAuctionLine,
    children: [
      { label: "Auctions", href: "/dashboard/auctions", },
      { label: "Items", href: "/dashboard/items", },
    ],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: FaPeopleGroup,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: SiGoogleanalytics,
  },
  {
    label: "Master Data",
    icon: HiViewBoards,
    children: [
      { label: "Categories", href: "/dashboard/categories", },
    ],
  },
  {
    label: "Calendar",
    icon: BiCalendar,
    href: "/dashboard/calendar",
  },
];

const accountItems: MenuItem[] = [
  { label: "Profile", href: "/dashboard/profile", icon: HiUser },
  { label: "Settings", href: "/dashboard/settings", icon: IoSettings },
  { label: "Logout", href: "/logout", icon: HiArrowSmRight },
];

const pages: MenuItem[] = [
  {
    label: "Pages", icon: MdMiscellaneousServices,
    children: [
      { label: "About", href: "#about", icon: IoIosInformationCircle },
      { label: "Contact", href: "#contact", icon: MdContactPhone },
      { label: "Blog", href: "#blog", icon: ImBlogger },
      { label: "FAQ", href: "#faq", icon: FaQuestion },
      { label: "Career", href: "#career", icon: FaPeopleGroup },

    ]
  },
];


// --- 3. Sidebar Rendering Component ---
export function SideBarDashboard({ cls }: { cls: string }) {
  const pathname = usePathname();

  // Helper function to check if a path is active
  const isActive = (href: string) => pathname === href;

  // Helper function to check if a collapse group should be open
  // It checks if the current pathname starts with the base path of any child item
  const isCollapseOpen = (children: MenuItem[]): boolean => {
    return children.some(child => child.href && pathname.startsWith(child.href));
  };

  // Recursive function to render menu items
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => {
      // Check if the item has children (Collapse)
      if (item.children) {
        return (
          <SidebarCollapse
            key={item.label}
            icon={item.icon}
            label={item.label}
            open={isCollapseOpen(item.children)} // Dynamic open check
          >
            {renderMenuItems(item.children)} {/* Recurse for nested items */}
          </SidebarCollapse>
        );
      }
      // Otherwise, render a standard SidebarItem
      else {
        return (
          <SidebarItem
            key={item.href || item.label}
            href={item.href}
            icon={item.icon}
            active={!!(item.href && isActive(item.href))}
            labelColor={"black"}
          >
            {item.label}
          </SidebarItem>
        );
      }
    });
  };

  return (
    <Sidebar aria-label="Sidebar" className={cls}>
      <SidebarLogo href="/" img="/imgs/e-Auction.png" imgAlt="BidRoom logo" className="text-indigo-500 text-3xl ">
        BidRoom
      </SidebarLogo>
      <SidebarItems>
        {/* Primary Group (Data) */}
        <SidebarItemGroup>
          {renderMenuItems(menuItems)}
        </SidebarItemGroup>

        {/* Secondary Group (Pages) */}
        <SidebarItemGroup>
          {renderMenuItems(pages)}
        </SidebarItemGroup>

        {/* Third Group (Account) */}
        <SidebarItemGroup>
          {renderMenuItems(accountItems)}
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}