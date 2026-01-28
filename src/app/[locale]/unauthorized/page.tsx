"use client";

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Button } from 'flowbite-react';
// Using React Icons (Hi = HeroIcons, Md = Material Design)
import { HiOutlineShieldCheck, HiOutlineArrowLeft, HiOutlineHome } from "react-icons/hi";
import { MdOutlineSecurity } from "react-icons/md";

export default function UnauthorizedPage() {
    const t = useTranslations('UnauthorizedAccess');
    const router = useRouter();

    return (
        <section className="bg-white dark:bg-gray-900 min-h-[80vh] flex items-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">

                    {/* Visual Asset: Security Shield with Pulse Effect */}
                    <div className="relative flex justify-center mb-10">
                        <div className="absolute animate-ping inline-flex h-24 w-24 rounded-full bg-red-400 opacity-20"></div>
                        <div className="relative rounded-full bg-red-100 p-6 dark:bg-red-900/30">
                            <MdOutlineSecurity className="w-16 h-16 text-red-600 dark:text-red-500" />
                        </div>
                    </div>

                    <h1 className="mb-4 text-4xl tracking-tight font-extrabold lg:text-5xl text-gray-900 dark:text-white">
                        {t('title')}
                    </h1>

                    <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('description')}
                    </p>

                    {/* Action Hub */}
                    <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                        <Button
                            color="light"
                            size="xl"
                            onClick={() => router.back()}
                            className="transition-all hover:scale-105"
                        >
                            <HiOutlineArrowLeft className="mr-2 h-5 w-5" />
                            {t('goBack')}
                        </Button>

                        <Button
                            color="dark"
                            size="xl"
                            onClick={() => router.push('/')}
                            className="transition-all hover:scale-105 shadow-lg"
                        >
                            <HiOutlineHome className="mr-2 h-5 w-5" />
                            {t('returnHome')}
                        </Button>
                    </div>

                    {/* Support Link */}
                    <div className="mt-12 flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <HiOutlineShieldCheck className="text-green-500 h-5 w-5" />
                        <span>{t('supportPrompt')} </span>
                        <a href="/contact" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                            {t('contactSupport')}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}