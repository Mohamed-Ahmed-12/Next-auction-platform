"use client";

import { AuctionCard } from "@/components/auction/AuctionCard";
import { Auction, Category } from "@/types/main";
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetcher";
import { Badge, Button, Checkbox, Label, Tooltip } from "flowbite-react";
import { filterAuction } from "@/services/AuctionService";
import { AuctionStatus } from "@/lib/data";
import { AuctionFilterFields } from "@/types/filters";
import AuctionListSkelton from "@/components/skeltons/AuctionListSkelton";


export default function Page() {
    const { data, error, loading } = useFetch<Auction[]>("auction/?status=live");
    const { data: categories, error: errorCategories, loading: loadingCategories } =
        useFetch<Category[]>("category/");

    const [filteredData, setFilteredData] = useState<Auction[] | null>(null);
    const [displayAdvFilters, setDisplayAdvFilters] = useState<boolean>(false);
    const [filtersData, setFiltersData] = useState<AuctionFilterFields>({
        category: [],
        status: ['live'],
    });
    const [loadingData, setIsLoadingData] = useState(false);
    
    //💥 delete it in future
    useEffect(() => {
        setIsLoadingData(true);
        const timer = setTimeout(() => setIsLoadingData(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Initialize filtered data
    useEffect(() => {
        if (data?.length) {
            setFilteredData(data);
        }
    }, [data]);

    // Apply filters
    useEffect(() => {
        const hasFilters =
            filtersData.category.length > 0 || filtersData.status.length > 0;

        if (hasFilters) {
            setIsLoadingData(true);
            filterAuction(filtersData).then((auctions) => {
                setFilteredData(auctions);
            })
                .catch((err) => {

                })
                .finally(() => {
                    setIsLoadingData(false);
                })
        } else {
            setFilteredData(data || []);
        }
    }, [filtersData, data]);

    if (loading || loadingData) {
        return (
            <div className="container mx-auto px-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl my-20">
                <h1 className="font-bold text-3xl mb-5">Auction List</h1>
                <AuctionListSkelton />
            </div>
        )
    };
    if (error) return <h2>Error: {error}</h2>;
    if (!data || !filteredData) return <h2>No Auction available.</h2>;

    return (
        <div className="container mx-auto px-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl my-20">
            <h1 className="font-bold text-3xl mb-5">Auction List</h1>

            <div className="flex justify-between items-center mb-6">
                <p>Showing {filteredData.length} results</p>
                <Tooltip content="Advanced Filters">
                    <Button
                        onClick={() => setDisplayAdvFilters((prev) => !prev)}
                        className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-sliders2"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"
                            />
                        </svg>
                    </Button>
                </Tooltip>
            </div>

            <div className="grid grid-cols-4 gap-4">
                {/* Auction List */}
                <div
                    className={`transition-all duration-500 col-span-4 ${displayAdvFilters ? "md:col-span-3" : "md:col-span-4"
                        }`}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredData.map((auction: Auction) => (
                            <AuctionCard key={auction.id} auction={auction} />
                        ))}
                    </div>
                </div>

                {/* Sidebar Filters */}
                <div
                    className={`transition-all duration-500 overflow-hidden ${displayAdvFilters
                        ? "opacity-100 translate-x-0 md:col-span-1"
                        : "opacity-0 -translate-x-10 w-0 md:w-0"
                        }`}
                >
                    {displayAdvFilters && (
                        <div className="bg-gray-100 p-5 rounded shadow">
                            <h2 className="font-bold mb-3">Advanced Filters</h2>

                            {/* Category Filter */}
                            <div className="my-5">
                                <h4 className="mb-4">Category</h4>
                                {loadingCategories && <p>Loading categories...</p>}
                                {errorCategories && <p>Error loading categories</p>}
                                <div className="flex max-w-md flex-col gap-4" id="checkbox">
                                    {categories?.map((cate) => (
                                        <div className="flex items-center gap-2" key={cate.id}>
                                            <Checkbox
                                                id={cate.name}
                                                value={cate.slug}
                                                checked={filtersData.category.includes(cate.slug)}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFiltersData((prev) => {
                                                        const newCategories = e.target.checked
                                                            ? [...prev.category, value]
                                                            : prev.category.filter((slug) => slug !== value);
                                                        return { ...prev, category: newCategories };
                                                    });
                                                }}
                                            />
                                            <Label htmlFor={cate.name}>{cate.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <h4 className="mb-4">Status</h4>
                                <div className="flex max-w-md flex-col gap-4" id="checkbox">
                                    {AuctionStatus.map((stat) => (
                                        <div className="flex items-center gap-2" key={stat}>
                                            <Checkbox
                                                id={stat}
                                                value={stat}
                                                checked={filtersData.status.includes(stat)}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setFiltersData((prev) => {
                                                        const newStatus = e.target.checked
                                                            ? [...prev.status, value]
                                                            : prev.status.filter((slug) => slug !== value);
                                                        return { ...prev, status: newStatus };
                                                    });
                                                }}
                                            />
                                            <Label htmlFor={stat}>{stat}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Filters Preview */}
                            {(filtersData.category.length > 0 ||
                                filtersData.status.length > 0) && (
                                    <div className="mt-5">
                                        <h4 className="mb-2">Selected Filters:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {filtersData.category.map((c) => (
                                                <Badge key={c} color="info">
                                                    {c}
                                                </Badge>
                                            ))}
                                            {filtersData.status.map((s) => (
                                                <Badge key={s} color="purple">
                                                    {s}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
