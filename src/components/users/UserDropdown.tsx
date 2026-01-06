"use client"
import { useAuth } from "@/context/authContext";
import { Link } from "@/i18n/navigation";
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { useTranslations } from "next-intl";
import { HiCog, HiLogout, HiViewGrid } from "react-icons/hi";

export function UserComponent() {
    const t = useTranslations('dashboard')
    const { logout } = useAuth();

    return (
        <Dropdown label="Welcome" inline>
            <DropdownHeader>
                <span className="block text-sm">Bonnie Green</span>
                <span className="block truncate text-sm font-medium">bonnie@flowbite.com</span>
            </DropdownHeader>
            <DropdownItem icon={HiViewGrid} href="/dashboard" as={Link}>{t("dashboard")}</DropdownItem>
            <DropdownItem icon={HiCog}>{t("settings")}</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={HiLogout} onClick={logout}>{t("logout")}</DropdownItem>
        </Dropdown>
    );
}

