import React from 'react'
import { useFetch } from "@/hooks/useFetcher";
import { Auction } from '@/types/main';
import {  createTheme} from 'flowbite-react';
import { FiTag } from 'react-icons/fi';
import { CiCalendar, CiLocationOn, CiMoneyBill } from 'react-icons/ci';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import { ItemCard } from './ItemCard';
import AuctionStatusBadge from '../common/AuctionStatusBadge';
import { formatTimestamp } from '@/lib/dates';

// Customize card
const cardTheme = createTheme({
    card: {
        root: {
            children: "p-2 justify-between items-center flex-row",
        },
    },
});

type GalleryImage = {
    src: string;
    alt?: string;
};

export default function AuctionDetails({ slug }: { slug: string }) {
    const { data, error, loading } = useFetch<Auction>(`auction/${slug}`);

    if (loading) {
        return <h2 className="text-center my-20">loading...</h2>
    }
    if (error) {
        return <h2 className="text-center my-20 text-red-600">Error: {error}</h2>
    }
    if (!data) {
        return <h2 className="text-center my-20">No Auction available.</h2>;
    }
    const placeholderImages: GalleryImage[] = [
        { "src": "/imgs/car.jpg" },
        { "src": "/imgs/car.jpg" },
        { "src": "/imgs/car.jpg" },
        { "src": "/imgs/car.jpg" },
    ];

    return (
        <div className="container mx-auto px-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl my-20">


            <div className='grid grid-cols-1 gap-10'>
                <div className='col-span-auto flex flex-col gap-10'>
                    <div className=''>
                        <Gallary images={placeholderImages} />
                    </div>
                    {/* Title */}
                    <div className='grid grid-cols-12'>
                        <div className='col-span-10'>
                            <h1 className="font-bold text-3xl mb-3">{data.title}</h1>
                            <div className='flex gap-5 text-gray-600'>
                                <div className='flex items-center gap-1'>
                                    <FiTag className='text-lg' />
                                    <span className='font-medium'>
                                        {data.category.name}
                                    </span>
                                </div>
                                <div className='flex items-center gap-1'>
                                    <CiLocationOn className='text-lg' />
                                    <span className='font-medium'>
                                        New York, NY
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-2 flex justify-end'>
                            <AuctionStatusBadge stat={data.status} />
                        </div>
                    </div>
                    {data.desc
                        && (
                            <div className=''>
                                <h2 className='font-semibold text-xl mb-2'>Description</h2>
                                <p>{data.desc}</p>
                            </div>
                        )
                    }

                    <div className=''>
                        <h2 className='font-semibold text-xl mb-2'>Auction Details</h2>

                        <div className='grid grid-cols-4 gap-y-8'>
                            {
                                data.start_date && data.end_date &&
                                <div className='col-span-2 flex gap-2'>
                                    <CiCalendar className='text-2xl text-indigo-700' />
                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-bold'>Auction Period</h3>
                                        <span>{formatTimestamp(data.start_date)}</span>
                                        <span><span className='font-bold'>to</span> {formatTimestamp(data.end_date)}</span>
                                    </div>
                                </div>
                            }

                            {
                                data.entry_fee &&
                                <div className='col-span-2 flex gap-2'>
                                    <CiMoneyBill className='text-2xl text-indigo-700' />
                                    <div className='flex flex-col gap-1'>
                                        <h3 className='font-bold'>Entry Fee</h3>
                                        <span className='font-medium'>${data.entry_fee}</span>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                    {
                        data.items.length > 0 && (
                            <div className=''>
                                <h2 className='font-semibold text-xl mb-2'>Auction Items</h2>

                                <div className='grid grid-cols-3 gap-3'>
                                    {
                                        data.items.map((item: any) => (
                                            <ItemCard key={item.id} item={item} />
                                        ))
                                    }

                                </div>
                            </div>
                        )

                    }


                </div>

            </div>
        </div>
    );
}

function Gallary({ images }: { images: GalleryImage[] }) {
    return (
        <>
            <Swiper
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="item-gallary w-full rounded-xl"
                loop={true}
            >
                {images && images.map((image, index) => (
                    <SwiperSlide key={image.src + index}>
                        <div className='relative w-full h-[550px] bg-gray-200 flex items-center justify-center'>
                            <Image
                                src={image.src}
                                alt={`Auction Image ${index + 1}`}
                                fill
                                priority={index === 0}
                                objectFit='cover'
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    );
}