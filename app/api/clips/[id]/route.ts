import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clips, comments, users, videos } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const clip = await db.select().from(clips).where(eq(clips.id, id)).get();
  if (!clip) {
    return NextResponse.json({ error: "Clip not found" }, { status: 404 });
  }

  const video = await db.select().from(videos).where(eq(videos.id, clip.videoId)).get();

  const clipComments = await db
    .select({
      id: comments.id,
      clipId: comments.clipId,
      parentId: comments.parentId,
      userId: comments.userId,
      content: comments.content,
      upvotes: comments.upvotes,
      downvotes: comments.downvotes,
      depth: comments.depth,
      createdAt: comments.createdAt,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.clipId, id))
    .orderBy(asc(comments.createdAt));

  const formattedComments = clipComments.map((c) => ({
    id: c.id,
    clipId: c.clipId,
    parentId: c.parentId,
    userId: c.userId,
    content: c.content,
    upvotes: c.upvotes,
    downvotes: c.downvotes,
    depth: c.depth,
    createdAt: c.createdAt,
    user: {
      displayName: c.displayName,
      avatarUrl: c.avatarUrl,
    },
  }));

  return NextResponse.json({
    clip,
    video: video
      ? {
          id: video.id,
          title: video.title,
          url: video.url,
          thumbnailUrl: video.thumbnailUrl,
          sourceType: video.sourceType,
          sourceOrg: video.sourceOrg,
        }
      : null,
    comments: formattedComments,
  });
}
