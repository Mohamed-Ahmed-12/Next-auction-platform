
"use client"
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import { useState } from "react";
import { SidebarDrawer } from "./SidebarDrawer";
import LanguageSwitch from "../common/LanguageSwitch";
import NotificationsComponent from "../common/Notifications";
import { UserComponent } from "../users/UserDropdown";

export function NavBarDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar fluid rounded className="bg-gray-50">
      <NavbarBrand href="/">
        <img src="/imgs/e-Auction.png" className="mr-3 h-6 sm:h-9" alt="BidRoom Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BidRoom</span>
      </NavbarBrand>
      <ul className="flex items-center gap-1 md:gap-4">
        <li>
          <LanguageSwitch />

        </li>
        <li>
          <NotificationsComponent />

        </li>
        <li>
          <UserComponent />

        </li>
        <li>
          <NavbarToggle onClick={() => setIsOpen(!isOpen)} />

        </li>
      </ul>
      <SidebarDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Navbar>
  );
}

