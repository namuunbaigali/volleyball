'use client';

import { useState } from 'react';
import { Calendar, MapPin, BookOpen, X, ChevronLeft, ChevronRight, ExternalLink, Download } from 'lucide-react';

interface Props {
  date: string;
  location: string;
  googleMapsUrl?: string;
  guidelineImages?: string[];
  guidelinesNote?: string;
}

const CARD_STYLES = [
  {
    icon: Calendar,
    label: 'Тэмцээний огноо',
    accent: 'bg-blue-500',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    border: 'border-blue-100',
    hover: 'hover:border-blue-200 hover:shadow-blue-100/50',
  },
  {
    icon: MapPin,
    label: 'Байршил',
    accent: 'bg-teal-500',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-500',
    border: 'border-teal-100',
    hover: 'hover:border-teal-200 hover:shadow-teal-100/50',
  },
  {
    icon: BookOpen,
    label: 'Удирдамж',
    accent: 'bg-violet-500',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    border: 'border-violet-100',
    hover: 'hover:border-violet-200 hover:shadow-violet-100/50',
  },
];

export default function InfoCards({ date, location, googleMapsUrl, guidelineImages = [], guidelinesNote }: Props) {
  const [guideOpen, setGuideOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const hasGuidelines = guidelineImages.length > 0 || !!guidelinesNote;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {/* Date card */}
        <div className={`relative bg-white border rounded-2xl p-5 text-left shadow-sm transition-all hover:shadow-md overflow-hidden ${CARD_STYLES[0].border} ${CARD_STYLES[0].hover}`}>
          <div className={`absolute top-0 left-0 right-0 h-1 ${CARD_STYLES[0].accent}`} />
          <div className={`w-9 h-9 ${CARD_STYLES[0].iconBg} rounded-xl flex items-center justify-center mb-3 mt-1`}>
            <Calendar className={`w-4 h-4 ${CARD_STYLES[0].iconColor}`} />
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{CARD_STYLES[0].label}</p>
          <p className="text-slate-800 font-bold text-sm leading-snug">{date || 'Тодорхойлогдоогүй'}</p>
        </div>

        {/* Location card — links directly to Google Maps */}
        <div className={`relative bg-white border rounded-2xl p-5 text-left shadow-sm transition-all hover:shadow-md overflow-hidden ${CARD_STYLES[1].border} ${CARD_STYLES[1].hover}`}>
          <div className={`absolute top-0 left-0 right-0 h-1 ${CARD_STYLES[1].accent}`} />
          <div className={`w-9 h-9 ${CARD_STYLES[1].iconBg} rounded-xl flex items-center justify-center mb-3 mt-1`}>
            <MapPin className={`w-4 h-4 ${CARD_STYLES[1].iconColor}`} />
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{CARD_STYLES[1].label}</p>
          <p className="text-slate-800 font-bold text-sm leading-snug mb-2">{location || 'Тодорхойлогдоогүй'}</p>
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-semibold flex items-center gap-1 transition-colors ${CARD_STYLES[1].iconColor} hover:opacity-70`}
            >
              <ExternalLink className="w-3 h-3" />
              Үзэх
            </a>
          )}
        </div>

        {/* Guidelines card */}
        <div className={`relative bg-white border rounded-2xl p-5 text-left shadow-sm transition-all hover:shadow-md overflow-hidden ${CARD_STYLES[2].border} ${CARD_STYLES[2].hover}`}>
          <div className={`absolute top-0 left-0 right-0 h-1 ${CARD_STYLES[2].accent}`} />
          <div className={`w-9 h-9 ${CARD_STYLES[2].iconBg} rounded-xl flex items-center justify-center mb-3 mt-1`}>
            <BookOpen className={`w-4 h-4 ${CARD_STYLES[2].iconColor}`} />
          </div>
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{CARD_STYLES[2].label}</p>
          <p className="text-slate-800 font-bold text-sm leading-snug mb-2">
            {guidelineImages.length > 0 ? `${guidelineImages.length} хуудас` : 'Удахгүй нэмэгдэнэ'}
          </p>
          {hasGuidelines && (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setGuideOpen(true)}
                className={`text-xs font-semibold flex items-center gap-1 transition-colors ${CARD_STYLES[2].iconColor} hover:opacity-70`}
              >
                <ExternalLink className="w-3 h-3" />
                Үзэх
              </button>
              {guidelineImages.length > 0 && (
                <a
                  href={guidelineImages[0]}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Шууд татах
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Guidelines Modal */}
      {guideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setGuideOpen(false)}>
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-violet-500" />
                <h3 className="font-bold text-slate-800">Тэмцээний удирдамж</h3>
              </div>
              <div className="flex items-center gap-3">
                {guidelineImages.length > 0 && (
                  <a
                    href={guidelineImages[imgIndex]}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-violet-600 hover:text-violet-700 flex items-center gap-1 font-medium"
                  >
                    <Download className="w-3 h-3" /> Татах
                  </a>
                )}
                <button onClick={() => setGuideOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-5 space-y-4">
              {guidelineImages.length > 0 && (
                <div>
                  <img src={guidelineImages[imgIndex]} alt={`Удирдамж ${imgIndex + 1}`}
                    className="w-full rounded-xl border border-slate-200 object-contain max-h-[50vh]" />
                  {guidelineImages.length > 1 && (
                    <div className="flex items-center justify-between mt-3">
                      <button onClick={() => setImgIndex(i => Math.max(0, i - 1))} disabled={imgIndex === 0}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-slate-500 font-medium">{imgIndex + 1} / {guidelineImages.length}</span>
                      <button onClick={() => setImgIndex(i => Math.min(guidelineImages.length - 1, i + 1))} disabled={imgIndex === guidelineImages.length - 1}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              {guidelinesNote && (
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{guidelinesNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
