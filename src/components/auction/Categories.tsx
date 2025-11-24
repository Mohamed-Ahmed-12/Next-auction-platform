"use client"
import React from "react";
import Image from "next/image";
import { Category } from "@/types/main";
import { useFetch } from "../../../hooks/useFetcher";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';

import "@/public/css/category.css"
import { Button } from "flowbite-react";
const Categories = () => {
    const { data, loading, error } = useFetch<Category[]>("category/");

    if (loading) {
        return <h2>Loading...</h2>;
    }

    if (error) {
        return <h2>Error {error}</h2>;
    }

    if (!data || data.length === 0) {
        return <h2>No categories available.</h2>;
    }

    return (

        <div className="my-20">
            <h1 className="font-bold text-3xl mb-5">Categories</h1>
            <div className="flex justify-between items-center mb-10">
                <span className="w-[70%]">Explore on the world's best & largest Bidding marketplace with our beautiful Bidding products. We want to be a part of your smile, success and future growth.</span>
                <Button color={"alternative"}>View All</Button>
            </div>
            <Swiper
                slidesPerView={5}
                spaceBetween={50}
                centeredSlides={false}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
                className="swiper-category"
            >
                {data.map((cate) => (
                    <SwiperSlide
                        key={cate.id}
                        className="hover:bg-indigo-100 bg-indigo-50  rounded-full p-2 hover:shadow"
                    >
                        <Image
                            src={cate.icon ?? "/imgs/car.svg"}
                            alt={cate.name ?? "Category"}
                            width={50}
                            height={75}
                            className="mb-2"
                        />
                        <p className="text-md font-semibold">{cate.name ?? "Unnamed Category"}</p>
                    </SwiperSlide>
                ))}

            </Swiper >
        </div>

    );
};

export default Categories;