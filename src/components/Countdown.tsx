'use client';

import { useEffect, useState } from 'react';

function getTimeLeft(deadline: string) {
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

export function RegistrationBadge({ deadline }: { deadline?: string }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    if (!deadline) return;
    const tick = () => setTimeLeft(getTimeLeft(deadline));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (deadline && timeLeft === null) {
    return (
      <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-sm font-medium flex-wrap justify-center">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-slate-700">Бүртгэл нээлттэй байна</span>
      </div>
    );
  }

  if (deadline && !timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 text-red-600 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
        Бүртгэл хаагдсан
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-sm font-medium flex-wrap justify-center">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <span className="text-slate-700">Бүртгэл нээлттэй байна</span>
      {timeLeft && (
        <>
          <span className="text-slate-300">·</span>
          <span className="text-slate-500">
            {timeLeft.days > 0 && <><span className="font-black text-slate-800">{timeLeft.days}</span> өдөр </>}
            <span className="font-black text-slate-800">{String(timeLeft.hours).padStart(2, '0')}</span> цаг{' '}
            <span className="font-black text-slate-800">{String(timeLeft.minutes).padStart(2, '0')}</span> мин{' '}
            <span className="font-black text-blue-500">{String(timeLeft.seconds).padStart(2, '0')}</span> сек үлдлээ
          </span>
        </>
      )}
    </div>
  );
}

export default function Countdown({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(deadline));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;

  if (timeLeft === null) {
    return (
      <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm text-sm font-medium flex-wrap justify-center">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        <span className="text-slate-700">Бүртгэл нээлттэй байна</span>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-5 py-2.5">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <span className="text-red-500 font-bold">Бүртгэл хаагдсан</span>
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
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 min-w-[68px] text-center">
            <div className="text-3xl font-black text-blue-600 tabular-nums leading-none">
              {String(value).padStart(2, '0')}
            </div>
            <div className="text-slate-400 text-xs mt-1 font-medium">{label}</div>
          </div>
          {i < units.length - 1 && (
            <span className="text-slate-300 font-black text-xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
