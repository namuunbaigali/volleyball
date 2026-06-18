import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Zap, Medal } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Tournament from '@/models/Tournament';
import { RegistrationBadge } from '@/components/Countdown';
import ImageSlider from '@/components/ImageSlider';

async function getTournament() {
  try {
    await connectDB();
    let t = await Tournament.findOne().lean();
    if (!t) t = null;
    return t as {
      title?: string;
      description?: string;
      date?: string;
      location?: string;
      posters?: { url: string; uploadedAt: Date }[];
      schedules?: { url: string; uploadedAt: Date }[];
      registrationDeadline?: string;
      prizeInfo?: string;
    } | null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const tournament = await getTournament();

  const title = tournament?.title || 'Волейбол Тэмцээн 2025';
  const description =
    tournament?.description ||
    'Улаанбаатар хотын хамгийн том волейбол тэмцээнд тавтай морилно уу. Эрэгтэй болон эмэгтэй ангиллаар баг бүртгүүлж, өрсөлдөөнд оролцоорой!';
  const date = tournament?.date || 'Тодорхойлогдоогүй';
  const location = tournament?.location || 'Тодорхойлогдоогүй';
  const deadline = tournament?.registrationDeadline || '';
  const prizeInfo = tournament?.prizeInfo || '';
  const posterUrls = (tournament?.posters || []).map((p) => p.url);
  const scheduleUrls = (tournament?.schedules || []).map((s) => s.url);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-24 max-w-5xl mx-auto text-center overflow-hidden">

        {/* Blob decorations — зурган дээрх загвар */}
        <div className="pointer-events-none select-none" aria-hidden>
          {/* Top-right teal blob */}
          <svg className="absolute -top-10 -right-24 w-80 h-80 opacity-60" viewBox="0 0 400 400" fill="none">
            <path d="M320 60 C380 20, 420 100, 390 180 C360 260, 280 300, 220 270 C160 240, 140 160, 170 100 C200 40, 260 100, 320 60Z" fill="#5EEAD4" />
          </svg>
          {/* Right blue blob */}
          <svg className="absolute top-20 -right-10 w-64 h-72 opacity-70" viewBox="0 0 300 350" fill="none">
            <path d="M240 30 C290 10, 310 80, 290 160 C270 240, 200 280, 150 250 C100 220, 90 150, 120 90 C150 30, 190 50, 240 30Z" fill="#2563EB" />
          </svg>
          {/* Bottom-right gold arc */}
          <svg className="absolute bottom-10 -right-10 w-56 h-56 opacity-40" viewBox="0 0 250 250" fill="none">
            <path d="M200 200 Q250 150 200 80 Q150 10 80 40" stroke="#F59E0B" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M220 220 Q270 160 215 85 Q165 10 90 45" stroke="#F59E0B" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
          </svg>
          {/* Bottom blue semicircle */}
          <svg className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-24 opacity-80" viewBox="0 0 200 100" fill="none">
            <path d="M0 100 A100 100 0 0 1 200 100Z" fill="#2563EB" />
          </svg>
          {/* Volleyball ball — large faded background */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] opacity-[0.04]" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="95" stroke="#0f172a" strokeWidth="3" fill="none"/>
            <path d="M100 5 C120 40, 160 60, 195 100" stroke="#0f172a" strokeWidth="3" fill="none"/>
            <path d="M100 5 C80 40, 40 60, 5 100" stroke="#0f172a" strokeWidth="3" fill="none"/>
            <path d="M195 100 C160 140, 120 160, 100 195" stroke="#0f172a" strokeWidth="3" fill="none"/>
            <path d="M5 100 C40 140, 80 160, 100 195" stroke="#0f172a" strokeWidth="3" fill="none"/>
            <path d="M30 30 C60 60, 80 110, 60 160" stroke="#0f172a" strokeWidth="3" fill="none"/>
            <path d="M170 30 C140 60, 120 110, 140 160" stroke="#0f172a" strokeWidth="3" fill="none"/>
          </svg>
        </div>

        <div className="relative z-10">
          <div className="mb-8">
            <RegistrationBadge deadline={deadline} />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span className="text-slate-900">{title.split(' ').slice(0, -1).join(' ')} </span>
            <span className="shimmer-text">{title.split(' ').slice(-1)[0]}</span>
          </h1>

          <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-20">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
            >
              Баг бүртгүүлэх
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3.5 rounded-xl transition-colors border border-slate-200"
            >
              <Users className="w-4 h-4" />
              Бүртгэгдсэн багууд
            </Link>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Calendar, label: 'Тэмцээний огноо', value: date },
              { icon: MapPin, label: 'Байршил', value: location },
              { icon: Trophy, label: 'Бүртгэлийн дэдлайн', value: deadline || 'Тодорхойлогдоогүй' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 text-left shadow-sm">
                <item.icon className="w-4 h-4 text-blue-500 mb-2" />
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-slate-800 font-semibold text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {prizeInfo && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto text-left">
              <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider mb-1">Шагнал</p>
              <p className="text-slate-700 text-sm">{prizeInfo}</p>
            </div>
          )}

        </div>
      </section>

      {posterUrls.length > 0 && (
        <section className="px-4 pb-16 max-w-3xl mx-auto">
          <h2 className="text-slate-800 text-xl font-bold mb-4">Тэмцээний зар</h2>
          <ImageSlider images={posterUrls} />
        </section>
      )}

      {scheduleUrls.length > 0 && (
        <section className="px-4 pb-16 max-w-3xl mx-auto">
          <h2 className="text-slate-800 text-xl font-bold mb-4">Тоглолтын хуваарь</h2>
          <ImageSlider images={scheduleUrls} />
        </section>
      )}

      {/* CTA — tournament spirit */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-slate-900 text-white">
          {/* Blob decorations inside CTA */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <svg className="absolute -top-12 -right-12 w-64 h-64 opacity-30" viewBox="0 0 300 300" fill="none">
              <path d="M240 40 C290 10, 320 90, 290 170 C260 250, 180 290, 120 260 C60 230, 50 150, 80 90 C110 30, 190 70, 240 40Z" fill="#5EEAD4" />
            </svg>
            <svg className="absolute -bottom-8 -left-8 w-48 h-48 opacity-20" viewBox="0 0 250 250" fill="none">
              <path d="M190 30 C240 10, 260 80, 240 150 C220 220, 150 260, 90 230 C30 200, 20 130, 50 70 C80 10, 140 50, 190 30Z" fill="#2563EB" />
            </svg>
            {/* Volleyball lines */}
            <svg className="absolute right-8 top-1/2 -translate-y-1/2 w-40 h-40 opacity-10" viewBox="0 0 200 200" fill="none">
              <circle cx="100" cy="100" r="90" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M100 10 C118 40, 155 58, 190 100" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M100 10 C82 40, 45 58, 10 100" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M190 100 C155 142, 118 160, 100 190" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M10 100 C45 142, 82 160, 100 190" stroke="white" strokeWidth="2.5" fill="none"/>
            </svg>
          </div>

          <div className="relative z-10 p-10 sm:p-14 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6 text-teal-300">
              <Zap className="w-3.5 h-3.5" />
              Тэмцээн 2025
            </div>

            <h2 className="text-3xl sm:text-4xl font-black mb-4">Оролцоход бэлэн үү?</h2>
            <p className="text-slate-300 mb-10 max-w-lg mx-auto leading-relaxed">
              Волейболд <strong className="text-white">6-12</strong>, Софт волейболд <strong className="text-white">6-12</strong> гишүүнтэй баг бүртгүүлэн тэмцээнд оролцоорой.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
              {[
                { icon: Users, value: '6-12', label: 'Тоглогч' },
                { icon: Medal, value: '4', label: 'Ангилал' },
                { icon: Trophy, value: '🏆', label: 'Шагнал' },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 border border-white/15 rounded-2xl p-4">
                  <p className="text-2xl font-black text-white mb-1">{s.value}</p>
                  <p className="text-slate-400 text-xs">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-10 py-4 rounded-xl transition-colors text-base"
            >
              Одоо бүртгүүлэх
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
