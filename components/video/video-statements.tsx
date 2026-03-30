"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSessionUser } from "@/components/auth/session-provider";
import { TopicTag } from "@/components/shared/topic-tag";
import { formatTimestamp } from "./video-player";
import { Clock, MessageSquare, Quote } from "lucide-react";
import type { NotableStatement } from "@/types";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

interface VideoStatementsProps {
  statements: NotableStatement[] | null;
  videoId: string;
  clips?: Array<{ id: string; quote: string | null }>;
}

export function VideoStatements({ statements, videoId, clips = [] }: VideoStatementsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSessionUser();

  if (!statements || statements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notable statements identified yet.
      </div>
    );
  }

  async function handleDiscuss(stmt: NotableStatement) {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname ?? `/video/${videoId}`)}`);
      return;
    }

    // Check if a clip already exists for this quote
    const existing = clips.find((c) => c.quote === stmt.quote);
    if (existing) {
      router.push(`/clip/${existing.id}`);
      return;
    }

    // Create a new clip
    try {
      const res = await fetch("/api/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          title: stmt.quote.length > 80 ? stmt.quote.slice(0, 77) + "..." : stmt.quote,
          startSeconds: Math.max(0, stmt.timestampSeconds - 15),
          endSeconds: stmt.timestampSeconds + 15,
          quote: stmt.quote,
          speaker: stmt.speaker,
          context: stmt.context,
          importance: stmt.importance,
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          toast.error("Sign in to start a discussion");
          return;
        }
        throw new Error("Failed to create clip");
      }

      const clip = await res.json();
      router.push(`/clip/${clip.id}`);
    } catch {
      toast.error("Failed to create discussion");
    }
  }

  return (
    <div className="space-y-3">
      {statements.map((stmt, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <blockquote className="text-sm font-medium leading-relaxed mb-2">
                  &ldquo;{stmt.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-sm text-muted-foreground font-medium">{stmt.speaker}</span>
                  <Badge variant="outline" className="h-5 gap-1 font-mono text-xs">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(stmt.timestampSeconds)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{stmt.context}</p>
                <p className="text-xs text-muted-foreground italic mb-3">
                  Why notable: {stmt.importance}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {stmt.topicTags?.map((tag) => (
                      <TopicTag key={tag} topicId={tag} />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDiscuss(stmt)}
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" />
                    Discuss
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
