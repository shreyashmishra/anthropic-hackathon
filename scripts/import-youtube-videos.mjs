import crypto from "node:crypto";
import fs from "node:fs";
import Database from "better-sqlite3";

if (!process.env.YOUTUBE_API_KEY && fs.existsSync(".env")) {
  const envLines = fs.readFileSync(".env", "utf8").split(/\r?\n/);

  for (const line of envLines) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [rawKey, ...rest] = line.split("=");
    const key = rawKey.trim();
    const value = rest.join("=").trim();

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const urls = process.argv.slice(2);

if (urls.length === 0) {
  console.error("Provide one or more YouTube URLs.");
  process.exit(1);
}

if (!process.env.YOUTUBE_API_KEY) {
  console.error("YOUTUBE_API_KEY is required.");
  process.exit(1);
}

const idPatterns = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

function extractYouTubeId(url) {
  for (const pattern of idPatterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  const parsed = new URL(url);
  return parsed.searchParams.get("v");
}

function parseDuration(duration) {
  const match = duration.match(/^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;

  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

function pickThumbnail(thumbnails) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    null
  );
}

const ids = [...new Set(urls.map(extractYouTubeId).filter(Boolean))];

if (ids.length !== urls.length) {
  console.error("One or more URLs were not valid YouTube video links.");
  process.exit(1);
}

const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
endpoint.searchParams.set("part", "snippet,contentDetails");
endpoint.searchParams.set("id", ids.join(","));
endpoint.searchParams.set("key", process.env.YOUTUBE_API_KEY);

const response = await fetch(endpoint);
if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}

const payload = await response.json();
const items = payload.items || [];

const metadataById = new Map(
  items.map((item) => [
    item.id,
    {
      title: item.snippet?.title || "Untitled YouTube Video",
      description: item.snippet?.description || null,
      thumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
      durationSeconds: item.contentDetails?.duration ? parseDuration(item.contentDetails.duration) : null,
      sourceOrg: item.snippet?.channelTitle || null,
      publishedAt: item.snippet?.publishedAt || null,
      url: `https://www.youtube.com/watch?v=${item.id}`,
    },
  ])
);

const db = new Database("openfloor.db");
const findExisting = db.prepare(
  "select id from videos where url = ? or source_url = ? limit 1"
);
const insertVideo = db.prepare(`
  insert into videos (
    id, title, description, url, thumbnail_url, duration_seconds, source_type,
    source_org, source_url, published_at, processing_status, submitted_by, created_at
  ) values (
    @id, @title, @description, @url, @thumbnailUrl, @durationSeconds, @sourceType,
    @sourceOrg, @sourceUrl, @publishedAt, @processingStatus, @submittedBy, @createdAt
  )
`);
const updateVideo = db.prepare(`
  update videos
  set title = @title,
      description = @description,
      thumbnail_url = @thumbnailUrl,
      duration_seconds = @durationSeconds,
      source_type = @sourceType,
      source_org = @sourceOrg,
      source_url = @sourceUrl,
      published_at = @publishedAt
  where id = @id
`);

let imported = 0;
let updated = 0;

for (const sourceUrl of urls) {
  const id = extractYouTubeId(sourceUrl);
  const metadata = metadataById.get(id);

  if (!metadata) {
    console.warn(`Skipping ${sourceUrl}: metadata not found`);
    continue;
  }

  const existing = findExisting.get(metadata.url, sourceUrl);
  const payload = {
    id: existing?.id || crypto.randomUUID(),
    title: metadata.title,
    description: metadata.description,
    url: metadata.url,
    thumbnailUrl: metadata.thumbnailUrl,
    durationSeconds: metadata.durationSeconds,
    sourceType: "youtube",
    sourceOrg: metadata.sourceOrg,
    sourceUrl,
    publishedAt: metadata.publishedAt,
    processingStatus: "pending",
    submittedBy: null,
    createdAt: new Date().toISOString(),
  };

  if (existing) {
    updateVideo.run(payload);
    updated += 1;
  } else {
    insertVideo.run(payload);
    imported += 1;
  }
}

console.log(`Imported ${imported} video(s), updated ${updated} video(s).`);
