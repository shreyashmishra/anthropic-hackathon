import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { desc, eq, like, and, or } from "drizzle-orm";
import { getOrCreateCurrentUser } from "@/lib/auth";
import { PAGE_SIZE } from "@/lib/constants";
import { fetchYouTubeMetadataFromUrl } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const source = searchParams.get("source");
  const topic = searchParams.get("topic");
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const conditions = [];

  if (status) conditions.push(eq(videos.processingStatus, status));
  if (source) conditions.push(eq(videos.sourceType, source));
  if (search) conditions.push(like(videos.title, `%${search}%`));
  if (topic) conditions.push(like(videos.topics, `%"${topic}"%`));

  const results = await db
    .select()
    .from(videos)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(videos.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  // Parse JSON fields
  const parsed = results.map((v) => ({
    ...v,
    keyPoints: v.keyPoints ? JSON.parse(v.keyPoints) : null,
    notableStatements: v.notableStatements ? JSON.parse(v.notableStatements) : null,
    topics: v.topics ? JSON.parse(v.topics) : null,
  }));

  return NextResponse.json(parsed);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url, title, description } = body;

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const user = await getOrCreateCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  let titleValue = title || "Untitled Video";
  let descriptionValue = description || null;
  let thumbnailUrl = null;
  let durationSeconds = null;
  let sourceType = "user_submitted";
  let sourceOrg = null;
  let sourceUrl = null;
  let canonicalUrl = url;
  let publishedAt = null;

  try {
    const youtubeMetadata = await fetchYouTubeMetadataFromUrl(url);

    if (youtubeMetadata) {
      canonicalUrl = youtubeMetadata.canonicalUrl;
      titleValue = title || youtubeMetadata.title;
      descriptionValue = description || youtubeMetadata.description || null;
      thumbnailUrl = youtubeMetadata.thumbnailUrl;
      durationSeconds = youtubeMetadata.durationSeconds;
      sourceType = "youtube";
      sourceOrg = youtubeMetadata.channelTitle;
      sourceUrl = url;
      publishedAt = youtubeMetadata.publishedAt;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "YouTube metadata lookup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const existingVideo = await db
    .select()
    .from(videos)
    .where(
      or(
        eq(videos.url, canonicalUrl),
        sourceUrl ? eq(videos.sourceUrl, sourceUrl) : eq(videos.url, "__no_match__")
      )
    )
    .get();

  if (existingVideo) {
    return NextResponse.json(existingVideo, { status: 200 });
  }

  const video = await db
    .insert(videos)
    .values({
      url: canonicalUrl,
      title: titleValue,
      description: descriptionValue,
      thumbnailUrl,
      durationSeconds,
      sourceType,
      sourceOrg,
      sourceUrl,
      publishedAt,
      submittedBy: user.id,
    })
    .returning()
    .get();

  return NextResponse.json(video, { status: 201 });
}
