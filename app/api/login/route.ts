import { NextRequest, NextResponse } from "next/server";
import { applySessionCookie, buildSessionUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username?.trim() || !password?.trim()) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const user = buildSessionUser(username);
  const response = NextResponse.json({ success: true, user });
  applySessionCookie(response, user);

  return response;
}
