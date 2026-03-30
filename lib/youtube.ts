const YOUTUBE_ID_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

export interface YouTubeVideoMetadata {
  id: string;
  title: string;
  description: string;
  channelTitle: string | null;
  publishedAt: string | null;
  durationSeconds: number | null;
  thumbnailUrl: string | null;
  canonicalUrl: string;
}

export function extractYouTubeId(url: string): string | null {
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v");
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function isYouTubeUrl(url: string) {
  return extractYouTubeId(url) !== null;
}

export function buildCanonicalYouTubeUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function parseYouTubeDuration(duration: string): number | null {
  const match = duration.match(
    /^P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/
  );

  if (!match) return null;

  const days = Number(match[1] || 0);
  const hours = Number(match[2] || 0);
  const minutes = Number(match[3] || 0);
  const seconds = Number(match[4] || 0);

  return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

function pickThumbnail(thumbnails?: Record<string, { url: string }>) {
  if (!thumbnails) return null;

  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    null
  );
}

export async function fetchYouTubeVideosMetadata(
  videoIds: string[]
): Promise<YouTubeVideoMetadata[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is required to fetch YouTube metadata");
  }

  const uniqueIds = [...new Set(videoIds)].filter(Boolean);
  if (uniqueIds.length === 0) {
    return [];
  }

  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("part", "snippet,contentDetails");
  endpoint.searchParams.set("id", uniqueIds.join(","));
  endpoint.searchParams.set("key", apiKey);

  const response = await fetch(endpoint, {
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`YouTube Data API request failed: ${message}`);
  }

  const data = (await response.json()) as {
    items?: Array<{
      id: string;
      snippet?: {
        title?: string;
        description?: string;
        channelTitle?: string;
        publishedAt?: string;
        thumbnails?: Record<string, { url: string }>;
      };
      contentDetails?: {
        duration?: string;
      };
    }>;
  };

  return (data.items || []).map((item) => ({
    id: item.id,
    title: item.snippet?.title || "Untitled YouTube Video",
    description: item.snippet?.description || "",
    channelTitle: item.snippet?.channelTitle || null,
    publishedAt: item.snippet?.publishedAt || null,
    durationSeconds: item.contentDetails?.duration
      ? parseYouTubeDuration(item.contentDetails.duration)
      : null,
    thumbnailUrl: pickThumbnail(item.snippet?.thumbnails),
    canonicalUrl: buildCanonicalYouTubeUrl(item.id),
  }));
}

export async function fetchYouTubeMetadataFromUrl(url: string) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return null;
  }

  const [metadata] = await fetchYouTubeVideosMetadata([videoId]);
  return metadata ?? null;
}
