import { AppHeader } from "@/components/layout/app-header";
import { AppFooter } from "@/components/layout/app-footer";
import { VideoSubmitForm } from "@/components/video/video-submit-form";

export default function SubmitPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <VideoSubmitForm />
      </main>
      <AppFooter />
    </div>
  );
}
