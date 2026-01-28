"use client"
import { useAuth } from "@/context/authContext";
import { useRole } from "@/hooks/useRoleBased";
import { Link } from "@/i18n/navigation";
import { Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { useTranslations } from "next-intl";
import { BiUser } from "react-icons/bi";
import { HiCog, HiLogout, HiViewGrid } from "react-icons/hi";

export function UserComponent() {
    const t = useTranslations('dashboard')
    const isUser = useRole("user")
    const { logout, user } = useAuth();

    return (
        <Dropdown label={<BiUser size={25} />} inline>
            <DropdownHeader>
                <span className="block text-sm">{user?.username}</span>
                <span className="block truncate text-sm font-medium">{user?.email}</span>
            </DropdownHeader>
            {
                !isUser && (
                    <DropdownItem icon={HiViewGrid} href="/dashboard" as={Link}>{t("dashboard")}</DropdownItem>
                )
            }
            <DropdownItem icon={HiCog}>{t("settings")}</DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={HiLogout} onClick={logout}>{t("logout")}</DropdownItem>
        </Dropdown>
    );
}

