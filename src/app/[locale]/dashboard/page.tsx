"use client"
import PageHeader from '@/components/dashboard/PageHeader'
import { useAuth } from '@/context/authContext'
import { getDashboardData } from '@/services/DashboardService'
import { DashboardData } from '@/types/dashboard'
import { Card } from 'flowbite-react'
import { useTranslations } from 'next-intl'
import React, { useEffect, useRef, useState } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { GoPeople } from 'react-icons/go'
import { IoGridOutline } from 'react-icons/io5'
import { RiAuctionLine } from 'react-icons/ri'
import { toast } from 'react-toastify'

export default function Dashboard() {
    const t = useTranslations('dashboard')
    const cardStyle = "shadow-none hover:shadow-md relative"
    const [loading, setIsLoading] = useState(false);
    const [data, setData] = useState<DashboardData | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        setIsLoading(true)
        getDashboardData()
            .then((data) => {
                setData(data)
            })
            .catch((err) => {
                toast.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])


    // Setup WebSocket
    useEffect(() => {
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/dashboard/updates/`)

        socketRef.current = socket;

        socket.onopen = () => console.log("WebSocket Connected");

        socket.onmessage = (event) => {
            try {
                const res = JSON.parse(event.data);
                toast.info(res?.message);

                if (res.data && res.data.type === 'user_count_update') {

                    const newCount = res.data.user_count;

                    if (typeof newCount === 'number') {
                        setData(prevData => {
                            if (prevData) {
                                return {
                                    ...prevData,
                                    user_count: newCount
                                };
                            }
                            return null;
                        });
                    }
                }

            } catch (err) {
                console.error("Invalid WebSocket message:", event.data || err);
            }
        };

        socket.onerror = () => console.log("WebSocket error occurred");

        return () => socket.close();
    }, []);
    
    if (loading) {
        return <p>Loading dashboard...</p>
    }
    return (
        <>
            <PageHeader title={t('dashboard')} />
            <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3'>

                <Card className={cardStyle + " bg-violet-50 hover:border-violet-200 hover:shadow-violet-100"}>
                    <div className=' absolute end-5 top-5 rounded-lg bg-violet-50 p-1'>
                        <RiAuctionLine className="text-5xl text-violet-600" />
                    </div>
                    <h5 className="font-bold">
                        {t('totalAuction')}
                    </h5>
                    <span className='font-semibold'>{data?.auction_count ?? 0} </span>
                </Card>

                <Card className={cardStyle + " bg-indigo-50 hover:border-indigo-200 hover:shadow-indigo-100"}>
                    <div className=' absolute end-5 top-5 rounded-lg bg-indigo-50 p-1'>
                        <IoGridOutline className="text-5xl text-indigo-600" />
                    </div>
                    <h5 className="font-bold">
                        {t("totalCategories")}
                    </h5>
                    <span className='font-semibold'>{data?.category_count ?? 0} </span>
                </Card>

                <Card className={cardStyle + " bg-amber-50 hover:border-amber-200 hover:shadow-amber-100"}>
                    <div className=' absolute end-5 top-5 rounded-lg bg-amber-50 p-1'>
                        <GoPeople className="text-5xl text-amber-600" />
                    </div>
                    <h5 className="font-bold">
                        {t("totalUsers")}
                    </h5>
                    <span className='font-semibold'>{data?.user_count ?? 0}</span>
                </Card>

                <Card className={cardStyle + " bg-green-50 hover:border-green-200 hover:shadow-green-100"}>
                    <div className=' absolute end-5 top-5 rounded-lg bg-green-50 p-1'>
                        <RiAuctionLine className="text-5xl text-green-600" />
                    </div>
                    <h5 className="font-bold">
                        {t("totalBidsToday")}
                    </h5>
                    <span className='font-semibold'>{data?.bids_today ?? 0}</span>
                </Card>

                <Card className={cardStyle + " bg-red-50 hover:border-red-200 hover:shadow-red-100"}>
                    <div className=' absolute end-5 top-5 rounded-lg bg-red-50 p-1'>
                        <BsCurrencyDollar className="text-5xl text-red-600" />
                    </div>
                    <h5 className="font-bold">
                        {t("revenue")}
                    </h5>
                    <span className='font-semibold'>0</span>
                </Card>
            </div>
        </>
    )
}
