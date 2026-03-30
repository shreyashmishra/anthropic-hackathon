import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SourceBadge } from "@/components/source/source-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Quote } from "lucide-react";

interface ClipCardProps {
  clip: {
    id: string;
    title: string;
    quote?: string | null;
    speaker?: string | null;
    upvotes: number;
    downvotes: number;
    commentCount: number;
    createdAt: string;
  };
  video?: {
    title?: string;
    thumbnailUrl?: string | null;
    sourceType?: string;
    sourceOrg?: string | null;
  };
}

export function ClipCard({ clip, video }: ClipCardProps) {
  const netVotes = clip.upvotes - clip.downvotes;

  return (
    <Link href={`/clip/${clip.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            {/* Vote count */}
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <ArrowBigUp className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold">{netVotes}</span>
              <ArrowBigDown className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex-1 min-w-0">
              {clip.quote && (
                <div className="flex items-start gap-1.5 mb-2">
                  <Quote className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm line-clamp-2">&ldquo;{clip.quote}&rdquo;</p>
                </div>
              )}

              {clip.speaker && (
                <p className="text-xs text-muted-foreground mb-2">
                  &mdash; {clip.speaker}
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap mb-2">
                {video?.sourceType && <SourceBadge sourceType={video.sourceType} />}
                {video?.title && (
                  <span className="text-xs text-muted-foreground line-clamp-1">
                    {video.title}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {clip.commentCount} comments
                </span>
                <RelativeTime date={clip.createdAt} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
