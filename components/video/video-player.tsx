"use client";

import { extractYouTubeId } from "@/lib/youtube";

interface VideoPlayerProps {
  url: string;
  startSeconds?: number;
  endSeconds?: number;
  className?: string;
}

export function VideoPlayer({ url, startSeconds, endSeconds, className }: VideoPlayerProps) {
  const youtubeId = extractYouTubeId(url);

  if (youtubeId) {
    const params = new URLSearchParams({
      autoplay: "0",
      rel: "0",
      modestbranding: "1",
    });
    if (startSeconds !== undefined) params.set("start", String(Math.floor(startSeconds)));
    if (endSeconds !== undefined) params.set("end", String(Math.floor(endSeconds)));

    return (
      <div className={`relative w-full aspect-video rounded-lg overflow-hidden bg-black ${className || ""}`}>
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?${params.toString()}`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
        />
      </div>
    );
  }

  // Fallback to HTML5 video
  return (
    <div className={`relative w-full aspect-video rounded-lg overflow-hidden bg-black ${className || ""}`}>
      <video
        src={url}
        controls
        className="w-full h-full"
        preload="metadata"
      />
    </div>
  );
}

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
