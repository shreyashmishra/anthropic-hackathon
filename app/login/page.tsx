import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Enter OpenFloor</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Public browsing stays open. Login is only needed for posting, comments, votes, and bookmarks.
          </p>
        </div>
        <LoginForm nextPath={sp.next || "/explore"} />
      </main>
      <AppFooter />
    </div>
  );
}
