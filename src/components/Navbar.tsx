'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Trophy } from 'lucide-react';

const links = [
  { href: '/', label: 'Нүүр' },
  { href: '/teams', label: 'Багууд' },
  { href: '/schedule', label: 'Хуваарь' },
  { href: '/register', label: 'Бүртгүүлэх' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all group-hover:scale-110">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-800 font-black text-lg tracking-tight">
              Volley<span className="text-blue-600">Ball</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  pathname === l.href
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-blue-50'
                }`}
              >
                {l.href === '/register' ? (
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    {l.label}
                  </span>
                ) : l.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden text-slate-600 hover:text-slate-800 p-2 rounded-xl hover:bg-blue-50 transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 py-3 space-y-1 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname === l.href
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-blue-50'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
