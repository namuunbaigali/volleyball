'use client';

import { useEffect, useState } from 'react';
import TeamCard from '@/components/TeamCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { Users, Search, Hash } from 'lucide-react';

interface Member { firstName: string; lastName: string; graduationYear: number; }

interface Team {
  _id: string; teamName: string; teamGender: 'male' | 'female' | 'mixed';
  school: string; members: Member[]; status: string; tournamentType?: string;
}

type TabKey = 'all' | 'v_male' | 'v_female' | 'mixed' | 'soft';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'all', label: 'Бүгд', icon: '🏆' },
  { key: 'v_male', label: 'Волейбол (Эр)', icon: '💪' },
  { key: 'v_female', label: 'Волейбол (Эм)', icon: '👑' },
  { key: 'mixed', label: 'Холимог', icon: '⚡' },
  { key: 'soft', label: 'Софт', icon: '🌟' },
];

function matchesTab(team: Team, tab: TabKey): boolean {
  if (tab === 'all') return true;
  const type = team.tournamentType || 'volleyball';
  if (tab === 'v_male') return type === 'volleyball' && team.teamGender === 'male';
  if (tab === 'v_female') return type === 'volleyball' && team.teamGender === 'female';
  if (tab === 'mixed') return type === 'mixed';
  if (tab === 'soft') return type === 'soft_volleyball';
  return true;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [gradYear, setGradYear] = useState('');

  useEffect(() => {
    fetch('/api/teams').then(r => r.json()).then(d => {
      if (d.success) setTeams(d.data);
      setLoading(false);
    });
  }, []);

  const filtered = teams.filter(t => {
    if (!matchesTab(t, tab)) return false;
    if (gradYear) {
      const yr = parseInt(gradYear);
      if (!isNaN(yr) && !t.members.some(m => m.graduationYear === yr)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return t.teamName.toLowerCase().includes(q) || t.school.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 slide-up">
          <h1 className="text-4xl font-black text-white mb-2">Бүртгэгдсэн багууд</h1>
          <p className="text-gray-400">
            Нийт <span className="text-violet-400 font-bold text-lg">{teams.length}</span> баг бүртгэгдсэн
          </p>
        </div>

        {/* Search row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Баг, сургуулиар хайх..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-2xl pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all shadow-sm" />
          </div>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="number" placeholder="Төгсөлтийн оноор хайх (жш: 2020)" value={gradYear}
              onChange={e => setGradYear(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-2xl pl-11 pr-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all shadow-sm" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => {
            const count = teams.filter(tm => matchesTab(tm, t.key)).length;
            return (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 ${
                  tab === t.key
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-700 hover:border-blue-200'
                }`}>
                <span>{t.icon}</span>
                {t.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === t.key ? 'bg-white/25' : 'bg-slate-100'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-blue-50 rounded-2xl p-5 h-44 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 fade-in">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              {search || gradYear ? 'Хайлтад тохирох баг олдсонгүй' : 'Одоогоор бүртгэгдсэн баг байхгүй байна'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((team, i) => (
              <div key={team._id} className="slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <TeamCard team={team} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
