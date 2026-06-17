import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, ArrowRight, Zap } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-800/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-700/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/5 rounded-full blur-3xl" />
          {/* Geometric border accents */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-700/20 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-red-800/20 border border-red-700/30 rounded-full px-4 py-1.5 text-red-300 text-sm font-medium mb-8">
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
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-red-700/30 hover:shadow-red-600/50 hover:-translate-y-0.5"
            >
              Баг бүртгүүлэх
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-500/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
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
              { icon: Trophy, label: 'Бүртгэлийн дэдлайн', value: deadline || 'Тодорхойлогдоогүй' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:border-amber-500/30 transition-colors"
              >
                <item.icon className="w-5 h-5 text-amber-400 mb-3" />
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

          {/* Countdown */}
          {deadline && (
            <div className="mt-8 max-w-3xl mx-auto">
              <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider">Бүртгэл дуусах хүртэл</p>
              <Countdown deadline={deadline} />
            </div>
          )}
        </div>
      </section>

      {/* Poster slider */}
      {posterUrls.length > 0 && (
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Тэмцээний зар</h2>
            <ImageSlider images={posterUrls} />
          </div>
        </section>
      )}

      {/* Schedule slider */}
      {scheduleUrls.length > 0 && (
        <section className="px-4 pb-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-white text-2xl font-bold mb-6 text-center">Тоглолтын хуваарь</h2>
            <ImageSlider images={scheduleUrls} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-red-900/40 to-amber-900/20 border border-red-700/20 rounded-3xl p-10 text-center overflow-hidden">
            {/* Geometric top border accent */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-red-800/5 to-transparent" />
            <div className="relative">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white mb-3">Оролцоход бэлэн үү?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Волейболд 6-12, Софт волейболд 3-6 гишүүнтэй баг бүртгүүлэн тэмцээнд оролцоорой. Эрэгтэй болон эмэгтэй ангилал тус бүрт нэгдсэн байдлаар оролцох боломжтой.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-700 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-red-700/30 hover:shadow-red-600/50 hover:-translate-y-0.5"
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
