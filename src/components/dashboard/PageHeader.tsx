import { Button } from "flowbite-react";
import React from "react";
import { FaFileCsv } from "react-icons/fa6";

export default function PageHeader({ children, title }: { children?: React.ReactNode, title: string }) {
    return (
        <div className="flex justify-between border-b-gray-300 border-b border-dashed">
            <h1 className="text-indigo-600 font-bold text-2xl mb-4">
                {title}
            </h1>
            <div className="flex gap-2">
                <Button color="alternative" size="sm" className="cursor-pointer">
                    <FaFileCsv title="download as csv" size={25} color="green" />
                </Button>
                {children}
            </div>
        </div>
    )
}