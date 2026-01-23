"use client"
import { Button } from "flowbite-react";
import { useTranslations } from "next-intl";

export default function CreateNewBtn(props?:any) {
    const t = useTranslations('dashboard')
    return (
        <Button {...props} className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all duration-300 cursor-pointer">
            <span className="flex items-center gap-2">
                <span className="text-xl font-light">+</span>
                {t("createNew")}
            </span>
        </Button>
    )
}