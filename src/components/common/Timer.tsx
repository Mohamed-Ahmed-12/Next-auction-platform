"use client";

import { AuctionStatus } from "@/lib/data";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

interface TimerProps {
  start_date: string;
  end_date: string; // This should be the extended 'ended_at' from your API
  status: AuctionStatus;
}

export default function Timer({ start_date, end_date }: TimerProps) {
  const t = useTranslations("Timer");

  // Memoize calculateTime so it can be used safely in useEffect
  const calculateTime = useCallback(() => {
    const now = new Date().getTime();
    const start = new Date(start_date).getTime();
    const end = new Date(end_date).getTime();

    let target = 0;
    let labelKey = "";

    if (now < start) {
      // Upcoming
      target = start;
      labelKey = "upcoming";
    } else if (now < end) {
      // Live
      target = end;
      labelKey = "live";
    } else {
      // Ended
      return { d: 0, h: 0, m: 0, s: 0, label: t("ended") };
    }

    const distance = target - now;

    return {
      d: Math.floor(distance / (1000 * 60 * 60 * 24)),
      h: Math.floor((distance / (1000 * 60 * 60)) % 24),
      m: Math.floor((distance / (1000 * 60)) % 60),
      s: Math.floor((distance / 1000) % 60),
      label: t(labelKey),
    };
  }, [start_date, end_date, t]);

  const [timeLeft, setTimeLeft] = useState(calculateTime());

  useEffect(() => {
    // Update every second
    const interval = setInterval(() => {
      const newTime = calculateTime();
      setTimeLeft(newTime);
      
      // If we just hit zero, clear the interval
      if (newTime.d === 0 && newTime.h === 0 && newTime.m === 0 && newTime.s === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTime]);

  const { d, h, m, s, label } = timeLeft;

  return (
    <div className="w-full py-3 px-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50 mt-2">
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3 text-indigo-400 text-center">
        {label}
      </div>

      <div className="flex justify-between items-center">
        <TimerBlock label={t("days")} value={d} />
        <span className="text-indigo-200 font-bold mb-5">:</span>
        <TimerBlock label={t("hours")} value={h} />
        <span className="text-indigo-200 font-bold mb-5">:</span>
        <TimerBlock label={t("minutes")} value={m} />
        <span className="text-indigo-200 font-bold mb-5">:</span>
        <TimerBlock label={t("seconds")} value={s} />
      </div>
    </div>
  );
}

function TimerBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <span className="digital-number text-xl font-bold text-gray-800 tabular-nums">
        {value.toString().padStart(2, "0")}
      </span>
      <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tighter">
        {label}
      </span>
    </div>
  );
}