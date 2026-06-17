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

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 rounded-2xl px-6 py-3">
        <span className="text-red-400 font-bold text-lg">Бүртгэл дууссан</span>
      </div>
    );
  }

  const units = [
    { value: timeLeft.days, label: 'хоног' },
    { value: timeLeft.hours, label: 'цаг' },
    { value: timeLeft.minutes, label: 'минут' },
    { value: timeLeft.seconds, label: 'секунд' },
  ];

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      {units.map(({ value, label }, i) => (
        <div key={label}>
          <div className="flex items-center gap-3">
            <div className="bg-gray-900/80 border border-amber-500/20 rounded-2xl px-4 py-3 min-w-[72px] text-center shadow-lg shadow-black/30">
              <div className="text-3xl font-black text-amber-400 tabular-nums leading-none">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-gray-500 text-xs mt-1 font-medium">{label}</div>
            </div>
            {i < units.length - 1 && (
              <span className="text-amber-500/60 font-black text-2xl self-start mt-2">:</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
