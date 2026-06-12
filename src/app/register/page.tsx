'use client';

import { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Users, ChevronDown } from 'lucide-react';

interface Member {
  firstName: string;
  lastName: string;
  graduationYear: string;
  teacherName: string;
  phone: string;
  age: string;
  gender: 'male' | 'female';
}

const emptyMember = (): Member => ({
  firstName: '',
  lastName: '',
  graduationYear: '',
  teacherName: '',
  phone: '',
  age: '',
  gender: 'male',
});

const InputField = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) => (
  <div>
    <label className="block text-gray-300 text-sm font-medium mb-1.5">
      {label} {required && <span className="text-violet-400">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-white/5 border border-white/10 focus:border-violet-500/60 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none transition-colors text-sm"
    />
  </div>
);

export default function RegisterPage() {
  const [teamName, setTeamName] = useState('');
  const [teamGender, setTeamGender] = useState<'male' | 'female'>('male');
  const [school, setSchool] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [members, setMembers] = useState<Member[]>([emptyMember(), emptyMember(), emptyMember(), emptyMember(), emptyMember(), emptyMember()]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const updateMember = (index: number, field: keyof Member, value: string) => {
    setMembers((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const addMember = () => {
    if (members.length < 12) setMembers((prev) => [...prev, emptyMember()]);
  };

  const removeMember = (index: number) => {
    if (members.length > 6) setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamName,
          teamGender,
          school,
          contactPhone,
          contactEmail,
          members: members.map((m) => ({
            ...m,
            age: parseInt(m.age),
            graduationYear: parseInt(m.graduationYear),
          })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'Алдаа гарлаа');
      }
    } catch {
      setError('Сервертэй холбогдоход алдаа гарлаа');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/15 border border-green-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Амжилттай бүртгэгдлээ!</h1>
          <p className="text-gray-400 mb-8">
            Таны багийн бүртгэл хүлээн авагдлаа. Админ баталгаажуулсны дараа багийн жагсаалтад харагдана.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setTeamName('');
              setSchool('');
              setContactPhone('');
              setContactEmail('');
              setMembers([emptyMember(), emptyMember(), emptyMember(), emptyMember(), emptyMember(), emptyMember()]);
            }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-8 py-3 rounded-2xl transition-colors"
          >
            Дахин бүртгүүлэх
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Баг бүртгүүлэх</h1>
          <p className="text-gray-400">Бүх талбарыг үнэн зөв бөглөнө үү. 6-12 гишүүн бүртгэх боломжтой.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team info */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <h2 className="text-white font-bold text-lg">Багийн мэдээлэл</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Багийн нэр" value={teamName} onChange={setTeamName} placeholder="Баг нэр" required />
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  Ангилал <span className="text-violet-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={teamGender}
                    onChange={(e) => setTeamGender(e.target.value as 'male' | 'female')}
                    className="w-full bg-white/5 border border-white/10 focus:border-violet-500/60 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm appearance-none cursor-pointer"
                  >
                    <option value="male" className="bg-gray-900">Эрэгтэй</option>
                    <option value="female" className="bg-gray-900">Эмэгтэй</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>
            <InputField label="Сургуулийн нэр" value={school} onChange={setSchool} placeholder="Сургуулийн нэр" required />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Холбоо барих утас" value={contactPhone} onChange={setContactPhone} type="tel" placeholder="99001234" required />
              <InputField label="И-мэйл хаяг" value={contactEmail} onChange={setContactEmail} type="email" placeholder="example@email.com" required />
            </div>
          </div>

          {/* Members */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-400" />
                  Гишүүдийн мэдээлэл
                </h2>
                <p className="text-gray-500 text-sm mt-0.5">
                  {members.length}/12 гишүүн{' '}
                  {members.length < 6 && (
                    <span className="text-red-400">(хамгийн багадаа 6 шаардлагатай)</span>
                  )}
                </p>
              </div>
              {members.length < 12 && (
                <button
                  type="button"
                  onClick={addMember}
                  className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Гишүүн нэмэх
                </button>
              )}
            </div>

            <div className="space-y-4">
              {members.map((member, i) => (
                <div key={i} className="bg-white/3 border border-white/8 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-violet-400 text-sm font-bold"># {i + 1} гишүүн</span>
                    {members.length > 6 && (
                      <button
                        type="button"
                        onClick={() => removeMember(i)}
                        className="text-gray-600 hover:text-red-400 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputField label="Овог" value={member.lastName} onChange={(v) => updateMember(i, 'lastName', v)} placeholder="Овог" required />
                    <InputField label="Нэр" value={member.firstName} onChange={(v) => updateMember(i, 'firstName', v)} placeholder="Нэр" required />
                    <InputField label="Сургууль төгссөн он" value={member.graduationYear} onChange={(v) => updateMember(i, 'graduationYear', v)} type="number" placeholder="2020" required />
                    <InputField label="Багшийн нэр" value={member.teacherName} onChange={(v) => updateMember(i, 'teacherName', v)} placeholder="Багшийн нэр" required />
                    <InputField label="Утасны дугаар" value={member.phone} onChange={(v) => updateMember(i, 'phone', v)} type="tel" placeholder="99001234" required />
                    <InputField label="Нас" value={member.age} onChange={(v) => updateMember(i, 'age', v)} type="number" placeholder="25" required />
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-1.5">
                        Хүйс <span className="text-violet-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={member.gender}
                          onChange={(e) => updateMember(i, 'gender', e.target.value)}
                          className="w-full bg-white/5 border border-white/10 focus:border-violet-500/60 rounded-xl px-4 py-3 text-white outline-none transition-colors text-sm appearance-none cursor-pointer"
                        >
                          <option value="male" className="bg-gray-900">Эрэгтэй</option>
                          <option value="female" className="bg-gray-900">Эмэгтэй</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || members.length < 6}
            className="w-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-600/30"
          >
            {submitting ? 'Бүртгэж байна...' : 'Баг бүртгүүлэх'}
          </button>
        </form>
      </div>
    </div>
  );
}
