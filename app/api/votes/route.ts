import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { votes, clips, comments } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { targetType, targetId, voteType } = body;

  if (!targetType || !targetId || !voteType) {
    return NextResponse.json({ error: "targetType, targetId, and voteType are required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  // Check for existing vote
  const existing = await db
    .select()
    .from(votes)
    .where(
      and(
        eq(votes.userId, user.id),
        eq(votes.targetType, targetType),
        eq(votes.targetId, targetId)
      )
    )
    .get();

  const table = targetType === "clip" ? clips : comments;

  if (existing) {
    if (existing.voteType === voteType) {
      // Remove vote (toggle off)
      await db.delete(votes).where(eq(votes.id, existing.id));
      if (voteType === "up") {
        await db.update(table).set({ upvotes: sql`${table.upvotes} - 1` }).where(eq(table.id, targetId));
      } else {
        await db.update(table).set({ downvotes: sql`${table.downvotes} - 1` }).where(eq(table.id, targetId));
      }
      return NextResponse.json({ action: "removed", voteType: null });
    } else {
      // Switch vote
      await db.update(votes).set({ voteType }).where(eq(votes.id, existing.id));
      if (voteType === "up") {
        await db.update(table).set({
          upvotes: sql`${table.upvotes} + 1`,
          downvotes: sql`${table.downvotes} - 1`,
        }).where(eq(table.id, targetId));
      } else {
        await db.update(table).set({
          upvotes: sql`${table.upvotes} - 1`,
          downvotes: sql`${table.downvotes} + 1`,
        }).where(eq(table.id, targetId));
      }
      return NextResponse.json({ action: "switched", voteType });
    }
  }

  // New vote
  await db.insert(votes).values({
    userId: user.id,
    targetType,
    targetId,
    voteType,
  });

  if (voteType === "up") {
    await db.update(table).set({ upvotes: sql`${table.upvotes} + 1` }).where(eq(table.id, targetId));
  } else {
    await db.update(table).set({ downvotes: sql`${table.downvotes} + 1` }).where(eq(table.id, targetId));
  }

  return NextResponse.json({ action: "created", voteType });
}
