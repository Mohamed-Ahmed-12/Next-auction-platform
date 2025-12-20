
"use client";

import {
  Button,
  Drawer,
  DrawerHeader,
  DrawerItems,
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  TextInput,
} from "flowbite-react";
import {
  HiChartPie,
  HiClipboard,
  HiCollection,
  HiInformationCircle,
  HiLogin,
  HiPencil,
  HiSearch,
  HiShoppingBag,
  HiUsers,
} from "react-icons/hi";
import { SideBarDashboard } from "./SideBar";

export function SidebarDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {

  const handleClose = () => { onClose() };

  return (
    <>
      <Drawer open={isOpen} onClose={handleClose}>
        <DrawerItems>
          <SideBarDashboard />
        </DrawerItems>
      </Drawer>
    </>
  );
}
