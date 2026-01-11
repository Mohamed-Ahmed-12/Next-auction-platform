"use client"
import React, { useEffect, useState } from "react";
import { Progress } from "flowbite-react";

export function ProgressBar() {
    const [appear, setIsAppear] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const scrolled = window.scrollY;
            const height = document.body.scrollHeight - window.innerHeight;
            const percentage = (scrolled / height) * 100;

            setProgress(percentage);
            setIsAppear(scrolled > 0);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!appear) return null;

    <Progress progress={progress} size="sm" className="fixed top-0 right-0 z-50 rounded-none h-1" color="indigo" />

}
