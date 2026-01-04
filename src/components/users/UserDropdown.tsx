"use client"
import { useAuth } from "@/context/authContext";
import { Link } from "@/i18n/navigation";
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { HiCog, HiLogout, HiViewGrid } from "react-icons/hi";

export function UserComponent() {
    const { logout } = useAuth();

    return (
        <Dropdown label="Welcome" inline>
            <DropdownHeader>
                <span className="block text-sm">Bonnie Green</span>
                <span className="block truncate text-sm font-medium">bonnie@flowbite.com</span>
            </DropdownHeader>
            <DropdownItem icon={HiViewGrid} href="/dashboard" as={Link}>Dashboard</DropdownItem>
            <DropdownItem icon={HiCog}>Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={HiLogout} onClick={logout}>Logout</DropdownItem>
        </Dropdown>
    );
}

