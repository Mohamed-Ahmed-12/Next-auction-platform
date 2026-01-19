"use client";
import { fetchAuctionsForSelect } from "@/services/AuctionService";
import { fetchCategoriesForSelect } from "@/services/CategoryService";
import { SelectOption } from "@/types/formfield";
import { Select } from "flowbite-react";
import { useEffect, useState } from "react";

export default function SelectWithOptions({ fetchedData, ...props }: { fetchedData: string| undefined }) {
    const [options, setOptions] = useState<SelectOption[]>([])

    useEffect(() => {
        if (fetchedData == 'category') {
            fetchCategoriesForSelect()
                .then((data) => {
                    setOptions(data)
                }).catch((err) => {
                    console.log(err)
                })
        } else if (fetchedData == 'auction') {
            fetchAuctionsForSelect()
                .then((data) => {
                    setOptions(data)
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            setOptions([])
        }
    }, [fetchedData])
    return (
        <Select {...props}>
            <option value="">Select</option>
            {options.map((opt, index) => (
                <option key={index} value={opt.value}>{opt.label}</option>
            ))}
        </Select>
    )
}