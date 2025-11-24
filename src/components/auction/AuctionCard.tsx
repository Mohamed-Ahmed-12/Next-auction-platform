"use client";

import { Badge, Button, Card } from "flowbite-react";
import Image from "next/image";
import { Auction } from "@/types/main";
import Timer from "../common/Timer";

export function AuctionCard({ auction }: { auction: Auction }) {
    return (
        <Card
            className="max-w-sm relative overflow-hidden"
            renderImage={() => <Image width={400} height={400} src="/imgs/car.jpg" alt="image 1" className="rounded transform transition-transform duration-500 hover:scale-110" />}
            href={`/auction-details/${auction.slug}`}
        >
            {auction.category &&
                <div className="absolute top-0 left-0 p-2">
                    <Badge color="indigo" size="sm" >{auction.category.name}</Badge>
                </div>
            }

            <Timer start_date={auction.start_date} end_date={auction.end_date} />

            <h2 className="font-bold text-indigo-800">
                {auction.title}
            </h2>
            <p className="font-normal text-gray-400">
                {auction.desc}
            </p>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Total Items:</span>
                    <span className="font-bold text-gray-600 text-sm">{auction.item_count}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900">Entry Fee:</span>
                    <span className="font-bold text-gray-600 text-sm">{auction.entry_fee} EGP</span>
                </div>
            </div>
        </Card>
    );
}