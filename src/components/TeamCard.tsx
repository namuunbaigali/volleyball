'use client';

import Link from 'next/link';
import { Users, School, ChevronRight } from 'lucide-react';

interface Member {
  firstName: string;
  lastName: string;
  graduationYear: number;
}

interface TeamCardProps {
  team: {
    _id: string;
    teamName: string;
    teamGender: 'male' | 'female';
    school: string;
    members: Member[];
    status: string;
  };
}

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <Link href={`/teams/${team._id}`}>
      <div className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/40 rounded-2xl p-5 transition-all duration-300 cursor-pointer overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-white font-bold text-lg group-hover:text-violet-300 transition-colors">
                {team.teamName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-gray-400 text-sm">
                <School className="w-3.5 h-3.5" />
                <span>{team.school}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  team.teamGender === 'male'
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                    : 'bg-pink-500/15 text-pink-300 border-pink-500/30'
                }`}
              >
                {team.teamGender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div className="border-t border-white/5 pt-3">
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>{team.members.length} гишүүн</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {team.members.slice(0, 4).map((m, i) => (
                <span
                  key={i}
                  className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-300"
                >
                  {m.lastName} {m.firstName}
                </span>
              ))}
              {team.members.length > 4 && (
                <span className="text-xs bg-violet-500/10 border border-violet-500/20 rounded-lg px-2 py-1 text-violet-300">
                  +{team.members.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
