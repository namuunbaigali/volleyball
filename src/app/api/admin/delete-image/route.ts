import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

export async function DELETE(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    const body = await req.json();
    const { type, index } = body as { type: 'poster' | 'schedule'; index: number };

    if (!type || !['poster', 'schedule'].includes(type) || typeof index !== 'number') {
      return NextResponse.json({ success: false, error: 'Буруу өгөгдөл' }, { status: 400 });
    }

    await connectDB();
    const tournament = await Tournament.findOne();
    if (!tournament) {
      return NextResponse.json({ success: false, error: 'Тэмцээн олдсонгүй' }, { status: 404 });
    }

    const field = type === 'poster' ? 'posters' : 'schedules';
    const arr = [...(tournament[field] as { url: string; uploadedAt: Date }[])];

    if (index < 0 || index >= arr.length) {
      return NextResponse.json({ success: false, error: 'Индекс буруу' }, { status: 400 });
    }

    arr.splice(index, 1);
    await Tournament.findByIdAndUpdate(tournament._id, { [field]: arr });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
