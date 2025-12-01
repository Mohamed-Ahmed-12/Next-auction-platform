
"use client";

import { Sidebar, SidebarCollapse, SidebarItem, SidebarItemGroup, SidebarItems, SidebarLogo } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiUser, HiViewBoards } from "react-icons/hi";
import { RiAuctionLine } from "react-icons/ri";

export function SideBarDashboard({cls}:{cls:string}) {
  return (
    <Sidebar aria-label="Sidebar" className={cls}>
      <SidebarLogo href="#" img="/imgs/auction.png" imgAlt="BidRoom logo" className="text-indigo-500 text-3xl ">
        BidRoom
      </SidebarLogo>
      <SidebarItems>
        <SidebarItemGroup>
          <SidebarItem href="/dashboard" icon={HiChartPie}>
            Dashboard
          </SidebarItem>

          <SidebarCollapse icon={RiAuctionLine } label="Auctions">
            <SidebarItem href="/dashboard/auctions">Auctions</SidebarItem>
            <SidebarItem href="#">Items</SidebarItem>
            <SidebarItem href="#">Bids</SidebarItem>
            <SidebarItem href="#">Results</SidebarItem>
          </SidebarCollapse>
          <SidebarCollapse icon={HiViewBoards} label="Master Data">
            <SidebarItem href="/dashboard/categories">Categories</SidebarItem>
          </SidebarCollapse>
        </SidebarItemGroup>
        <SidebarItemGroup>
          <SidebarItem href="#" icon={HiUser}>
            Profile
          </SidebarItem>
          <SidebarItem href="#" icon={HiArrowSmRight}>
            Logout
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
}
