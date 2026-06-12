import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get('gender');

    const query = gender ? { teamGender: gender, status: 'approved' } : { status: 'approved' };
    const teams = await Team.find(query).select(
      'teamName teamGender school members.firstName members.lastName members.graduationYear status createdAt'
    );

    return NextResponse.json({ success: true, data: teams });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { teamName, teamGender, school, contactPhone, contactEmail, members } = body;

    if (!teamName || !teamGender || !school || !contactPhone || !contactEmail || !members) {
      return NextResponse.json({ success: false, error: 'Бүх талбарыг бөглөнө үү' }, { status: 400 });
    }

    if (members.length < 6 || members.length > 12) {
      return NextResponse.json(
        { success: false, error: 'Багт 6-12 гишүүн байх ёстой' },
        { status: 400 }
      );
    }

    const existing = await Team.findOne({ teamName, teamGender });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Энэ нэртэй баг аль хэдийн бүртгэгдсэн байна' },
        { status: 400 }
      );
    }

    const team = await Team.create({
      teamName,
      teamGender,
      school,
      contactPhone,
      contactEmail,
      members,
      status: 'pending',
    });

    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
