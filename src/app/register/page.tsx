'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';

interface Member {
  firstName: string;
  lastName: string;
  graduationYear: string;
  teacherName: string;
  phone: string;
  age: string;
  gender: 'male' | 'female';
}

type CategoryKey = 'v_male' | 'v_female' | 'mixed' | 'soft';

const CATEGORIES: { key: CategoryKey; label: string; sub: string; icon: string; borderColor: string; bgColor: string }[] = [
  { key: 'v_male', label: 'Волейбол (Эр)', sub: '6–12 гишүүн', icon: '🏐', borderColor: 'border-blue-500', bgColor: 'bg-blue-50' },
  { key: 'v_female', label: 'Волейбол (Эм)', sub: '6–12 гишүүн', icon: '🏐', borderColor: 'border-pink-500', bgColor: 'bg-pink-50' },
  { key: 'mixed', label: 'Холимог', sub: '6–12 гишүүн', icon: '⚡', borderColor: 'border-amber-500', bgColor: 'bg-amber-50' },
  { key: 'soft', label: 'Софт', sub: '3♂ + 3♀ = 6', icon: '🌟', borderColor: 'border-purple-500', bgColor: 'bg-purple-50' },
];

const emptyMember = (gender: 'male' | 'female' = 'male'): Member => ({
  firstName: '', lastName: '', graduationYear: '', teacherName: '', phone: '', age: '', gender,
});

const InputField = ({ label, value, onChange, type = 'text', placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) => (
  <div>
    <label className="block text-slate-600 text-sm font-medium mb-1.5">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <input
      type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder} required={required}
      className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition-all text-sm"
    />
  </div>
);

