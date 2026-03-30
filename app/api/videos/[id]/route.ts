import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videos, clips } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const video = await db.select().from(videos).where(eq(videos.id, id)).get();
  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  const videoClips = await db
    .select()
    .from(clips)
    .where(eq(clips.videoId, id))
    .orderBy(desc(clips.upvotes));

  return NextResponse.json({
    ...video,
    keyPoints: video.keyPoints ? JSON.parse(video.keyPoints) : null,
    notableStatements: video.notableStatements ? JSON.parse(video.notableStatements) : null,
    topics: video.topics ? JSON.parse(video.topics) : null,
    clips: videoClips,
  });
}
