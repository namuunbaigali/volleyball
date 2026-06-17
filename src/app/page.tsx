import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, ArrowRight } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Tournament from '@/models/Tournament';
import Countdown from '@/components/Countdown';
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
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="px-4 pt-20 pb-24 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-blue-600 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Бүртгэл нээлттэй байна
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
            className="inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold px-8 py-3.5 rounded-xl transition-colors border border-slate-200"
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
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
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

        {deadline && (
          <div className="mt-10 max-w-2xl mx-auto">
            <p className="text-slate-400 text-xs font-medium mb-4 uppercase tracking-wider">Бүртгэл дуусах хүртэл</p>
            <Countdown deadline={deadline} />
          </div>
        )}
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

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-2xl p-10 text-center">
          <Trophy className="w-10 h-10 text-white/70 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-3">Оролцоход бэлэн үү?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Волейболд 6-12, Софт волейболд 3-6 гишүүнтэй баг бүртгүүлэн тэмцээнд оролцоорой.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 font-bold px-8 py-3.5 rounded-xl transition-colors"
          >
            Одоо бүртгүүлэх
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
