import { db } from "@/lib/db";
import { clips, comments, users, videos } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { VideoPlayer } from "@/components/video/video-player";
import { ClipVoteBar } from "@/components/clip/clip-vote-bar";
import { CommentThread } from "@/components/comment/comment-thread";
import { SourceBadge } from "@/components/source/source-badge";
import { RelativeTime } from "@/components/shared/relative-time";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, ExternalLink, MessageSquare, Info } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ClipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const clip = await db.select().from(clips).where(eq(clips.id, id)).get();
  if (!clip) notFound();

  const video = await db.select().from(videos).where(eq(videos.id, clip.videoId)).get();
  if (!video) notFound();

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
    createdAt: c.createdAt ?? new Date().toISOString(),
    user: { displayName: c.displayName, avatarUrl: c.avatarUrl },
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer
              url={video.url}
              startSeconds={clip.startSeconds}
              endSeconds={clip.endSeconds}
            />

            {/* Clip info */}
            <Card>
              <CardContent className="pt-4">
                {clip.quote && (
                  <div className="flex items-start gap-2 mb-3">
                    <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <blockquote className="text-base font-medium leading-relaxed">
                      &ldquo;{clip.quote}&rdquo;
                    </blockquote>
                  </div>
                )}

                {clip.speaker && (
                  <p className="text-sm text-muted-foreground mb-3">
                    &mdash; {clip.speaker}
                  </p>
                )}

                <div className="flex items-center gap-4 flex-wrap">
                  <ClipVoteBar
                    targetType="clip"
                    targetId={clip.id}
                    initialUpvotes={clip.upvotes}
                    initialDownvotes={clip.downvotes}
                  />
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    {clip.commentCount} comments
                  </span>
                  <RelativeTime date={clip.createdAt ?? new Date().toISOString()} />
                </div>
              </CardContent>
            </Card>

            {/* Context */}
            {(clip.context || clip.importance) && (
              <Card className="bg-muted/30">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="text-sm">
                      {clip.context && (
                        <p className="mb-1"><strong>Context:</strong> {clip.context}</p>
                      )}
                      {clip.importance && (
                        <p className="text-muted-foreground"><strong>Why notable:</strong> {clip.importance}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discussion */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Discussion</h2>
              <CommentThread clipId={clip.id} initialComments={formattedComments} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">From Video</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/video/${video.id}`}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                >
                  {video.title}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <SourceBadge sourceType={video.sourceType} />
                </div>
                {video.sourceUrl && (
                  <a
                    href={video.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Original source
                  </a>
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/20">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  <strong>About this clip:</strong> AI identified this moment as potentially notable.
                  Context and importance ratings are AI-generated and may contain inaccuracies.
                  Always refer to the original video for authoritative information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
