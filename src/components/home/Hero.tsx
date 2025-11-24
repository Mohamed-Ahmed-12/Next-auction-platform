"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import hero from "@/public/imgs/hero.jpg"
import { Button } from 'flowbite-react'

export default function Hero() {
    return (
        <section className="">
            <div className="relative">
                <Image
                    src={hero}
                    alt="Luxury auction items"
                    className="w-full h-full object-cover "
                />
                <div className='absolute top-0 w-full h-full' style={{ background: "linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0))" }}>
                    <div className='absolute top-1/4 flex flex-col gap-10 items-start'>
                        <div className='flex flex-col gap-2'>
                            <p className='text-5xl font-extrabold'>Bid on Unique Items</p>
                            <p className='text-3xl w-2/3'>Join thousands of collectors bidding on rare and valuable auctions </p>
                        </div>
                        <Button className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800">
                            Browse
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}