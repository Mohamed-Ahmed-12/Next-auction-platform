import React from 'react'

export default function AuctionStatusBadge({ status }: { status: string }) {
    if (status === 'live') {
        return (
            <span className="h-fit relative flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-600 text-xs font-medium rounded-full dark:bg-green-400/20 dark:text-green-300">
                <span className="absolute inline-flex h-2 w-2 left-1 top-1/2 -translate-y-1/2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="pl-3">Live</span>
            </span>
        )
    } else if (status === 'ended') {
        return (
            <span className="h-fit flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-600 text-xs font-medium rounded-full dark:bg-red-400/20 dark:text-red-300">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                <span className="pl-1">Ended</span>
            </span>
        )
    } else if (status === 'upcoming') {
        return (
            <span className="h-fit flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-600 text-xs font-medium rounded-full dark:bg-blue-400/20 dark:text-blue-300">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                <span className="pl-1">Upcoming</span>
            </span>
        )
    }

    // Default return for an unhandled status
    return <>{status}</>
}