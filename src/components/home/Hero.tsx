"use client";

import Image from 'next/image';
import React from 'react';
import hero from "@/public/imgs/hero.jpg";
import { Button } from 'flowbite-react';
import { Link } from "@/i18n/navigation";
import { HiArrowRight } from "react-icons/hi2";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden">
      {/* 1. Background Image with Next.js Optimization */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero}
          alt="Luxury auction items"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
        {/* Adaptive Overlay: Darker on mobile for readability, fades to right on desktop */}
        <div className="absolute inset-0 bg-black/40 lg:bg-gradient-to-r lg:from-white lg:via-white/80 lg:to-transparent z-10" />
      </div>

      {/* 2. Content Container */}
      <div className="container mx-auto px-4 z-20">
        <div className="max-w-2xl text-center lg:text-left flex flex-col items-center lg:items-start gap-6 lg:gap-8">
          
          <div className="space-y-4">
            {/* Animated Badge (Small UX detail) */}
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 ring-1 ring-inset ring-indigo-700/10 mb-2">
              New: Rare Collectibles Live Now
            </span>
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white lg:text-gray-900 leading-[1.1]">
              Bid on <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent lg:inline hidden">Unique Items</span>
              <span className="text-indigo-400 lg:hidden">Unique Items</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-100 lg:text-gray-600 max-w-lg leading-relaxed">
              Join thousands of collectors bidding on rare and valuable auctions. 
              Secure your piece of history today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/auction-list" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 border-none shadow-xl hover:shadow-indigo-500/50 transition-all duration-300">
                <span className="flex items-center gap-2">
                  Browse Auctions <HiArrowRight />
                </span>
              </Button>
            </Link>
            
            <Link href="/about" className="w-full sm:w-auto">
              <Button size="xl" color="light" className="w-full sm:w-auto border-2 border-white/50 lg:border-gray-200">
                How it Works
              </Button>
            </Link>
          </div>

          {/* Social Proof / Stats */}
          <div className="flex items-center gap-4 pt-4 border-t border-white/20 lg:border-gray-100">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-300" />
              ))}
            </div>
            <p className="text-sm text-gray-200 lg:text-gray-500 font-medium">
              10k+ active bidders this week
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}