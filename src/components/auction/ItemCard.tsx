"use client";

import { Badge, Button, Card } from "flowbite-react";
import Image from "next/image";
import { Item } from "@/types/main";
import Timer from "../common/Timer";

export function ItemCard({ item }: { item: Item }) {
    return (
        <Card
            className="max-w-sm relative overflow-hidden"
            renderImage={() => <Image width={400} height={400} src="/imgs/car.jpg" alt="image 1" className="rounded transform transition-transform duration-500 hover:scale-110" />}
            href={`/item-details/${item.slug}`}
        >
            {item.category &&
                <div className="absolute top-0 left-0 p-2">
                    <Badge color="indigo" size="sm" >{item.category.name}</Badge>
                </div>
            }

            {/* <Timer start_date={item.start_date} end_date={item.end_date} /> */}

            <h2 className="font-bold text-indigo-800">
                {item.title}
            </h2>
            <p className="font-normal text-gray-400">
                {item.desc}
            </p>
        </Card>
    );
}