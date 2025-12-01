"use client"
import { SideBarDashboard } from '@/components/dashboard/SideBar'
import ProtectedRoute from '@/guards/ProotectedRoute'
import React from 'react'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute>
            <div className='h-lvh grid grid-cols-12 gap-2'>
                <SideBarDashboard cls='col-span-2 w-full h-full' />

                <main className='col-span-10 p-4 flex flex-col gap-y-5'>
                    {children}
                </main>
            </div>
        </ProtectedRoute>

    )
}
