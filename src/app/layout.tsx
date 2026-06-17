import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Volleyball Tournament — Бүртгэл',
  description: 'Волейбол тэмцээний багийн бүртгэл',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${geistSans.variable} ${geistMono.variable}`} style={{ background: '#ffffff' }}>
      <body className="min-h-screen text-slate-800" style={{ background: '#ffffff' }}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
