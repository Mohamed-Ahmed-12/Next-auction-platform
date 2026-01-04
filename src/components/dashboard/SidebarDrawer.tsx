
"use client";

import {
  Drawer,
  DrawerItems,
} from "flowbite-react";

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
