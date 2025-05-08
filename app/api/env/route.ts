import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authSecret: process.env.AUTH_SECRET || '未设置',
    // Do NOT expose AUTH_SECRET or NEXTAUTH_SECRET
  });
}
