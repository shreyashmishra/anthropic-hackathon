import { db } from "@/lib/db";
import { videos } from "@/lib/db/schema";
import { sql } from "drizzle-orm";
import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { Card, CardContent } from "@/components/ui/card";
import { SourceBadge } from "@/components/source/source-badge";
import { SOURCE_TYPES } from "@/lib/constants";
import { Landmark, Youtube, Building2, User, Video } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const iconMap: Record<string, typeof Landmark> = {
  youtube: Youtube,
  congress: Landmark,
  youtube_gov: Youtube,
  city_council: Building2,
  user_submitted: User,
};

export default async function SourcesPage() {
  // Get counts per source type
  const sourceCounts = await db
    .select({
      sourceType: videos.sourceType,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(videos)
    .groupBy(videos.sourceType);

  // Get distinct source orgs
  const sourceOrgs = await db
    .select({
      sourceOrg: videos.sourceOrg,
      sourceType: videos.sourceType,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(videos)
    .groupBy(videos.sourceOrg, videos.sourceType);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Sources</h1>
          <p className="text-muted-foreground text-sm">
            Browse recorded debates and public-interest clips by source channel or organization.
          </p>
        </div>

        {/* Source type overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(SOURCE_TYPES).map(([key, source]) => {
            const Icon = iconMap[key] || Video;
            const count = sourceCounts.find((s) => s.sourceType === key)?.count || 0;

            return (
              <Link key={key} href={`/explore?source=${key}`}>
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-4 flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${source.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{source.label}</p>
                      <p className="text-xs text-muted-foreground">{count} videos</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Individual sources */}
        {sourceOrgs.filter((s) => s.sourceOrg).length > 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Organizations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sourceOrgs
                .filter((s) => s.sourceOrg)
                .map((source) => (
                  <Link
                    key={source.sourceOrg}
                    href={`/explore?search=${encodeURIComponent(source.sourceOrg!)}`}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{source.sourceOrg}</p>
                          <SourceBadge sourceType={source.sourceType} />
                        </div>
                        <span className="text-sm text-muted-foreground">{source.count} videos</span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
