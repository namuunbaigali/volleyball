import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    await connectDB();
    const teams = await Team.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: teams });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
