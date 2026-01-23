"use client"
import { NavBarDashboard } from '@/components/dashboard/Navbar';
import { SideBarDashboard } from '@/components/dashboard/SideBar';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import React from 'react';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <NavBarDashboard />

            <div className='grid grid-cols-12 gap-2 p-2 h-lvh'>
                <div className='col-span-2 hidden md:block'>
                    <SideBarDashboard cls='w-full rounded min-h-full' />
                </div>

                <main className='col-span-12 md:col-span-10 p-4 flex flex-col gap-y-5 bg-gray-50 rounded overflow-y-auto'>
                    {children}
                </main>
            </div>
        </>
    );
}