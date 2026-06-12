import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const team = await Team.findById(id);
    if (!team) {
      return NextResponse.json({ success: false, error: 'Баг олдсонгүй' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: team });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const adminKey = req.headers.get('x-admin-key');

    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    const team = await Team.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: team });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const adminKey = req.headers.get('x-admin-key');

    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    await Team.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
