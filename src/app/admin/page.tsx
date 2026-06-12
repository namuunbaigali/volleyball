'use client';

import { useState, useEffect, useCallback } from 'react';
import { Lock, CheckCircle, XCircle, Eye, Trash2, Save, ChevronDown, ChevronUp, Settings, Users } from 'lucide-react';

interface Member {
  firstName: string;
  lastName: string;
  graduationYear: number;
  teacherName: string;
  phone: string;
  age: number;
  gender: string;
}

interface Team {
  _id: string;
  teamName: string;
  teamGender: string;
  school: string;
  contactPhone: string;
  contactEmail: string;
  members: Member[];
  status: string;
  createdAt: string;
}

interface TournamentInfo {
  title: string;
  description: string;
  date: string;
  location: string;
  posterUrl: string;
  scheduleUrl: string;
  registrationDeadline: string;
  prizeInfo: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'tournament'>('teams');
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [tournament, setTournament] = useState<TournamentInfo>({
    title: '',
    description: '',
    date: '',
    location: '',
    posterUrl: '',
    scheduleUrl: '',
    registrationDeadline: '',
    prizeInfo: '',
  });
  const [savingTournament, setSavingTournament] = useState(false);
  const [tournamentSaved, setTournamentSaved] = useState(false);

  const fetchTeams = useCallback(async (tok: string) => {
    const res = await fetch('/api/admin', { headers: { 'x-admin-key': tok } });
    const data = await res.json();
    if (data.success) setTeams(data.data);
  }, []);

  const fetchTournament = useCallback(async () => {
    const res = await fetch('/api/tournament');
    const data = await res.json();
    if (data.success) {
      setTournament({
        title: data.data.title || '',
        description: data.data.description || '',
        date: data.data.date || '',
        location: data.data.location || '',
        posterUrl: data.data.posterUrl || '',
        scheduleUrl: data.data.scheduleUrl || '',
        registrationDeadline: data.data.registrationDeadline || '',
        prizeInfo: data.data.prizeInfo || '',
      });
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      fetchTeams(saved);
      fetchTournament();
    }
  }, [fetchTeams, fetchTournament]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      setToken(data.token);
      sessionStorage.setItem('admin_token', data.token);
      fetchTeams(data.token);
      fetchTournament();
    } else {
      setLoginError(data.error || 'Нэвтрэхэд алдаа гарлаа');
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/teams/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify({ status }),
    });
    fetchTeams(token);
  };

  const deleteTeam = async (id: string) => {
    if (!confirm('Энэ багийг устгах уу?')) return;
    await fetch(`/api/teams/${id}`, { method: 'DELETE', headers: { 'x-admin-key': token } });
    fetchTeams(token);
  };

  const saveTournament = async () => {
    setSavingTournament(true);
    const res = await fetch('/api/tournament', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify(tournament),
    });
    const data = await res.json();
    if (data.success) {
      setTournamentSaved(true);
      setTimeout(() => setTournamentSaved(false), 3000);
    }
    setSavingTournament(false);
  };

  const statusColors: Record<string, string> = {
    pending: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
    approved: 'text-green-300 bg-green-500/10 border-green-500/30',
    rejected: 'text-red-300 bg-red-500/10 border-red-500/30',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Хүлээгдэж буй',
    approved: 'Зөвшөөрсөн',
    rejected: 'Татгалзсан',
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-violet-500/15 border border-violet-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-violet-400" />
            </div>
            <h1 className="text-2xl font-black text-white">Админ нэвтрэх</h1>
            <p className="text-gray-500 text-sm mt-1">Удирдах хэсэгт нэвтрэх</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үг"
              className="w-full bg-white/5 border border-white/10 focus:border-violet-500/60 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 outline-none transition-colors"
            />
            {loginError && (
              <p className="text-red-400 text-sm">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingTeams = teams.filter((t) => t.status === 'pending');
  const approvedTeams = teams.filter((t) => t.status === 'approved');

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Админ хэсэг</h1>
            <p className="text-gray-500 text-sm mt-1">
              Нийт {teams.length} баг · {pendingTeams.length} хүлээгдэж буй
            </p>
          </div>
          <button
            onClick={() => { setToken(''); sessionStorage.removeItem('admin_token'); }}
            className="text-gray-500 hover:text-white text-sm px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            Гарах
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
          {[
            { key: 'teams', label: 'Багууд', icon: Users },
            { key: 'tournament', label: 'Тэмцээний мэдээлэл', icon: Settings },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.key ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'teams' && (
          <div className="space-y-3">
            {teams.length === 0 && (
              <div className="text-center py-16 text-gray-600">Бүртгэгдсэн баг байхгүй байна</div>
            )}
            {teams.map((team) => (
              <div key={team._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-bold">{team.teamName}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            team.teamGender === 'male'
                              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              : 'bg-pink-500/15 text-pink-300 border-pink-500/30'
                          }`}
                        >
                          {team.teamGender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[team.status]}`}>
                          {statusLabels[team.status]}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {team.school} · {team.members.length} гишүүн · {team.contactPhone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {team.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(team._id, 'approved')}
                          className="flex items-center gap-1.5 bg-green-500/15 hover:bg-green-500/25 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Зөвшөөрөх
                        </button>
                        <button
                          onClick={() => updateStatus(team._id, 'rejected')}
                          className="flex items-center gap-1.5 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Татгалзах
                        </button>
                      </>
                    )}
                    {team.status === 'approved' && (
                      <button
                        onClick={() => updateStatus(team._id, 'pending')}
                        className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                      >
                        Хүлээлтэнд оруулах
                      </button>
                    )}
                    <button
                      onClick={() => setExpandedTeam(expandedTeam === team._id ? null : team._id)}
                      className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {expandedTeam === team._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <button
                      onClick={() => deleteTeam(team._id)}
                      className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {expandedTeam === team._id && (
                  <div className="border-t border-white/8 p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {team.members.map((m, i) => (
                        <div key={i} className="bg-white/3 rounded-xl p-3 text-sm">
                          <p className="text-white font-semibold">{m.lastName} {m.firstName}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {m.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'} · {m.age} нас · {m.graduationYear} он
                          </p>
                          <p className="text-gray-500 text-xs">Багш: {m.teacherName}</p>
                          <p className="text-gray-400 text-xs">{m.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tournament' && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-white font-bold text-lg mb-2">Тэмцээний мэдээлэл засах</h2>
            {[
              { label: 'Тэмцээний нэр', key: 'title', placeholder: 'Волейбол тэмцээн 2025' },
              { label: 'Тайлбар', key: 'description', placeholder: 'Тэмцээний тайлбар...' },
              { label: 'Огноо', key: 'date', placeholder: '2025-06-15' },
              { label: 'Байршил', key: 'location', placeholder: 'UB Sports Center' },
              { label: 'Постерийн URL', key: 'posterUrl', placeholder: 'https://...' },
              { label: 'Хуваарийн постер URL', key: 'scheduleUrl', placeholder: 'https://...' },
              { label: 'Бүртгэлийн дэдлайн', key: 'registrationDeadline', placeholder: '2025-06-01' },
              { label: 'Шагналын мэдээлэл', key: 'prizeInfo', placeholder: '1-р байр: ...' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">{field.label}</label>
                <input
                  type="text"
                  value={tournament[field.key as keyof TournamentInfo]}
                  onChange={(e) => setTournament((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 focus:border-violet-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
                />
              </div>
            ))}
            <button
              onClick={saveTournament}
              disabled={savingTournament}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" />
              {tournamentSaved ? 'Хадгалагдлаа!' : savingTournament ? 'Хадгалж байна...' : 'Хадгалах'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
