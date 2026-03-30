import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comments, clips } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clipId, content, parentId } = body;

  if (!clipId || !content?.trim()) {
    return NextResponse.json({ error: "clipId and content are required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  // Calculate depth
  let depth = 0;
  if (parentId) {
    const parent = await db.select().from(comments).where(eq(comments.id, parentId)).get();
    if (parent) {
      depth = parent.depth + 1;
    }
  }

  const comment = await db
    .insert(comments)
    .values({
      clipId,
      parentId: parentId || null,
      userId: user.id,
      content: content.trim(),
      depth,
    })
    .returning()
    .get();

  // Increment comment count on clip
  await db
    .update(clips)
    .set({ commentCount: sql`${clips.commentCount} + 1` })
    .where(eq(clips.id, clipId));

  return NextResponse.json({
    ...comment,
    user: { displayName: user.displayName, avatarUrl: user.avatarUrl },
  }, { status: 201 });
}
