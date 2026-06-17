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
  volleyball_male: { label: 'Волейбол (Эр)', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💪' },
  volleyball_female: { label: 'Волейбол (Эм)', color: 'bg-pink-100 text-pink-700 border-pink-200', icon: '👑' },
  mixed: { label: 'Холимог', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '⚡' },
  soft_volleyball: { label: 'Софт', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🌟' },
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
      <div className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:bg-slate-50/50 transition-colors cursor-pointer">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-800 font-black text-base group-hover:text-blue-600 transition-colors truncate">
                {team.teamName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-slate-400 text-xs">
                <School className="w-3 h-3 shrink-0" />
                <span className="truncate">{team.school}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all ml-2 shrink-0" />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${config.color}`}>
              {config.icon} {config.label}
            </span>
            {team.status === 'pending' && (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                <Clock className="w-3 h-3" /> Хүлээгдэж буй
              </span>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>{team.members.length} гишүүн</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {team.members.slice(0, 3).map((m, i) => (
                <span key={i} className="text-xs bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-slate-600">
                  {m.lastName} {m.firstName}
                </span>
              ))}
              {team.members.length > 3 && (
                <span className="text-xs bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 text-blue-600">
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
