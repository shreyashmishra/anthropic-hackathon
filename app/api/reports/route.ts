import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { reports } from "@/lib/db/schema";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { targetType, targetId, reason, details } = body;

  if (!targetType || !targetId || !reason) {
    return NextResponse.json({ error: "targetType, targetId, and reason are required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  await db.insert(reports).values({
    reporterId: user.id,
    targetType,
    targetId,
    reason,
    details: details || null,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
