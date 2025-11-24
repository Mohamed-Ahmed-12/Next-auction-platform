import React from 'react'

export default function LiveBadge() {
    return (
        <span className="relative flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-600 text-xs font-medium rounded-full dark:bg-green-400/20 dark:text-green-300">
            <span className="absolute inline-flex h-2 w-2 left-1 top-1/2 -translate-y-1/2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="pl-3">Live</span>
        </span>
    )
}
