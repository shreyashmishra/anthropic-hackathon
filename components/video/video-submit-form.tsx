"use client";

import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginButton } from "@/components/auth/login-button";
import { useSessionUser } from "@/components/auth/session-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const schema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().optional(),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function VideoSubmitForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSessionUser();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }

      const video = await res.json();
      toast.success("Video submitted! You can now analyze it with AI.");
      router.push(`/video/${video.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit video");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <Card className="max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Submit a Video
          </CardTitle>
          <CardDescription>
            Log in with a username and any password to submit recorded debate links and create clips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton nextPath={pathname ?? "/submit"} label="Open Login Portal" className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Submit a Video
        </CardTitle>
        <CardDescription>
          Share a recorded debate, interview, or public discussion video for AI analysis and clip creation.
          YouTube debate links and other public video URLs work best.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Video URL *</Label>
            <Input
              id="url"
              placeholder="https://youtube.com/watch?v=..."
              {...register("url")}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g., City Council Meeting - March 2026"
              {...register("title")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the video content..."
              rows={3}
              {...register("description")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {submitting ? "Submitting..." : "Submit Video"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
