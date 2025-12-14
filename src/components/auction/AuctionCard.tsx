"use client";

import { Badge, Card } from "flowbite-react";
import Image from "next/image";
import { Auction } from "@/types/main";
import Timer from "../common/Timer";
import { BsBoxes } from "react-icons/bs";
import { CiMoneyCheck1 } from "react-icons/ci";

export function AuctionCard({ auction }: { auction: Auction }) {
    return (
        <Card
            className="max-w-sm relative overflow-hidden shadow-none rounded-none transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            renderImage={() =>
                <Image width={400} height={400} src="/imgs/car.jpg" alt="image 1" className="rounded transform transition-transform duration-500 hover:scale-110" />}
            href={`/auction-details/${auction.slug}`}
        >
            {auction.category &&
                <div className="absolute top-0 left-0 p-2">
                    <Badge color="indigo" size="sm" >{auction.category.title}</Badge>
                </div>
            }
            <Timer start_date={auction.start_date} end_date={auction.end_date} />

            <h2 className="font-bold text-indigo-800">
                {auction.title}
            </h2>
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-center">
                    <div className="font-light text-gray-900 flex gap-1 items-center">
                        <BsBoxes size={20}/>
                        <span>Total Items:</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-lg">{auction.item_count}</span>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="font-light text-gray-900 flex gap-1 items-center">
                        <CiMoneyCheck1 size={20}/>
                        <span>Entry Fee:</span>
                    </div>
                    <span className="font-semibold text-gray-900 ">{auction.entry_fee} EGP</span>
                </div>
            </div>
        </Card>
    );
}