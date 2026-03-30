import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { Card, CardContent } from "@/components/ui/card";
import { TOPICS } from "@/lib/constants";
import Link from "next/link";

export default function TopicsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">Topics</h1>
          <p className="text-muted-foreground text-sm">
            Explore civic content organized by policy area and topic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOPICS.map((topic) => (
            <Link key={topic.id} href={`/explore?topic=${topic.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-4">
                  <div className={`inline-block px-3 py-1.5 rounded-md text-sm font-medium mb-2 ${topic.color}`}>
                    {topic.label}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Browse videos and discussions related to {topic.label.toLowerCase()}.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
