'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, AlertTriangle, CheckCircle, Play, Calendar } from 'lucide-react';

interface IMatch {
  _id: string;
  team1Name: string;
  team2Name: string;
  category: string;
  scheduledTime: string;
  court: string;
  status: 'scheduled' | 'playing' | 'done' | 'delayed';
  delayMinutes: number;
  score1: string;
  score2: string;
  note: string;
  order: number;
}

const STATUS_CONFIG = {
  scheduled: { label: 'Товлогдсон', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Calendar },
  playing: { label: 'Тоглаж байна', color: 'text-red-600 bg-red-50 border-red-200', icon: Play },
  done: { label: 'Дууссан', color: 'text-slate-500 bg-slate-100 border-slate-200', icon: CheckCircle },
  delayed: { label: 'Хойшлогдсон', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertTriangle },
};

function formatTime(iso: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('mn-MN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function SchedulePage() {
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Бүгд');

  useEffect(() => {
    fetch('/api/matches').then(r => r.json()).then(d => {
      if (d.success) setMatches(d.data);
      setLoading(false);
    });
  }, []);

  const categories = ['Бүгд', ...Array.from(new Set(matches.map(m => m.category)))];
  const filtered = activeCategory === 'Бүгд' ? matches : matches.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 slide-up">
          <h1 className="text-4xl font-black text-slate-800 mb-2">Тоглолтын хуваарь</h1>
          <p className="text-slate-500">Тэмцээний бүх тоглолтын хуваарь</p>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-blue-50 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 fade-in">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Тоглолтын хуваарь одоогоор байхгүй байна</p>
            <p className="text-slate-400 text-sm mt-2">Удахгүй нэмэгдэх болно</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((match, i) => {
              const cfg = STATUS_CONFIG[match.status] || STATUS_CONFIG.scheduled;
              const StatusIcon = cfg.icon;
              const isPlaying = match.status === 'playing';
              const isDelayed = match.status === 'delayed';
              const isDone = match.status === 'done';

              return (
                <div key={match._id} className={`relative slide-up group ${isPlaying ? 'ring-2 ring-red-300' : ''}`}
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`relative bg-white shadow-sm shadow-blue-50 border-l-4 ${isPlaying ? 'border-l-red-400' : 'border-l-blue-200'} border border-blue-100/80 hover:border-blue-200 rounded-2xl p-5 transition-all hover:shadow-md hover:shadow-blue-100/50 ${isDone ? 'opacity-70' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Teams */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-center flex-1">
                          <p className={`font-black text-lg leading-tight ${isDone ? 'text-slate-400' : 'text-slate-800'}`}>
                            {match.team1Name}
                          </p>
                          {isDone && match.score1 && (
                            <p className="text-2xl font-black text-blue-600">{match.score1}</p>
                          )}
                        </div>
                        <div className={`shrink-0 text-center px-3 py-1.5 rounded-xl font-black text-sm ${
                          isPlaying ? 'bg-red-100 text-red-600 pulse-glow' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isPlaying ? '🔴 LIVE' : 'VS'}
                        </div>
                        <div className="text-center flex-1">
                          <p className={`font-black text-lg leading-tight ${isDone ? 'text-slate-400' : 'text-slate-800'}`}>
                            {match.team2Name}
                          </p>
                          {isDone && match.score2 && (
                            <p className="text-2xl font-black text-blue-600">{match.score2}</p>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col gap-2 shrink-0 sm:items-end">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${cfg.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(match.scheduledTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {match.court}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">{match.category}</span>
                      </div>
                    </div>

                    {isDelayed && match.delayMinutes > 0 && (
                      <div className="mt-3 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-orange-600 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span><strong>{match.delayMinutes} минутаар</strong> хойшлогдсон</span>
                      </div>
                    )}
                    {match.note && (
                      <p className="mt-2 text-xs text-slate-400 italic">{match.note}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
