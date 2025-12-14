"use client"
import React, { useState } from 'react'
import { useFetch } from "@/hooks/useFetcher";
import { Auction } from '@/types/main';
import { Avatar, Button, Card, createTheme, HelperText, Label, TextInput, Tooltip } from 'flowbite-react';
import { FiTag } from 'react-icons/fi';
import { CiLocationOn } from 'react-icons/ci';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
// import required modules
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import { RiAuctionLine } from 'react-icons/ri';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { BiLogIn } from 'react-icons/bi';
import Link from 'next/link';
import { formatTimestamp } from '@/helpers/dates';
import { useAuth } from '@/context/authContext';
import { LoginModal } from '../users/LoginModal';
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
    const { isAuthenticated } = useAuth();
    // Login Modal
    const [openModal, setOpenModal] = useState(false);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

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
            {/* Title */}
            <div className='grid grid-cols-12 mb-8'>
                <div className='col-span-10'>
                    <h1 className="font-bold text-3xl mb-3">{data.title}</h1>
                    <div className='flex gap-5 text-gray-600'>
                        <div className='flex items-center gap-1'>
                            <FiTag className='text-lg' />
                            <span className='font-medium'>
                                {data.category.title}
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
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
                <div className='lg:col-span-2 flex flex-col gap-10'>
                    <div className=''>
                        <Gallary images={placeholderImages} />
                    </div>
                    {
                        data.desc &&
                        <div className=''>
                            <h2 className='font-semibold text-xl mb-2'>Description</h2>
                            <p>{data.desc}</p>
                        </div>
                    }

                    <div className=''>
                        <h2 className='font-semibold text-xl mb-2'>Auction Details</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam fugiat eos, natus corrupti dolorum aliquam voluptate excepturi? Vel, quaerat impedit iusto, facilis fuga tempore commodi laudantium magni, inventore dicta cum.</p>
                    </div>

                </div>
                <div className='col-span-1 flex flex-col gap-10'>
                    {data.bids.length > 0 ?
                        <Card className="max-w-sm shadow-none border-blue-200 bg-blue-50">
                            <div className='flex justify-between'>
                                <div className=''>
                                    <h4 className="text-lg font-semibold tracking-tight text-gray-700 dark:text-white">
                                        Current High Bid
                                    </h4>
                                    <div className='flex justify-between items-center'>
                                        <h4 className='text-2xl font-bold text-blue-800'>
                                            ${Number(data.bids[0].amount).toLocaleString()}
                                        </h4>
                                        <FaArrowTrendUp className='text-xl ms-2 text-blue-800' />
                                    </div>
                                </div>
                                <div className=''>
                                    <h4 className="text-lg font-semibold tracking-tight text-gray-700 dark:text-white">
                                        Total Bids
                                    </h4>
                                    <h4 className='text-xl font-bold'>
                                        {data.bids.length}
                                    </h4>
                                </div>
                            </div>
                        </Card>
                        : <Card className="max-w-sm shadow-none border-blue-200 bg-blue-50">
                            <div className='flex justify-between'>
                                <div className=''>
                                    <h4 className="text-lg font-semibold tracking-tight text-gray-700 dark:text-white">
                                        Start Price
                                    </h4>
                                    <div className='flex justify-between items-center'>
                                        <h4 className='text-2xl font-bold text-blue-800'>
                                            {Number(data.start_price).toLocaleString()}
                                        </h4>
                                        <FaArrowTrendUp className='text-xl ms-2 text-blue-800' />
                                    </div>
                                </div>
                                <div className=''>
                                    <h4 className="text-lg font-semibold tracking-tight text-gray-700 dark:text-white">
                                        Total Bids
                                    </h4>
                                    <h4 className='text-xl font-bold'>
                                        {data.bids.length}
                                    </h4>
                                </div>
                            </div>
                        </Card>
                    }


                    {/* Place Bid  */}
                    <Card className="max-w-sm shadow-none">
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Place Your Bid
                        </h2>

                        <form className="flex flex-col gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="bid">Your Bid Amount</Label>
                                </div>
                                <TextInput id="bid" type="number" placeholder="$" required disabled={!isAuthenticated}/>
                                <HelperText>
                                    Minimum bid: <span className='font-bold'>$
                                        {
                                            data.bids.length > 0 ? (Number(data.bids[0].amount) + Number(data.min_increment)).toLocaleString() : (Number(data.start_price) + Number(data.min_increment)).toLocaleString()
                                        }
                                    </span>
                                </HelperText>

                            </div>
                            {
                                isAuthenticated ? (
                                    <>
                                        <Button type='submit'>
                                            <RiAuctionLine className='text-xl me-1.5 transform-[scaleX(-1)]' /> Place Bid
                                        </Button>
                                        <Link href={`/auction-details/${slug}/bid-room`} >
                                            <Button color={"alternative"} className='w-full'>
                                                <BiLogIn className='text-2xl me-1.5' /> Enter Live
                                            </Button>
                                        </Link>
                                    </>
                                ) : <>
                                    {/* The Trigger Button - can be a simple button, an icon, or any styled component */}
                                    <button
                                        className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                        onClick={handleOpen}
                                        type='button'
                                    >
                                        Login to bid
                                    </button>

                                    {/* The Login Modal, controlled by state */}
                                    <LoginModal
                                        isOpen={openModal}
                                        onClose={handleClose}
                                    /></>
                            }
                        </form>
                    </Card>

                    {/* Bid History */}
                    {isAuthenticated &&
                        < Card className="max-w-sm shadow-none">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Bid History
                            </h2>
                            <div className='flex flex-col gap-3'>

                                {data.bids.length > 0 ?
                                    data.bids.map((bid:any, index: React.Key | null | undefined) => (
                                        index === 0 ? (

                                            // CURRENT HIGH
                                            <Card
                                                key={index}
                                                theme={cardTheme.card}
                                                applyTheme={{ root: { children: "merge" } }}
                                                className="shadow-none border-green-200 bg-green-50"
                                            >
                                                <Avatar rounded className="p-0 justify-start">
                                                    <div className="font-medium dark:text-white">
                                                        <div>{bid.created_by}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatTimestamp(bid.created_at)}
                                                        </div>
                                                    </div>
                                                </Avatar>

                                                <div>
                                                    <h4 className="text-lg font-bold text-green-600 dark:text-white">
                                                        ${bid.amount}
                                                    </h4>
                                                    <p className="text-xs font-semibold text-green-600">
                                                        Current High
                                                    </p>
                                                </div>
                                            </Card>

                                        ) : (

                                            // OTHER BIDS
                                            <Card
                                                key={index}
                                                theme={cardTheme.card}
                                                applyTheme={{ root: { children: "merge" } }}
                                                className="shadow-none"
                                            >
                                                <Avatar rounded className="p-0 justify-start">
                                                    <div className="font-medium dark:text-white">
                                                        <div>{bid.created_by}</div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {formatTimestamp(bid.created_at)}
                                                        </div>
                                                    </div>
                                                </Avatar>

                                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                    ${bid.amount}
                                                </div>
                                            </Card>

                                        )
                                    ))
                                    :
                                    <h5 className='text-gray-700 text-center text-md'>No bids yet. Be the first to bid!</h5>
                                }

                            </div>
                        </Card>
                    }

                </div>
            </div>
        </div >
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