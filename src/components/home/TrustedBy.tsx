"use client"
import React from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import Image from 'next/image';

export default function TrustedBy() {
    return (
        <div className="flex flex-col my-20 ">
            <h1 className="font-bold text-3xl mb-5">Trusted By 500+ Businesses.</h1>
            <div className="flex justify-between items-center mb-10">
                <span className="w-[70%]">Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth.</span>
            </div>
             <Swiper
                slidesPerView={10}
                spaceBetween={30}
                centeredSlides={false}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="w-full trustedby-swiper"
            >
                
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>
                    <SwiperSlide
                    >
                        <Image
                            src={"/car.svg"}
                            alt={"Category"}
                            width={120}
                            height={100}
                            className="mb-2"
                        />
                    </SwiperSlide>

              

            </Swiper >
            
        </div>
    )
}