export default function RegisterPage() {
  const [category, setCategory] = useState<CategoryKey>('v_male');
  const [teamName, setTeamName] = useState('');
  const [school, setSchool] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [members, setMembers] = useState<Member[]>(Array.from({ length: 6 }, () => emptyMember()));
  const [softMale, setSoftMale] = useState<Member[]>(Array.from({ length: 3 }, () => emptyMember('male')));
  const [softFemale, setSoftFemale] = useState<Member[]>(Array.from({ length: 3 }, () => emptyMember('female')));
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isSoft = category === 'soft';
  const minMembers = 6;
  const maxMembers = 12;

  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    if (cat !== 'soft') {
      setMembers(Array.from({ length: 6 }, () => emptyMember()));
    }
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const updateSoftMember = (list: 'male' | 'female', index: number, field: keyof Member, value: string) => {
    if (list === 'male') {
      setSoftMale((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
    } else {
      setSoftFemale((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const allMembers = isSoft
      ? [...softMale.map(m => ({ ...m, gender: 'male' as const })), ...softFemale.map(m => ({ ...m, gender: 'female' as const }))]
      : members;

    const tournamentType = category === 'soft' ? 'soft_volleyball' : category === 'mixed' ? 'mixed' : 'volleyball';
    const teamGender = category === 'v_male' ? 'male' : category === 'v_female' ? 'female' : 'mixed';

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName, school, contactPhone, contactEmail,
          teamGender, tournamentType,
          members: allMembers.map((m) => ({ ...m, age: parseInt(m.age), graduationYear: parseInt(m.graduationYear) })),
        }),
      });
      const data = await res.json();
      if (data.success) setSuccess(true);
      else setError(data.error || 'Алдаа гарлаа');
    } catch {
      setError('Сервертэй холбогдоход алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSuccess(false); setTeamName(''); setSchool('');
    setContactPhone(''); setContactEmail('');
    setMembers(Array.from({ length: 6 }, () => emptyMember()));
    setSoftMale(Array.from({ length: 3 }, () => emptyMember('male')));
    setSoftFemale(Array.from({ length: 3 }, () => emptyMember('female')));
    setCategory('v_male');
  };

  const MemberCard = ({ member, index, onUpdate, label }: {
    member: Member; index: number;
    onUpdate: (i: number, f: keyof Member, v: string) => void;
    label?: string;
  }) => (
    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-blue-600 text-sm font-bold">{label || `#${index + 1} гишүүн`}</span>
        {!isSoft && members.length > minMembers && (
          <button type="button" onClick={() => setMembers(p => p.filter((_, i) => i !== index))}
            className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InputField label="Овог" value={member.lastName} onChange={(v) => onUpdate(index, 'lastName', v)} placeholder="Овог" required />
        <InputField label="Нэр" value={member.firstName} onChange={(v) => onUpdate(index, 'firstName', v)} placeholder="Нэр" required />
        <InputField label="Төгссөн он" value={member.graduationYear} onChange={(v) => onUpdate(index, 'graduationYear', v)} type="number" placeholder="2020" required />
        <InputField label="Багшийн нэр" value={member.teacherName} onChange={(v) => onUpdate(index, 'teacherName', v)} placeholder="Багшийн нэр" required />
        <InputField label="Утас" value={member.phone} onChange={(v) => onUpdate(index, 'phone', v)} type="tel" placeholder="99001234" required />
        <InputField label="Нас" value={member.age} onChange={(v) => onUpdate(index, 'age', v)} type="number" placeholder="25" required />
        {!isSoft && (
          <div>
            <label className="block text-slate-600 text-sm font-medium mb-1.5">Хүйс <span className="text-blue-500">*</span></label>
            <div className="relative">
              <select value={member.gender} onChange={(e) => onUpdate(index, 'gender', e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-3 text-slate-800 outline-none text-sm appearance-none cursor-pointer">
                <option value="male">Эрэгтэй</option>
                <option value="female">Эмэгтэй</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md bounce-in bg-white rounded-2xl p-10 border border-slate-200">
          <div className="w-24 h-24 bg-green-50 border border-green-200 rounded-3xl flex items-center justify-center mx-auto mb-6 float-anim">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-3">Амжилттай бүртгэгдлээ!</h1>
          <p className="text-slate-500 mb-8">Таны багийн бүртгэл хүлээн авагдлаа. Админ баталгаажуулсны дараа харагдана.</p>
          <button onClick={resetForm}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-3 rounded-2xl transition-all hover:scale-105">
            Дахин бүртгүүлэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 slide-up">
          <h1 className="text-4xl font-black text-slate-800 mb-2">Баг бүртгүүлэх</h1>
          <p className="text-slate-500">Тэмцээний төрлөө сонгоод бүх талбарыг бөглөнө үү.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-slate-800 font-bold text-lg mb-4">Тэмцээний төрөл</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat, i) => (
                <button key={cat.key} type="button" onClick={() => handleCategoryChange(cat.key)}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  className={`bounce-in flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200 ${
                    category === cat.key
                      ? `${cat.borderColor} ${cat.bgColor} text-slate-800 shadow-md`
                      : 'border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50/50 hover:scale-105'
                  }`}>
                  <span className="text-2xl mb-2">{cat.icon}</span>
                  <span className="font-bold text-sm text-center">{cat.label}</span>
                  <span className="text-xs mt-1 opacity-70">{cat.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team info */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-slate-800 font-bold text-lg">Багийн мэдээлэл</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Багийн нэр" value={teamName} onChange={setTeamName} placeholder="Баг нэр" required />
              <InputField label="Сургуулийн нэр" value={school} onChange={setSchool} placeholder="Сургуулийн нэр" required />
              <InputField label="Холбоо барих утас" value={contactPhone} onChange={setContactPhone} type="tel" placeholder="99001234" required />
              <InputField label="И-мэйл" value={contactEmail} onChange={setContactEmail} type="email" placeholder="example@email.com" required />
            </div>
          </div>

          {/* Members */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-slate-800 font-bold text-lg">Гишүүдийн мэдээлэл</h2>
                {!isSoft && (
                  <p className="text-slate-500 text-sm mt-0.5">
                    {members.length}/{maxMembers} гишүүн
                    {members.length < minMembers && <span className="text-red-500"> (хамгийн багадаа {minMembers})</span>}
                  </p>
                )}
              </div>
              {!isSoft && members.length < maxMembers && (
                <button type="button" onClick={() => setMembers(p => [...p, emptyMember()])}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Нэмэх
                </button>
              )}
            </div>

            {isSoft ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h3 className="text-blue-600 font-bold">Эрэгтэй тоглогчид (3)</h3>
                  </div>
                  <div className="space-y-3">
                    {softMale.map((m, i) => (
                      <MemberCard key={`m${i}`} member={m} index={i}
                        onUpdate={(idx, f, v) => updateSoftMember('male', idx, f, v)}
                        label={`Эрэгтэй #${i + 1}`} />
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <h3 className="text-pink-600 font-bold">Эмэгтэй тоглогчид (3)</h3>
                  </div>
                  <div className="space-y-3">
                    {softFemale.map((m, i) => (
                      <MemberCard key={`f${i}`} member={m} index={i}
                        onUpdate={(idx, f, v) => updateSoftMember('female', idx, f, v)}
                        label={`Эмэгтэй #${i + 1}`} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member, i) => (
                  <MemberCard key={i} member={member} index={i} onUpdate={updateMember} />
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting || (!isSoft && members.length < minMembers)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-200  text-lg">
            {submitting ? '⏳ Бүртгэж байна...' : '🏐 Баг бүртгүүлэх'}
          </button>
        </form>
      </div>
    </div>
  );
}
