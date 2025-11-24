"use client";

import React, { useEffect, useState } from "react";

interface TimerProps {
  start_date: string;
  end_date: string;
}

export default function Timer({ start_date, end_date }: TimerProps) {
  const calculateTime = () => {
    const now = new Date().getTime();
    const start = new Date(start_date).getTime();
    const end = new Date(end_date).getTime();

    let target = now < start ? start : end; // countdown to start OR end
    let distance = target - now;

    if (distance <= 0) return { d: 0, h: 0, m: 0, s: 0 };

    return {
      d: Math.floor(distance / (1000 * 60 * 60 * 24)),
      h: Math.floor((distance / (1000 * 60 * 60)) % 24),
      m: Math.floor((distance / (1000 * 60)) % 60),
      s: Math.floor((distance / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { d, h, m, s } = timeLeft;

  return (
    <div className="w-full p-2 flex justify-around bg-[rgba(200,200,200,.2)]">
      <TimerBlock label="Days" value={d} />
      <TimerBlock label="Hours" value={h} />
      <TimerBlock label="Minutes" value={m} />
      <TimerBlock label="Seconds" value={s} />
    </div>
  );
}

function TimerBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5 text-center">
      <span className="digital-number text-xl">{value.toString().padStart(2, "0")}</span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
