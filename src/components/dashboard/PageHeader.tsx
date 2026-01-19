"use client";

import React from "react";
import { HiChevronRight, HiOutlineHome } from "react-icons/hi";
import Link from "next/link";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Breadcrumb[]; // Dynamic breadcrumbs
    children?: React.ReactNode;
}

export default function PageHeader({
    title,
    description,
    breadcrumbs = [],
    children
}: PageHeaderProps) {
    return (
        <div className="relative pb-6 border-b border-gray-100">
            {/* Decorative Brand Accent - Stays at the start of the line regardless of LTR/RTL */}
            <div className="absolute -top-10 inset-inline-start-[-2rem] w-40 h-40 bg-indigo-50/40 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col gap-y-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex-1 min-w-0 space-y-3">

                    {/* Breadcrumbs with RTL Support */}
                    {
                        breadcrumbs.length > 0 && (
                            <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-gray-400">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                                >
                                    <HiOutlineHome className="text-sm" />
                                </Link>

                                {breadcrumbs.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <HiChevronRight className="rtl:rotate-180 text-gray-300" />
                                        {item.href ? (
                                            <Link
                                                href={item.href}
                                                className="hover:text-indigo-600 transition-colors whitespace-nowrap"
                                            >
                                                {item.label}
                                            </Link>
                                        ) : (
                                            <span className="text-indigo-600 font-semibold whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </nav>
                        )
                    }


                    {/* Title Area */}
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                            {title}
                        </h1>

                        {description && (
                            <p className="text-sm md:text-base text-gray-500 max-w-3xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Dynamic Actions - Responsive wrapping */}
                {children && (
                    <div className="flex flex-wrap items-center gap-3 mt-2 lg:mt-0 lg:ms-6">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-start lg:justify-end">
                            {children}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}