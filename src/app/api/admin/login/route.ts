import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_SECRET) {
    return NextResponse.json({ success: true, token: process.env.ADMIN_SECRET });
  }

  return NextResponse.json({ success: false, error: 'Нууц үг буруу байна' }, { status: 401 });
}
