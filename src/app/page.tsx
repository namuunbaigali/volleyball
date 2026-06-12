import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Zap } from 'lucide-react';
import connectDB from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

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
      posterUrl?: string;
      scheduleUrl?: string;
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
  const deadline = tournament?.registrationDeadline || 'Тодорхойлогдоогүй';
  const prizeInfo = tournament?.prizeInfo || '';
  const posterUrl = tournament?.posterUrl || '';
  const scheduleUrl = tournament?.scheduleUrl || '';

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-violet-300 text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" />
            Бүртгэл нээлттэй байна
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            <span className="text-white">{title.split(' ').slice(0, -1).join(' ')} </span>
            <span className="shimmer-text">{title.split(' ').slice(-1)[0]}</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5"
            >
              Баг бүртгүүлэх
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              Бүртгэгдсэн багууд
            </Link>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Calendar, label: 'Тэмцээний огноо', value: date },
              { icon: MapPin, label: 'Байршил', value: location },
              { icon: Trophy, label: 'Бүртгэлийн дэдлайн', value: deadline },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:border-violet-500/30 transition-colors"
              >
                <item.icon className="w-5 h-5 text-violet-400 mb-3" />
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
                  {item.label}
                </p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {prizeInfo && (
            <div className="mt-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 max-w-3xl mx-auto text-left">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">Шагнал</p>
              <p className="text-white">{prizeInfo}</p>
            </div>
          )}
        </div>
      </section>

      {/* Poster */}
      {posterUrl && (
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Тэмцээний зар</h2>
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-violet-900/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={posterUrl} alt="Тэмцээний постер" className="w-full h-auto" />
            </div>
          </div>
        </section>
      )}

      {/* Schedule poster */}
      {scheduleUrl && (
        <section className="px-4 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Тоглолтын хуваарь</h2>
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-900/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scheduleUrl} alt="Тоглолтын хуваарь" className="w-full h-auto" />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-violet-900/40 to-cyan-900/20 border border-violet-500/20 rounded-3xl p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent" />
            <div className="relative">
              <Trophy className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white mb-3">Оролцоход бэлэн үү?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                6-12 гишүүнтэй баг бүртгүүлэн тэмцээнд оролцоорой. Эрэгтэй болон эмэгтэй ангилал тус бүрт нэгдсэн байдлаар оролцох боломжтой.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-0.5"
              >
                Одоо бүртгүүлэх
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
