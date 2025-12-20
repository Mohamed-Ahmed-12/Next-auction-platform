"use client";

import { AuctionStatus } from "@/lib/data";
import React, { useEffect, useState } from "react";

// Define the three possible states for the auction

interface TimerProps {
  start_date: string;
  end_date: string;
  status: AuctionStatus; 
}

export default function Timer({ start_date, end_date, status }: TimerProps) {
  
  const calculateTime = () => {
    // If the auction has ended, immediately return zeros
    if (status === "ended") {
      return { d: 0, h: 0, m: 0, s: 0 };
    }

    const now = new Date().getTime();
    let target: number;

    if (status === "upcoming") {
      // 1. UPCOMING: Countdown to the START date
      target = new Date(start_date).getTime();
    } else if (status === "live") {
      // 2. LIVE: Countdown to the END date
      target = new Date(end_date).getTime();
    } else {
      // Fallback for unexpected status (shouldn't happen with the type guard)
      return { d: 0, h: 0, m: 0, s: 0 };
    }

    let distance = target - now;

    // If the target date has passed, but status wasn't 'ended',
    // return zeros to prevent negative display. (The parent component should update 'status')
    if (distance <= 0) return { d: 0, h: 0, m: 0, s: 0 };

    return {
      d: Math.floor(distance / (1000 * 60 * 60 * 24)),
      h: Math.floor((distance / (1000 * 60 * 60)) % 24),
      m: Math.floor((distance / (1000 * 60)) % 60),
      s: Math.floor((distance / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime());

  // Recalculate time every second (1000ms)
  useEffect(() => {
    // Only set up the interval if the auction is not yet "ended"
    if (status === "ended") return;

    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
    
    // Rerun effect if 'status' or date props change (e.g., component updates)
  }, [status, start_date, end_date]);

  const { d, h, m, s } = timeLeft;
  
  // Determine the label text based on the status
  const timerLabel = 
    status === "upcoming" ? "START AFTER" : 
    status === "live" ? "END AFTER" : 
    "AUCTION ENDED";

  return (
    <div className="w-full p-2 flex flex-col items-center bg-[#faf9f5]">
      {/* Optional Label Block */}
      <div className="text-sm font-semibold mb-3 text-gray-700">
        {timerLabel}
      </div>

      {/* Timer Display Blocks */}
      <div className="flex justify-around w-full">
        <TimerBlock label="Days" value={d} />
        <TimerBlock label="Hours" value={h} />
        <TimerBlock label="Minutes" value={m} />
        <TimerBlock label="Seconds" value={s} />
      </div>
    </div>
  );
}

// TimerBlock component remains the same
function TimerBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 text-center">
      <span className="digital-number text-xl">{value.toString().padStart(2, "0")}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}