"use client";

import Image from "next/image";
import Link from "next/link";
import { Auction } from "@/types/main";
import Timer from "../common/Timer";
import { CiMoneyCheck1, CiShoppingTag, CiHeart } from "react-icons/ci";
import { HiTrendingUp } from "react-icons/hi"; // For a "Popular" feel
import AuctionStatusBadge from "../common/AuctionStatusBadge";
import { useTranslations } from "next-intl";
import { Button } from "flowbite-react";
import { AuctionImage, buildSizes, buildSrcSet } from "./AuctionGallery";

export function AuctionCard({ auction }: { auction: Auction }) {
  const t = useTranslations("AuctionCard");

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(79,70,229,0.15)] border border-gray-100">

      {/* Heart/Watchlist Button - Subtle UX touch */}
      <button className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all shadow-sm">
        <CiHeart size={24} className="stroke-2" />
      </button>

      <Link href={`/auction-details/${auction.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          <Image
            fill
            src={auction.images.length > 0 ? auction.images[0]?.image_medium_thumb : "/imgs/placeholder.jpg"}
            alt={auction.title}
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          <img srcSet={buildSrcSet(auction.images[0])} sizes={buildSizes()} alt={"auction img"} className="object-cover" />
          {/* Status Overlay */}
          <div className="absolute top-4 left-4 z-10">
            <AuctionStatusBadge stat={auction.status} />
          </div>

          {/* Bottom Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Action on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
            <span className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold shadow-xl">
              View Details
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Category Badge - Small & Professional */}
          <div className="flex items-center gap-1.5 text-indigo-600 mb-2">
            <CiShoppingTag size={16} className="font-bold" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {auction.category?.title || t('category')}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 line-clamp-1 mb-4 group-hover:text-indigo-600 transition-colors">
            {auction.title}
          </h2>

          {/* Key Metrics Row */}
          <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase font-medium">{t('entryFee')}</span>
              <div className="flex items-center gap-1 text-gray-900">
                <span className="font-bold text-lg">
                  {Number(auction.entry_fee).toLocaleString()}
                </span>
                <span className="text-xs font-medium text-gray-500">{t('currency')}</span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-200" />

            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 uppercase font-medium">Bidders</span>
              <div className="flex items-center gap-1 text-indigo-600 font-bold">
                <HiTrendingUp size={16} />
                <span>Active</span>
              </div>
            </div>
          </div>

          {/* Timer Section - Focus on Urgency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 font-medium">Time Remaining</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-2 transition-colors group-hover:bg-indigo-100">
              <Timer
                start_date={auction.start_date}
                end_date={auction.ended_at ?? auction.end_date}
                status={auction.status}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}