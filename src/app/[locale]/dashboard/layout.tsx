"use client"
import { NavBarDashboard } from '@/components/dashboard/Navbar';
import { SideBarDashboard } from '@/components/dashboard/SideBar'
import ProtectedRoute from '@/guards/ProotectedRoute'
import React, { useState } from 'react'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute cls="h-lvh ">
            <NavBarDashboard />

            <div className='grid grid-cols-12 gap-2 p-2'>
                <div className='col-span-2 hidden md:block'>
                    <SideBarDashboard cls='w-full h-full rounded' />
                </div>

                <main className='col-span-12 md:col-span-10 p-4 flex flex-col gap-y-5 bg-gray-50 rounded'>
                    {children}
                </main>
            </div>
        </ProtectedRoute>

    )
}
