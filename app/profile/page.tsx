import { redirect } from "next/navigation";
import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/profile");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Display name</p>
              <p className="font-medium">{session.user.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Username</p>
              <p className="font-mono">{session.user.username}</p>
            </div>
            <p className="text-muted-foreground">
              This local login is intentionally lightweight for the hackathon build.
            </p>
          </CardContent>
        </Card>
      </main>
      <AppFooter />
    </div>
  );
}
