import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SourceBadge } from "@/components/source/source-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { Clock, MessageSquare, Scissors } from "lucide-react";
import type { Video } from "@/types";
import { PROCESSING_STATUSES } from "@/lib/constants";

interface VideoCardProps {
  video: Video;
  clipCount?: number;
}

export function VideoCard({ video, clipCount }: VideoCardProps) {
  const status = PROCESSING_STATUSES[video.processingStatus as keyof typeof PROCESSING_STATUSES];

  return (
    <Link href={`/video/${video.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full">
        {video.thumbnailUrl && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="object-cover w-full h-full"
            />
            {video.durationSeconds && (
              <Badge variant="secondary" className="absolute bottom-2 right-2 text-xs font-mono bg-black/70 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(video.durationSeconds / 60)}:{(video.durationSeconds % 60).toString().padStart(2, "0")}
              </Badge>
            )}
          </div>
        )}
        <CardContent className="pt-3">
          <h3 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h3>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <SourceBadge sourceType={video.sourceType} />
            {status && (
              <span className={`text-xs ${status.color}`}>{status.label}</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <RelativeTime date={video.createdAt} />
            {clipCount !== undefined && (
              <span className="flex items-center gap-1">
                <Scissors className="h-3 w-3" />
                {clipCount} clips
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
