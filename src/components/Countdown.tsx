'use client';

import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(deadline: string): TimeLeft | null {
  const end = new Date(deadline).getTime();
  if (isNaN(end)) return null;
  const diff = end - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

export default function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => getTimeLeft(deadline));

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(deadline));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 rounded-2xl px-5 py-2.5">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-red-400 font-bold">Бүртгэл хаагдсан</span>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: 'өдөр' },
    { value: timeLeft.hours, label: 'цаг' },
    { value: timeLeft.minutes, label: 'мин' },
    { value: timeLeft.seconds, label: 'сек' },
  ];

  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ping-slow"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-green-400 text-sm font-semibold">Бүртгэл нээлттэй байна</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {units.map(({ value, label }, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="bg-white/8 border border-violet-500/25 rounded-2xl px-4 py-3 min-w-[68px] text-center shadow-lg shadow-violet-900/20">
              <div className="text-3xl font-black text-violet-300 tabular-nums leading-none">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-gray-500 text-xs mt-1 font-medium">{label}</div>
            </div>
            {i < units.length - 1 && (
              <span className="text-violet-500/50 font-black text-xl">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
