'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Lock, CheckCircle, XCircle, Eye, Trash2, Save,
  ChevronDown, ChevronUp, Settings, Users, Upload,
  Download, X, Image as ImageIcon, Plus, Calendar, Play,
} from 'lucide-react';

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

const CATEGORIES_LIST = ['Волейбол (Эр)', 'Волейбол (Эм)', 'Холимог', 'Софт'];

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
  tournamentType?: string;
  createdAt: string;
}

interface ImageEntry {
  url: string;
  uploadedAt: string;
}

interface TournamentInfo {
  title: string;
  description: string;
  date: string;
  location: string;
  posters: ImageEntry[];
  schedules: ImageEntry[];
  guideline: ImageEntry[];
  registrationDeadline: string;
  prizeInfo: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loginError, setLoginError] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<'teams' | 'tournament' | 'schedule'>('teams');
  const [matches, setMatches] = useState<IMatch[]>([]);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [newMatch, setNewMatch] = useState({ team1Name: '', team2Name: '', category: 'Волейбол (Эр)', scheduledTime: '', court: '1-р талбай', order: 0 });
  const [showNewMatchForm, setShowNewMatchForm] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [tournament, setTournament] = useState<TournamentInfo>({
    title: '',
    description: '',
    date: '',
    location: '',
    posters: [],
    schedules: [],
    registrationDeadline: '',
    prizeInfo: '',
    guideline: [],
  });
  const [savingTournament, setSavingTournament] = useState(false);
  const [tournamentSaved, setTournamentSaved] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingSchedule, setUploadingSchedule] = useState(false);
  const [uploadingGuideline, setUploadingGuideline] = useState(false);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const scheduleInputRef = useRef<HTMLInputElement>(null);
  const guidelineInputRef = useRef<HTMLInputElement>(null);

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
        posters: data.data.posters || [],
        schedules: data.data.schedules || [],
        registrationDeadline: data.data.registrationDeadline || '',
        prizeInfo: data.data.prizeInfo || '',
        guideline: data.data.guideline || [],
      });
    }
  }, []);

  const fetchMatches = useCallback(async () => {
    const res = await fetch('/api/matches');
    const data = await res.json();
    if (data.success) setMatches(data.data);
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      fetchTeams(saved);
      fetchTournament();
      fetchMatches();
    }
  }, [fetchTeams, fetchTournament, fetchMatches]);

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
      fetchMatches();
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
    const { posters, schedules, ...fields } = tournament;
    void posters; void schedules;
    const res = await fetch('/api/tournament', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    if (data.success) {
      setTournamentSaved(true);
      setTimeout(() => setTournamentSaved(false), 3000);
    }
    setSavingTournament(false);
  };

  const handleImageUpload = async (file: File, type: 'poster' | 'schedule' | 'guideline') => {
    const setter = type === 'poster' ? setUploadingPoster : type === 'schedule' ? setUploadingSchedule : type=== 'guideline' ? setUploadingGuideline : setUploadingGuideline;
    setter(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const imageData = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
          body: JSON.stringify({ imageData, type }),
        });
        const data = await res.json();
        if (data.success) {
          await fetchTournament();
        } else {
          alert('Зураг оруулахад алдаа гарлаа: ' + data.error);
        }
        setter(false);
      };
      reader.onerror = () => {
        alert('Файл уншихад алдаа гарлаа');
        setter(false);
      };
    } catch {
      setter(false);
    }
  };

  const deleteImage = async (type: 'poster' | 'schedule' | 'guideline', index: number) => {
    if (!confirm('Энэ зургийг устгах уу?')) return;
    const res = await fetch('/api/admin/delete-image', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify({ type, index }),
    });
    const data = await res.json();
    if (data.success) {
      await fetchTournament();
    }
  };

  const createMatch = async () => {
    const res = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify(newMatch),
    });
    const data = await res.json();
    if (data.success) {
      setShowNewMatchForm(false);
      setNewMatch({ team1Name: '', team2Name: '', category: 'Волейбол (Эр)', scheduledTime: '', court: '1-р талбай', order: 0 });
      fetchMatches();
    }
  };

  const updateMatch = async (id: string, updates: Partial<IMatch>) => {
    await fetch(`/api/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': token },
      body: JSON.stringify(updates),
    });
    fetchMatches();
  };

  const deleteMatch = async (id: string) => {
    if (!confirm('Энэ тоглолтыг устгах уу?')) return;
    await fetch(`/api/matches/${id}`, { method: 'DELETE', headers: { 'x-admin-key': token } });
    fetchMatches();
  };

  const exportExcel = () => {
    const link = document.createElement('a');
    link.href = '/api/admin/export';
    // Pass token via URL for download (GET request can't have custom headers easily)
    link.href = `/api/admin/export?key=${encodeURIComponent(token)}`;
    link.click();
  };

  const statusColors: Record<string, string> = {
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    approved: 'text-green-600 bg-green-50 border-green-200',
    rejected: 'text-red-600 bg-red-50 border-red-200',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Хүлээгдэж буй',
    approved: 'Зөвшөөрсөн',
    rejected: 'Татгалзсан',
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl shadow-blue-100/50 border border-blue-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-800">Админ нэвтрэх</h1>
            <p className="text-slate-500 text-sm mt-1">Удирдах хэсэгт нэвтрэх</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Нууц үг"
              className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3.5 text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-200"
            >
              Нэвтрэх
            </button>
          </form>
        </div>
      </div>
    );
  }

  const pendingTeams = teams.filter((t) => t.status === 'pending');

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Админ хэсэг</h1>
            <p className="text-slate-500 text-sm mt-1">
              Нийт {teams.length} баг · {pendingTeams.length} хүлээгдэж буй
            </p>
          </div>
          <button
            onClick={() => { setToken(''); sessionStorage.removeItem('admin_token'); }}
            className="text-slate-500 hover:text-slate-800 text-sm px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-colors shadow-sm"
          >
            Гарах
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-100 border border-slate-200 rounded-2xl w-fit">
          {[
            { key: 'teams', label: 'Багууд', icon: Users },
            { key: 'schedule', label: 'Хуваарь', icon: Calendar },
            { key: 'tournament', label: 'Тэмцээний мэдээлэл', icon: Settings },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === t.key
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {activeTab === 'teams' && (
          <div>
            {/* Export button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={exportExcel}
                className="flex items-center gap-2 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Excel татаж авах
              </button>
            </div>
            <div className="space-y-3">
              {teams.length === 0 && (
                <div className="text-center py-16 text-slate-400">Бүртгэгдсэн баг байхгүй байна</div>
              )}
              {teams.map((team) => (
                <div key={team._id} className="bg-white border border-blue-100/80 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-slate-800 font-bold">{team.teamName}</h3>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                              team.teamGender === 'male'
                                ? 'bg-blue-100 text-blue-700 border-blue-200'
                                : 'bg-pink-100 text-pink-700 border-pink-200'
                            }`}
                          >
                            {team.teamGender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            team.tournamentType === 'soft_volleyball'
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : 'bg-blue-50 text-blue-600 border-blue-200'
                          }`}>
                            {team.tournamentType === 'soft_volleyball' ? 'Софт' : 'Волейбол'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${statusColors[team.status]}`}>
                            {statusLabels[team.status]}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-0.5">
                          {team.school} · {team.members.length} гишүүн · {team.contactPhone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {team.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(team._id, 'approved')}
                            className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Зөвшөөрөх
                          </button>
                          <button
                            onClick={() => updateStatus(team._id, 'rejected')}
                            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Татгалзах
                          </button>
                        </>
                      )}
                      {team.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(team._id, 'pending')}
                          className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                        >
                          Хүлээлтэнд оруулах
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedTeam(expandedTeam === team._id ? null : team._id)}
                        className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {expandedTeam === team._id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => deleteTeam(team._id)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {expandedTeam === team._id && (
                    <div className="border-t border-slate-100 p-5 bg-slate-50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {team.members.map((m, i) => (
                          <div key={i} className="bg-white rounded-xl p-3 text-sm border border-slate-100 shadow-sm">
                            <p className="text-slate-800 font-semibold">{m.lastName} {m.firstName}</p>
                            <p className="text-slate-500 text-xs mt-1">
                              {m.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй'} · {m.age} нас · {m.graduationYear} он
                            </p>
                            <p className="text-slate-500 text-xs">Багш: {m.teacherName}</p>
                            <p className="text-slate-400 text-xs">{m.phone}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm">{matches.length} тоглолт бүртгэгдсэн</p>
              <button onClick={() => setShowNewMatchForm(!showNewMatchForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all hover:scale-105 shadow-md shadow-blue-200">
                <Plus className="w-4 h-4" /> Тоглолт нэмэх
              </button>
            </div>

            {showNewMatchForm && (
              <div className="bg-white border border-blue-200 rounded-2xl p-5 space-y-3 shadow-md shadow-blue-50">
                <h3 className="text-slate-800 font-bold">Шинэ тоглолт</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: '1-р баг', key: 'team1Name', placeholder: 'Багийн нэр' },
                    { label: '2-р баг', key: 'team2Name', placeholder: 'Багийн нэр' },
                    { label: 'Талбай', key: 'court', placeholder: '1-р талбай' },
                    { label: 'Дараалал', key: 'order', placeholder: '1', type: 'number' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-slate-500 text-xs mb-1">{f.label}</label>
                      <input type={f.type || 'text'} placeholder={f.placeholder}
                        value={String(newMatch[f.key as keyof typeof newMatch])}
                        onChange={e => setNewMatch(p => ({ ...p, [f.key]: f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value }))}
                        className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2.5 text-slate-800 text-sm outline-none placeholder-slate-400" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-slate-500 text-xs mb-1">Ангилал</label>
                    <select value={newMatch.category} onChange={e => setNewMatch(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm outline-none appearance-none">
                      {CATEGORIES_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs mb-1">Огноо цаг</label>
                    <input type="datetime-local" value={newMatch.scheduledTime}
                      onChange={e => setNewMatch(p => ({ ...p, scheduledTime: e.target.value }))}
                      className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-3 py-2.5 text-slate-800 text-sm outline-none" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={createMatch}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
                    Хадгалах
                  </button>
                  <button onClick={() => setShowNewMatchForm(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm px-5 py-2.5 rounded-xl transition-colors">
                    Цуцлах
                  </button>
                </div>
              </div>
            )}

            {matches.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Тоглолтын хуваарь байхгүй байна</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matches.map((match) => (
                  <div key={match._id} className="bg-white border border-blue-100/80 rounded-2xl p-4 shadow-sm">
                    {editingMatch === match._id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {[
                            { label: '1-р баг', key: 'team1Name' },
                            { label: '2-р баг', key: 'team2Name' },
                            { label: 'Талбай', key: 'court' },
                            { label: 'Оноо 1', key: 'score1' },
                            { label: 'Оноо 2', key: 'score2' },
                            { label: 'Тэмдэглэл', key: 'note' },
                          ].map(f => (
                            <div key={f.key}>
                              <label className="block text-slate-500 text-xs mb-1">{f.label}</label>
                              <input defaultValue={String(match[f.key as keyof IMatch] || '')}
                                onBlur={e => updateMatch(match._id, { [f.key]: e.target.value })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                            </div>
                          ))}
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">Статус</label>
                            <select value={match.status} onChange={e => updateMatch(match._id, { status: e.target.value as IMatch['status'] })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm outline-none appearance-none">
                              <option value="scheduled">Товлогдсон</option>
                              <option value="playing">🔴 Тоглаж байна</option>
                              <option value="done">✅ Дууссан</option>
                              <option value="delayed">⚠️ Хойшлогдсон</option>
                            </select>
                          </div>
                          {match.status === 'delayed' && (
                            <div>
                              <label className="block text-slate-500 text-xs mb-1">Хойшлолт (минут)</label>
                              <input type="number" defaultValue={match.delayMinutes}
                                onBlur={e => updateMatch(match._id, { delayMinutes: parseInt(e.target.value) || 0 })}
                                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm outline-none" />
                            </div>
                          )}
                          <div>
                            <label className="block text-slate-500 text-xs mb-1">Огноо цаг</label>
                            <input type="datetime-local" defaultValue={match.scheduledTime?.slice(0, 16)}
                              onBlur={e => updateMatch(match._id, { scheduledTime: e.target.value })}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-sm outline-none" />
                          </div>
                        </div>
                        <button onClick={() => setEditingMatch(null)}
                          className="text-slate-500 hover:text-slate-800 text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                          Хаах
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-slate-800 font-bold">{match.team1Name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              match.status === 'playing' ? 'bg-red-100 text-red-600' :
                              match.status === 'delayed' ? 'bg-orange-100 text-orange-600' :
                              match.status === 'done' ? 'bg-slate-100 text-slate-500' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {match.status === 'playing' ? '🔴 LIVE' : match.status === 'delayed' ? '⚠️' : match.status === 'done' ? '✅' : 'VS'}
                            </span>
                            <span className="text-slate-800 font-bold">{match.team2Name}</span>
                            {match.score1 && <span className="text-blue-600 font-black text-sm">{match.score1}:{match.score2}</span>}
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex gap-3 flex-wrap">
                            <span>{match.category}</span>
                            <span>{match.court}</span>
                            <span>{match.scheduledTime ? new Date(match.scheduledTime).toLocaleString('mn-MN') : ''}</span>
                            {match.delayMinutes > 0 && <span className="text-orange-500">+{match.delayMinutes}мин</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => setEditingMatch(match._id)}
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs px-3 py-2 rounded-xl transition-colors flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5" /> Засах
                          </button>
                          <button onClick={() => deleteMatch(match._id)}
                            className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-500 text-xs px-3 py-2 rounded-xl transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tournament' && (
          <div className="space-y-6">
            {/* Text fields */}
            <div className="bg-white shadow-lg shadow-blue-100/50 border border-blue-100/80 rounded-3xl p-6 space-y-4">
              <h2 className="text-slate-800 font-bold text-lg mb-2">Тэмцээний мэдээлэл засах</h2>
              {[
                { label: 'Тэмцээний нэр', key: 'title', placeholder: 'Волейбол тэмцээн 2025' },
                { label: 'Тайлбар', key: 'description', placeholder: 'Тэмцээний тайлбар...' },
                { label: 'Тэмцээн болох огноо', key: 'date', placeholder: '2025-06-15' },
                { label: 'Байршил', key: 'location', placeholder: 'UB Sports Center' },
                { label: 'Бүртгэл хаагдах огноо', key: 'registrationDeadline', placeholder: '2025-06-01T00:00:00' },
                { label: 'Удирдамж', key: 'guideline', placeholder: 'Тэмцээний удирдамж...' },
                { label: 'Шагналын мэдээлэл', key: 'prizeInfo', placeholder: '1-р байр: ...' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-slate-600 text-sm font-medium mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    value={tournament[field.key as keyof TournamentInfo] as string}
                    onChange={(e) => setTournament((prev) => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm"
                  />
                </div>
              ))}
              <button
                onClick={saveTournament}
                disabled={savingTournament}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md shadow-blue-200"
              >
                <Save className="w-4 h-4" />
                {tournamentSaved ? 'Хадгалагдлаа!' : savingTournament ? 'Хадгалж байна...' : 'Хадгалах'}
              </button>
            </div>
            {/* Guideline images */}
            <ImageManager
              title="Тэмцээний удирдамж"
              images={tournament.guideline}
              type="guideline"
              uploading={uploadingGuideline }
              inputRef={guidelineInputRef}
              onUpload={(file) => handleImageUpload(file, 'guideline')}
              onDelete={(i) => deleteImage('guideline', i)}
            />
            {/* Poster images */}
            <ImageManager
              title="Тэмцээний постер"
              images={tournament.posters}
              type="poster"
              uploading={uploadingPoster}
              inputRef={posterInputRef}
              onUpload={(file) => handleImageUpload(file, 'poster')}
              onDelete={(i) => deleteImage('poster', i)}
            />

            {/* Schedule images */}
            <ImageManager
              title="Тоглолтын хуваарь"
              images={tournament.schedules}
              type="schedule"
              uploading={uploadingSchedule}
              inputRef={scheduleInputRef}
              onUpload={(file) => handleImageUpload(file, 'schedule')}
              onDelete={(i) => deleteImage('schedule', i)}
            />
          </div>
        )}

        
      </div>
    </div>
  );
}

function ImageManager({
  title,
  images,
  uploading,
  inputRef,
  onUpload,
  onDelete,
}: {
  title: string;
  images: { url: string; uploadedAt: string }[];
  type: 'poster' | 'schedule' | 'guideline' ;
  uploading: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (file: File) => void;
  onDelete: (index: number) => void;
}) {
  return (
    <div className="bg-white shadow-lg shadow-blue-100/50 border border-blue-100/80 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-slate-800 font-bold text-lg">{title}</h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= 10}
          className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <span className="flex items-center gap-2"><Upload className="w-4 h-4 animate-pulse" /> Оруулж байна...</span>
          ) : (
            <span className="flex items-center gap-2"><Upload className="w-4 h-4" /> Зураг нэмэх</span>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = '';
          }}
        />
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-blue-100 rounded-2xl p-10 text-center bg-blue-50/30">
          <ImageIcon className="w-10 h-10 text-blue-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Зураг байхгүй байна</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <div key={i} className="relative group rounded-2xl overflow-hidden border border-blue-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={`Зураг ${i + 1}`} className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onDelete(i)}
                  className="bg-red-500 hover:bg-red-400 text-white rounded-full p-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm px-2 py-1">
                <p className="text-xs text-slate-500">
                  {i === 0 ? 'Шинэ' : `#${i + 1}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-slate-400 text-xs mt-2">{images.length}/10 зураг</p>
    </div>
  );
}
