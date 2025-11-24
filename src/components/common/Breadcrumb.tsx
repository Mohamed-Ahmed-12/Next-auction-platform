
"use client";

import { Breadcrumb, BreadcrumbItem } from "flowbite-react";

export function CustomBreadcrumb({ routes }: { routes: any[] }) {
    return (
        <Breadcrumb className="">
            <BreadcrumbItem href="/">
                Home
            </BreadcrumbItem>
            {
                routes.map((route,index) => (
                    <BreadcrumbItem key={index} href={route.link}>{route.label}</BreadcrumbItem>

                ))
            }
        </Breadcrumb>
    );
}
