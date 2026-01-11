"use client";

import Image from "next/image";
import Link from "next/link";
import { Auction } from "@/types/main";
import Timer from "../common/Timer";
import { CiMoneyCheck1, CiShoppingTag } from "react-icons/ci";
import AuctionStatusBadge from "../common/AuctionStatusBadge";
import { useTranslations } from "next-intl";

export function AuctionCard({ auction }: { auction: Auction }) {
    const t = useTranslations("AuctionCard");

    return (
        <div className="group bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-indigo-100">
            <Link href={`/auction-details/${auction.slug}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                        fill
                        src="/imgs/car.jpg" 
                        alt={auction.title}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                    {/* Top Badges - Using logical 'start' instead of 'left' */}
                    <div className="absolute top-3 inset-inline-start-3 flex flex-col gap-2">
                        <AuctionStatusBadge stat={auction.status} />
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-4">
                        {auction.title}
                    </h2>

                    <div className="grid grid-cols-1">
                        {auction.category && (
                            <div className="flex justify-between items-center p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <CiShoppingTag size={20} className="text-indigo-500" />
                                    <span>{t('category')}</span>
                                </div>
                                <span className="font-bold text-gray-900 tracking-tight">
                                    {auction.category.title}
                                </span>
                            </div>
                        )}
                        
                        {auction.entry_fee && (
                            <div className="flex justify-between items-center p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <CiMoneyCheck1 size={20} className="text-indigo-500" />
                                    <span>{t('entryFee')}</span>
                                </div>
                                <span className="font-bold text-gray-900 tracking-tight">
                                    {Number(auction.entry_fee).toLocaleString()} {t('currency')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Timer Section */}
                    <div className="pt-4 border-t border-gray-50">
                        <div className="mt-1">
                            <Timer
                                start_date={auction.start_date}
                                end_date={auction.end_date}
                                status={auction.status}
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}