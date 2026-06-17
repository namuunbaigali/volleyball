'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [images.length, next]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-blue-100 shadow-xl shadow-blue-100/50 group">
      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[current]}
        alt={`Зураг ${current + 1}`}
        className="w-full h-auto block"
      />

      {/* Prev/Next buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-700 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-2 bg-blue-500'
                  : 'w-2 h-2 bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
