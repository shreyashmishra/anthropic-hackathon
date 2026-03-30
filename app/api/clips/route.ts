import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clips } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { PAGE_SIZE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const videoId = searchParams.get("videoId");
  const sort = searchParams.get("sort") || "top";

  let query = db.select().from(clips);

  if (videoId) {
    query = query.where(eq(clips.videoId, videoId)) as typeof query;
  }

  const orderBy =
    sort === "new"
      ? desc(clips.createdAt)
      : sort === "controversial"
        ? desc(clips.commentCount)
        : desc(clips.upvotes);

  const results = await query
    .orderBy(orderBy)
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { videoId, title, startSeconds, endSeconds, quote, speaker, context, importance, description } = body;

  if (!videoId || !title || startSeconds === undefined || endSeconds === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const clip = await db
    .insert(clips)
    .values({
      videoId,
      userId: user.id,
      title,
      description: description || null,
      startSeconds,
      endSeconds,
      quote: quote || null,
      speaker: speaker || null,
      context: context || null,
      importance: importance || null,
    })
    .returning()
    .get();

  return NextResponse.json(clip, { status: 201 });
}
