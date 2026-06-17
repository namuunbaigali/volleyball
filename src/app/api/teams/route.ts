import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get('gender');
    const tournamentType = searchParams.get('tournamentType');

    const baseQuery: Record<string, unknown> = { status: { $ne: 'rejected' } };
    if (gender) baseQuery.teamGender = gender;
    if (tournamentType) baseQuery.tournamentType = tournamentType;

    const teams = await Team.find(baseQuery).select(
      'teamName teamGender school members.firstName members.lastName members.graduationYear status tournamentType createdAt'
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

    const { teamName, teamGender, school, contactPhone, contactEmail, members, tournamentType } = body;

    if (!teamName || !teamGender || !school || !contactPhone || !contactEmail || !members) {
      return NextResponse.json({ success: false, error: 'Бүх талбарыг бөглөнө үү' }, { status: 400 });
    }

    const isSoft = tournamentType === 'soft_volleyball';
    const minMembers = isSoft ? 3 : 6;
    const maxMembers = isSoft ? 6 : 12;

    if (members.length < minMembers || members.length > maxMembers) {
      return NextResponse.json(
        {
          success: false,
          error: isSoft
            ? 'Софт волейболд 3-6 гишүүн байх ёстой'
            : 'Багт 6-12 гишүүн байх ёстой',
        },
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
      tournamentType: tournamentType || 'volleyball',
      status: 'pending',
    });

    return NextResponse.json({ success: true, data: team }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
