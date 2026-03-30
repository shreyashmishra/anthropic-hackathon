import { db } from "@/lib/db";
import { videos, clips } from "@/lib/db/schema";
import { desc, eq, like, and } from "drizzle-orm";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { VideoCard } from "@/components/video/video-card";
import { ClipCard } from "@/components/clip/clip-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Video, Scissors } from "lucide-react";
import { PAGE_SIZE, SOURCE_TYPES } from "@/lib/constants";
import type { Clip, Video as VideoRecord } from "@/types";

export const dynamic = "force-dynamic";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;
  const search = sp.search || "";
  const source = sp.source || "";
  const topic = sp.topic || "";
  const page = parseInt(sp.page || "1");
  const tab = sp.tab || "videos";
  const status = sp.status || "";

  // Fetch videos
  const conditions = [];
  if (status) conditions.push(eq(videos.processingStatus, status));
  if (source) conditions.push(eq(videos.sourceType, source));
  if (search) conditions.push(like(videos.title, `%${search}%`));
  if (topic) conditions.push(like(videos.topics, `%"${topic}"%`));

  const allVideos = await db
    .select()
    .from(videos)
    .where(conditions.length === 1 ? conditions[0] : and(...conditions))
    .orderBy(desc(videos.createdAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE);

  const parsedVideos: VideoRecord[] = allVideos.map((v) => ({
    ...v,
    sourceType: v.sourceType as VideoRecord["sourceType"],
    processingStatus: v.processingStatus as VideoRecord["processingStatus"],
    createdAt: v.createdAt ?? new Date().toISOString(),
    keyPoints: v.keyPoints ? JSON.parse(v.keyPoints) : null,
    notableStatements: v.notableStatements ? JSON.parse(v.notableStatements) : null,
    topics: v.topics ? JSON.parse(v.topics) : null,
  }));

  // Fetch clips
  const allClips = await db
    .select({
      id: clips.id,
      videoId: clips.videoId,
      userId: clips.userId,
      title: clips.title,
      description: clips.description,
      startSeconds: clips.startSeconds,
      endSeconds: clips.endSeconds,
      quote: clips.quote,
      speaker: clips.speaker,
      context: clips.context,
      importance: clips.importance,
      upvotes: clips.upvotes,
      downvotes: clips.downvotes,
      commentCount: clips.commentCount,
      createdAt: clips.createdAt,
      videoTitle: videos.title,
      videoThumbnailUrl: videos.thumbnailUrl,
      videoSourceType: videos.sourceType,
      videoSourceOrg: videos.sourceOrg,
    })
    .from(clips)
    .innerJoin(videos, eq(clips.videoId, videos.id))
    .orderBy(desc(clips.upvotes))
    .limit(PAGE_SIZE);

  const formattedClips: Array<
    Clip & {
      videoTitle: string;
      videoThumbnailUrl: string | null;
      videoSourceType: string;
      videoSourceOrg: string | null;
    }
  > = allClips.map((clip) => ({
    ...clip,
    createdAt: clip.createdAt ?? new Date().toISOString(),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Explore</h1>
          <p className="text-muted-foreground text-sm">
            Browse civic and political videos, discover notable moments, and join discussions.
          </p>
          {topic ? (
            <p className="mt-2 text-xs text-primary">
              Topic filter active: <span className="font-medium">{topic}</span>
            </p>
          ) : null}
        </div>

        {/* Filters */}
        <form className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="Search videos..."
              defaultValue={search}
              className="pl-9"
            />
          </div>
          <select
            name="source"
            defaultValue={source}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All sources</option>
            {Object.entries(SOURCE_TYPES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            Filter
          </button>
        </form>

        <Tabs defaultValue={tab}>
          <TabsList>
            <TabsTrigger value="videos" className="gap-1.5">
              <Video className="h-3.5 w-3.5" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="clips" className="gap-1.5">
              <Scissors className="h-3.5 w-3.5" />
              Clips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-4">
            {parsedVideos.length === 0 ? (
              <EmptyState
                icon={Video}
                title="No videos found"
                description="Try adjusting your filters or submit a video to get started."
                action={{ label: "Submit Video", href: "/submit" }}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {parsedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="clips" className="mt-4">
            {formattedClips.length === 0 ? (
              <EmptyState
                icon={Scissors}
                title="No clips yet"
                description="Clips are created when videos are analyzed. Submit a video to get started."
                action={{ label: "Submit Video", href: "/submit" }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formattedClips.map((clip) => (
                  <ClipCard
                    key={clip.id}
                    clip={clip}
                    video={{
                      title: clip.videoTitle,
                      thumbnailUrl: clip.videoThumbnailUrl,
                      sourceType: clip.videoSourceType,
                      sourceOrg: clip.videoSourceOrg,
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <AppFooter />
    </div>
  );
}
