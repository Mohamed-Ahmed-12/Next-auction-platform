import { Button, Progress } from "flowbite-react";
import React, { useEffect, useState } from "react";

export default function ProgressArrow() {
    const [appear, setIsAppear] = useState(false);
    const [progress, setProgress] = useState(0);

    const scrollToTop = () => {
        const duration = 600; // custom speed
        const step = -window.scrollY / (duration / 15);

        const interval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, step);
            } else {
                clearInterval(interval);
            }
        }, 15);
    };

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

    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;
    const safeOffset = Math.max(0, Math.round(offset));
    return (
        <>
            <Progress progress={progress} size="sm" className="fixed top-0 right-0 z-50 rounded-none" color="indigo"/>

            <div className="fixed right-2 bottom-2">
                <Button
                    color="alternative"
                    className="rounded-full w-20 h-20 p-0 relative hover:cursor-pointer border-0"
                    onClick={scrollToTop}
                >
                    {/* Circular Progress */}
                    <svg width="80" height="80" className="absolute top-0 left-0">
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="#d1d5db"
                            strokeWidth="4"
                            fill="none"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="#6c2bd9"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={safeOffset}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.2s" }}
                        />
                    </svg>

                    {/* Arrow Icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#6c2bd9"
                        strokeWidth="2"
                        className="bi bi-arrow-up"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
                        />
                    </svg>
                </Button>
            </div>
        </>

    );
}
