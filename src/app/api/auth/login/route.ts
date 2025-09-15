import { NextRequest, NextResponse } from "next/server";
import { AUTH_PASSWORD, AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password === AUTH_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, "true", { httpOnly: false, path: "/" });
    return res;
  }
  return new NextResponse("Unauthorized", { status: 401 });
}
