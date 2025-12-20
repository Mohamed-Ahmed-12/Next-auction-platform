
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

export function NavBarDashboard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Navbar fluid rounded className="bg-gray-50">
      <NavbarBrand href="https://flowbite-react.com">
        <img src="/imgs/e-Auction.png" className="mr-3 h-6 sm:h-9" alt="BidRoom Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">BidRoom</span>
      </NavbarBrand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>

        <NavbarToggle onClick={() => setIsOpen(!isOpen)} />
      </div>
      <SidebarDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Navbar>
  );
}

