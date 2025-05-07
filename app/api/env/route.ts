import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    authUrl: process.env.AUTH_URL || "未设置",
    // Do NOT expose AUTH_SECRET or NEXTAUTH_SECRET
  });
}
