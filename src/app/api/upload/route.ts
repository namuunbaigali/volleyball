import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    const body = await req.json();
     console.log('UPLOAD BODY TYPE:', body.type);
    console.log('IMAGE DATA START:', body.imageData?.slice(0, 50));
    
    const { imageData, type } = body as { imageData: string; type: 'poster' | 'schedule' | 'guideline' };

    if (!imageData || !type || !['poster', 'schedule','guideline'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Буруу өгөгдөл' }, { status: 400 });
    }

    await connectDB();
    let tournament = await Tournament.findOne();
    if (!tournament) {
      tournament = await Tournament.create({});
    }

    const field = type === 'poster' ? 'posters' : type === 'schedule' ? 'schedules' : 'guidelines';
    const entry = { url: imageData, uploadedAt: new Date() };

    // Prepend new image (newest first), max 10
    const current = Array.isArray(tournament[field]) ? tournament[field] as typeof entry[] : [];
    const updated = [entry, ...current].slice(0, 10);

    await Tournament.findByIdAndUpdate(tournament._id, { [field]: updated });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
