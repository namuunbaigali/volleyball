'use client';

import { useEffect, useState } from 'react';
import TeamCard from '@/components/TeamCard';
import { Users, Search } from 'lucide-react';

interface Member {
  firstName: string;
  lastName: string;
  graduationYear: number;
}

interface Team {
  _id: string;
  teamName: string;
  teamGender: 'male' | 'female';
  school: string;
  members: Member[];
  status: string;
  tournamentType?: string;
}

type TabKey = 'all' | 'v_male' | 'v_female' | 's_male' | 's_female';

const TAB_DEFS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'Бүгд' },
  { key: 'v_male', label: 'Волейбол (Эр)' },
  { key: 'v_female', label: 'Волейбол (Эм)' },
  { key: 's_male', label: 'Софт (Эр)' },
  { key: 's_female', label: 'Софт (Эм)' },
];

function matchesTab(team: Team, tab: TabKey): boolean {
  if (tab === 'all') return true;
  const isSoft = team.tournamentType === 'soft_volleyball';
  if (tab === 'v_male') return !isSoft && team.teamGender === 'male';
  if (tab === 'v_female') return !isSoft && team.teamGender === 'female';
  if (tab === 's_male') return isSoft && team.teamGender === 'male';
  if (tab === 's_female') return isSoft && team.teamGender === 'female';
  return true;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/teams')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeams(d.data);
        setLoading(false);
      });
  }, []);

  const filtered = teams.filter((t) => {
    const matchTab = matchesTab(t, tab);
    const matchSearch =
      t.teamName.toLowerCase().includes(search.toLowerCase()) ||
      t.school.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const countForTab = (key: TabKey) => teams.filter((t) => matchesTab(t, key)).length;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Бүртгэгдсэн багууд</h1>
          <p className="text-gray-400">
            Нийт <span className="text-amber-400 font-semibold">{teams.length}</span> баг бүртгэгдсэн байна
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Баг, сургуулиар хайх..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-gray-500 outline-none transition-colors"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
          {TAB_DEFS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.key
                  ? 'bg-red-700 text-white shadow-lg shadow-red-800/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  tab === t.key ? 'bg-white/20' : 'bg-white/5'
                }`}
              >
                {countForTab(t.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Teams grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Users className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {search ? 'Хайлтад тохирох баг олдсонгүй' : 'Одоогоор бүртгэгдсэн баг байхгүй байна'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
