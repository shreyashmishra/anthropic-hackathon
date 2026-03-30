import { db } from "@/lib/db";
import { videos, clips } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { VideoPlayer } from "@/components/video/video-player";
import { VideoSummary } from "@/components/video/video-summary";
import { VideoStatements } from "@/components/video/video-statements";
import { ProcessingStatus } from "@/components/video/processing-status";
import { SourceBadge } from "@/components/source/source-badge";
import { ClipCard } from "@/components/clip/clip-card";
import { RelativeTime } from "@/components/shared/relative-time";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const video = await db.select().from(videos).where(eq(videos.id, id)).get();
  if (!video) notFound();

  const videoClips = await db
    .select()
    .from(clips)
    .where(eq(clips.videoId, id))
    .orderBy(desc(clips.upvotes));

  const normalizedVideoClips = videoClips.map((clip) => ({
    ...clip,
    createdAt: clip.createdAt ?? new Date().toISOString(),
  }));

  const keyPoints = video.keyPoints ? JSON.parse(video.keyPoints) : null;
  const notableStatements = video.notableStatements ? JSON.parse(video.notableStatements) : null;
  const topics = video.topics ? JSON.parse(video.topics) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer url={video.url} />

            <div>
              <h1 className="text-xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center gap-3 flex-wrap text-sm text-muted-foreground">
                <SourceBadge sourceType={video.sourceType} />
                {video.sourceOrg && <span>{video.sourceOrg}</span>}
                <RelativeTime date={video.createdAt ?? new Date().toISOString()} />
                {video.sourceUrl && (
                  <a
                    href={video.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Original source
                  </a>
                )}
              </div>
              {video.description && (
                <p className="text-sm text-muted-foreground mt-2">{video.description}</p>
              )}
            </div>

            <ProcessingStatus videoId={video.id} status={video.processingStatus} />

            {video.processingStatus === "completed" && (
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="statements">
                    Notable Statements
                    {notableStatements && ` (${notableStatements.length})`}
                  </TabsTrigger>
                  <TabsTrigger value="clips">
                    Clips ({normalizedVideoClips.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-4">
                  <VideoSummary
                    summary={video.summary}
                    keyPoints={keyPoints}
                    topics={topics}
                  />
                </TabsContent>

                <TabsContent value="statements" className="mt-4">
                  <VideoStatements
                    statements={notableStatements}
                    videoId={video.id}
                    clips={normalizedVideoClips.map((c) => ({ id: c.id, quote: c.quote }))}
                  />
                </TabsContent>

                <TabsContent value="clips" className="mt-4">
                  <div className="space-y-3">
                    {normalizedVideoClips.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No clips yet. Click &ldquo;Discuss&rdquo; on a notable statement to create one.
                      </p>
                    ) : (
                      normalizedVideoClips.map((clip) => (
                        <ClipCard
                          key={clip.id}
                          clip={clip}
                          video={{
                            title: video.title,
                            thumbnailUrl: video.thumbnailUrl,
                            sourceType: video.sourceType,
                            sourceOrg: video.sourceOrg,
                          }}
                        />
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-3">Video Info</h3>
              <dl className="space-y-2 text-sm">
                {video.sourceOrg && (
                  <div>
                    <dt className="text-muted-foreground text-xs">Source</dt>
                  <dd>{video.sourceOrg}</dd>
                  </div>
                )}
                {video.publishedAt && (
                  <div>
                    <dt className="text-muted-foreground text-xs">Published</dt>
                    <dd>{new Date(video.publishedAt).toLocaleDateString()}</dd>
                  </div>
                )}
                {video.durationSeconds && (
                  <div>
                    <dt className="text-muted-foreground text-xs">Duration</dt>
                    <dd>
                      {Math.floor(video.durationSeconds / 60)}m {video.durationSeconds % 60}s
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground text-xs">Clips</dt>
                  <dd>{normalizedVideoClips.length}</dd>
                </div>
              </dl>
            </div>

            {topics && topics.length > 0 && (
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold text-sm mb-3">Topics</h3>
                <div className="flex flex-wrap gap-1.5">
                  {topics.map((t: string) => (
                    <a
                      key={t}
                      href={`/explore?topic=${t}`}
                      className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md hover:bg-primary/10 transition-colors"
                    >
                      {t}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
