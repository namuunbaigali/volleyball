import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Tournament from '@/models/Tournament';

export async function GET() {
  try {
    await connectDB();
    let tournament = await Tournament.findOne();
    if (!tournament) {
      tournament = await Tournament.create({});
    }
    return NextResponse.json({ success: true, data: tournament });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const adminKey = req.headers.get('x-admin-key');

    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    const body = await req.json();
    // Only allow updating non-array fields via PUT; images managed via /api/upload
    const allowedFields = ['title', 'description', 'date', 'location', 'locationMapLink', 'guidelineInfo', 'registrationDeadline', 'prizeInfo'];
    const update: Record<string, string> = {};
    for (const key of allowedFields) {
      if (key in body) update[key] = body[key];
    }

    let tournament = await Tournament.findOne();
    if (!tournament) {
      tournament = await Tournament.create(update);
    } else {
      tournament = await Tournament.findByIdAndUpdate(tournament._id, update, { new: true });
    }

    return NextResponse.json({ success: true, data: tournament });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
