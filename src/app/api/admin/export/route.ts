import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Team from '@/models/Team';
import * as XLSX from 'xlsx';

interface IMemberRow {
  'Багийн нэр': string;
  'Ангилал': string;
  'Сургууль': string;
  'Холбоо барих утас': string;
  'Гишүүний нэр': string;
  'Овог': string;
  'Нас': number;
  'Хүйс': string;
  'Төгссөн он': number;
  'Багшийн нэр': string;
  'Утас': string;
}

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key');
    if (adminKey !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ success: false, error: 'Зөвшөөрөлгүй' }, { status: 401 });
    }

    await connectDB();
    const teams = await Team.find({ status: { $ne: 'rejected' } }).lean();

    const toRows = (filteredTeams: typeof teams): IMemberRow[] => {
      const rows: IMemberRow[] = [];
      for (const team of filteredTeams) {
        for (const member of team.members) {
          rows.push({
            'Багийн нэр': team.teamName,
            'Ангилал': team.teamGender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй',
            'Сургууль': team.school,
            'Холбоо барих утас': team.contactPhone,
            'Гишүүний нэр': member.firstName,
            'Овог': member.lastName,
            'Нас': member.age,
            'Хүйс': member.gender === 'male' ? 'Эрэгтэй' : 'Эмэгтэй',
            'Төгссөн он': member.graduationYear,
            'Багшийн нэр': member.teacherName,
            'Утас': member.phone,
          });
        }
      }
      return rows;
    };

    const wb = XLSX.utils.book_new();

    const sheetDefs = [
      { name: 'Бүх багууд', filter: () => teams },
      {
        name: 'Волейбол эрэгтэй',
        filter: () => teams.filter((t) => t.tournamentType !== 'soft_volleyball' && t.teamGender === 'male'),
      },
      {
        name: 'Волейбол эмэгтэй',
        filter: () => teams.filter((t) => t.tournamentType !== 'soft_volleyball' && t.teamGender === 'female'),
      },
      {
        name: 'Софт эрэгтэй',
        filter: () => teams.filter((t) => t.tournamentType === 'soft_volleyball' && t.teamGender === 'male'),
      },
      {
        name: 'Софт эмэгтэй',
        filter: () => teams.filter((t) => t.tournamentType === 'soft_volleyball' && t.teamGender === 'female'),
      },
    ];

    for (const { name, filter } of sheetDefs) {
      const rows = toRows(filter());
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, name);
    }

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="teams-export.xlsx"',
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
