import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { ClipCard } from "@/components/clip/clip-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Bookmark } from "lucide-react";
import { db } from "@/lib/db";
import { bookmarks, clips, videos } from "@/lib/db/schema";
import { getOrCreateCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const user = await getOrCreateCurrentUser();

  if (!user) {
    redirect("/login?next=/bookmarks");
  }

  const results = await db
    .select({
      clipId: clips.id,
      clipTitle: clips.title,
      quote: clips.quote,
      speaker: clips.speaker,
      upvotes: clips.upvotes,
      downvotes: clips.downvotes,
      commentCount: clips.commentCount,
      clipCreatedAt: clips.createdAt,
      videoTitle: videos.title,
      videoThumbnailUrl: videos.thumbnailUrl,
      sourceType: videos.sourceType,
      sourceOrg: videos.sourceOrg,
    })
    .from(bookmarks)
    .innerJoin(clips, eq(bookmarks.clipId, clips.id))
    .innerJoin(videos, eq(clips.videoId, videos.id))
    .where(eq(bookmarks.userId, user.id))
    .orderBy(desc(bookmarks.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Bookmarks</h1>
          <p className="text-sm text-muted-foreground">
            Saved debate moments and clips for your local account.
          </p>
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No bookmarks yet"
            description="Save clips while browsing and they will show up here."
            action={{ label: "Explore Clips", href: "/explore?tab=clips" }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((item) => (
              <ClipCard
                key={item.clipId}
                clip={{
                  id: item.clipId,
                  title: item.clipTitle,
                  quote: item.quote,
                  speaker: item.speaker,
                  upvotes: item.upvotes,
                  downvotes: item.downvotes,
                  commentCount: item.commentCount,
                  createdAt: item.clipCreatedAt ?? new Date().toISOString(),
                }}
                video={{
                  title: item.videoTitle,
                  thumbnailUrl: item.videoThumbnailUrl,
                  sourceType: item.sourceType,
                  sourceOrg: item.sourceOrg,
                }}
              />
            ))}
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
