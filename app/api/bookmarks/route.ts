import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookmarks, clips, videos } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const results = await db
    .select({
      bookmarkId: bookmarks.id,
      clipId: clips.id,
      clipTitle: clips.title,
      quote: clips.quote,
      speaker: clips.speaker,
      upvotes: clips.upvotes,
      downvotes: clips.downvotes,
      commentCount: clips.commentCount,
      clipCreatedAt: clips.createdAt,
      videoTitle: videos.title,
      videoThumbnailUrl: videos.thumbnailUrl,
      sourceType: videos.sourceType,
      bookmarkedAt: bookmarks.createdAt,
    })
    .from(bookmarks)
    .innerJoin(clips, eq(bookmarks.clipId, clips.id))
    .innerJoin(videos, eq(clips.videoId, videos.id))
    .where(eq(bookmarks.userId, user.id))
    .orderBy(desc(bookmarks.createdAt));

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const { clipId } = await request.json();
  if (!clipId) {
    return NextResponse.json({ error: "clipId is required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  // Check if already bookmarked
  const existing = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, user.id), eq(bookmarks.clipId, clipId)))
    .get();

  if (existing) {
    // Remove bookmark
    await db.delete(bookmarks).where(eq(bookmarks.id, existing.id));
    return NextResponse.json({ action: "removed" });
  }

  // Add bookmark
  await db.insert(bookmarks).values({ userId: user.id, clipId });
  return NextResponse.json({ action: "added" }, { status: 201 });
}
