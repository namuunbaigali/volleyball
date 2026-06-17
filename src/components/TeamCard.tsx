'use client';

import Link from 'next/link';
import { Users, School, ChevronRight, Clock } from 'lucide-react';

interface Member { firstName: string; lastName: string; graduationYear: number; }

interface TeamCardProps {
  team: {
    _id: string; teamName: string; teamGender: 'male' | 'female' | 'mixed';
    school: string; members: Member[]; status: string; tournamentType?: string;
  };
}

const TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  volleyball_male: { label: 'Волейбол (Эр)', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: '💪' },
  volleyball_female: { label: 'Волейбол (Эм)', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30', icon: '👑' },
  mixed: { label: 'Холимог', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: '⚡' },
  soft_volleyball: { label: 'Софт', color: 'bg-violet-500/15 text-violet-300 border-violet-500/30', icon: '🌟' },
};

function getTypeKey(tournamentType?: string, teamGender?: string) {
  if (tournamentType === 'soft_volleyball') return 'soft_volleyball';
  if (tournamentType === 'mixed') return 'mixed';
  return `volleyball_${teamGender || 'male'}`;
}

export default function TeamCard({ team }: TeamCardProps) {
  const typeKey = getTypeKey(team.tournamentType, team.teamGender);
  const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.volleyball_male;

  return (
    <Link href={`/teams/${team._id}`}>
      <div className="group relative bg-white/5 hover:bg-white/9 border border-white/10 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-900/20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-black text-base group-hover:text-violet-300 transition-colors truncate">
                {team.teamName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-xs">
                <School className="w-3 h-3 shrink-0" />
                <span className="truncate">{team.school}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all ml-2 shrink-0" />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}>
              {config.icon} {config.label}
            </span>
            {team.status === 'pending' && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Clock className="w-3 h-3" /> Хүлээгдэж буй
              </span>
            )}
          </div>

          <div className="border-t border-white/6 pt-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>{team.members.length} гишүүн</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {team.members.slice(0, 3).map((m, i) => (
                <span key={i} className="text-xs bg-white/5 border border-white/8 rounded-lg px-2 py-1 text-gray-300">
                  {m.lastName} {m.firstName}
                </span>
              ))}
              {team.members.length > 3 && (
                <span className="text-xs bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-1 text-violet-300">
                  +{team.members.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
