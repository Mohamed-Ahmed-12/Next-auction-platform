"use client";

import React, { useState, useMemo } from "react";
import { useFetch } from "@/hooks/useFetcher";
import { Button, Badge, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { HiFilter, HiRefresh, HiSearch, HiX } from "react-icons/hi";

import { AuctionCard } from "@/components/auction/AuctionCard";
import AuctionListSkelton from "@/components/skeltons/AuctionListSkelton";

import { Auction, Category } from "@/types/main";
import { AuctionFilterFields } from "@/types/filters";
import FilterSidebar from "@/components/common/Filter";

export default function AuctionListPage() {
    const [isOpen, setIsOpen] = useState(false); // Mobile Drawer State
    const [showFilters, setShowFilters] = useState(true); // Desktop Sidebar State

    const { data: auctions, loading, error } = useFetch<Auction[]>("auction/");
    const { data: categories, loading: loadingCats } = useFetch<Category[]>("category/");

    const [filters, setFilters] = useState<AuctionFilterFields>({
        category: [],
        status: [],
    });

    // Derived state for better performance
    const filteredAuctions = useMemo(() => {
        console.log(auctions)
        if (!auctions) return [];
        return auctions.filter(item => {
            const catMatch = filters.category.length === 0 || filters.category.includes(item.category.slug);
            const statusMatch = filters.status.length === 0 || filters.status.includes(item.status);
            return catMatch && statusMatch;
        });
    }, [auctions, filters]);

    if (error) return <ErrorMessage message={error} />;

    return (
        <main className="container mx-auto px-4 py-8 lg:py-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Live Auctions</h1>
                    <p className="text-gray-500 mt-1">Discover unique items and place your bid.</p>
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-gray-600">
                        {filteredAuctions.length} Results
                    </p>
                    {/* Mobile Filter Toggle */}
                    <Button color="gray" className="md:hidden" onClick={() => setIsOpen(true)}>
                        <HiFilter className="mr-2 h-5 w-5" /> Filters
                    </Button>
                    {/* Desktop Filter Toggle */}
                    <Button
                        color="light"
                        className="hidden md:flex"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <HiFilter className={`mr-2 h-5 w-5 ${showFilters ? 'text-indigo-600' : ''}`} />
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Desktop Sidebar */}
                {showFilters && (
                    <aside className="hidden md:block w-64 shrink-0 transition-all">
                        <FilterSidebar
                            categories={categories || []}
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </aside>
                )}

                {/* Content Area */}
                <div className="flex-1">
                    {loading ? (
                        <AuctionListSkelton />
                    ) : filteredAuctions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredAuctions.map((auction) => (
                                <AuctionCard key={auction.id} auction={auction} />
                            ))}
                        </div>
                    ) : (

                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white border border-gray-100 rounded-3xl shadow-sm">
                            {/* Visual Anchor */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-2xl opacity-40 animate-pulse" />
                                <div className="relative flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                                    <HiSearch className="w-10 h-10" />
                                </div>
                            </div>

                            {/* Messaging */}
                            <div className="max-w-xs mx-auto mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    No auctions found
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    We couldn't find any live auctions matching your current filters. Try
                                    broadening your search to see more items.
                                </p>
                            </div>

                            {/* Primary Action */}
                            <Button
                                onClick={() => setFilters({ category: [], status: [] })}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
                            >
                                <HiRefresh className="mr-2 h-5 w-5" />
                                Clear All Filters
                            </Button>

                            {/* Helpful Hint */}
                            <p className="mt-6 text-xs text-gray-400 font-medium">
                                Tip: Try selecting "All Categories" to see the latest bids.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Drawer */}
            <Drawer open={isOpen} onClose={() => setIsOpen(false)} position="right" className="p-4">
                <DrawerHeader title="Filters" titleIcon={() => <HiFilter className="mr-2" />} />
                <DrawerItems>
                    <FilterSidebar
                        categories={categories || []}
                        filters={filters}
                        setFilters={setFilters}
                    />
                    <Button className="w-full mt-6" onClick={() => setIsOpen(false)}>Apply Filters</Button>
                </DrawerItems>
            </Drawer>
        </main>
    );
}

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg inline-block">
            <h2 className="text-xl font-bold">Something went wrong</h2>
            <p>{message}</p>
        </div>
    </div>
);