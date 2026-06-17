import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import { Users, Phone, Mail, School, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

async function getTeam(id: string) {
  try {
    await connectDB();
    const team = await Team.findById(id).lean();
    return team;
  } catch {
    return null;
  }
}

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id) as {
    _id: string;
    teamName: string;
    teamGender: 'male' | 'female';
    school: string;
    contactPhone: string;
    contactEmail: string;
    members: {
      firstName: string;
      lastName: string;
      graduationYear: number;
      teacherName: string;
      phone: string;
      age: number;
      gender: string;
    }[];
    status: string;
  } | null;

  if (!team || team.status !== 'approved') notFound();

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/teams"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Багуудруу буцах
        </Link>

        {/* Team header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mb-6 shadow-xl shadow-blue-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-white">{team.teamName}</h1>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    team.teamGender === 'male'
                      ? 'bg-blue-500/30 text-blue-100 border-blue-400/50'
                      : 'bg-pink-500/30 text-pink-100 border-pink-400/50'
                  }`}
                >
                  {team.teamGender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-blue-100 text-sm">
                <span className="flex items-center gap-1.5">
                  <School className="w-4 h-4" />
                  {team.school}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {team.members.length} гишүүн
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`tel:${team.contactPhone}`}
                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-200" />
                {team.contactPhone}
              </a>
              <a
                href={`mailto:${team.contactEmail}`}
                className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-200" />
                {team.contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Members */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Багийн гишүүд
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {team.members.map((m, i) => (
              <div
                key={i}
                className="bg-white border border-blue-100/80 hover:border-blue-200 rounded-2xl p-5 transition-all shadow-sm hover:shadow-md hover:shadow-blue-100/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                        m.gender === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-slate-800 font-semibold">
                        {m.lastName} {m.firstName}
                      </p>
                      <p className="text-slate-400 text-xs">
                        {m.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'} · {m.age} нас
                      </p>
                    </div>
                  </div>
                  <span className="text-slate-500 text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg">
                    {m.graduationYear}
                  </span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span>Багш: {m.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <a href={`tel:${m.phone}`} className="hover:text-blue-600 transition-colors">
                      {m.phone}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
