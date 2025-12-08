"use client"
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Category } from "@/types/main";
import { fetchCategories } from "@/services/CategoryService";

const Categories = () => {
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        fetchCategories()
            .then((data) => {
                setCategories(data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])
    useEffect(() => {
        console.log(categories)
    }, [categories])
    return (
        <div className="grid grid-cols-4 gap-4">
            {
                categories === null ? (<span>Loading</span>) : categories.length > 0 ? (
                    categories.map((cate, _) => (
                        <div key={cate.id} className="animated-gradient flex flex-col items-center shadow rounded-br-4xl rounded-tl-4xl">
                            <Image src={cate.icon ?? "imgs/car.svg"} alt="cate" width={75} height={100} />
                            <h2>{cate.title}</h2>
                        </div>
                    ))

                ) : (<span>no data found</span>)
            }


        </div>
    );
}
export default Categories;