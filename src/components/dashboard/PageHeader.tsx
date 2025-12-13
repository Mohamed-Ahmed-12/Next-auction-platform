import React from "react";

export default function PageHeader({ children, title }: { children?: React.ReactNode, title: string }) {
    return (
        <div className="flex justify-between border-b-gray-300 border-b border-dashed py-2">
            <h1 className="text-indigo-600 font-bold text-2xl">
                {title}
            </h1>
            {children}
        </div>
    )
}