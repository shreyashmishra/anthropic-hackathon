"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProcessingStatusProps {
  videoId: string;
  status: string;
}

export function ProcessingStatus({ videoId, status }: ProcessingStatusProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function triggerProcessing() {
    setLoading(true);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Processing failed");
      }

      setCurrentStatus("completed");
      toast.success("Video processed successfully!");
      router.refresh();
    } catch (err) {
      setCurrentStatus("failed");
      toast.error(err instanceof Error ? err.message : "Processing failed");
    } finally {
      setLoading(false);
    }
  }

  if (currentStatus === "completed") return null;

  return (
    <Card className="border-dashed">
      <CardContent className="flex items-center justify-center gap-3 py-6">
        {currentStatus === "pending" && (
          <>
            <Clock className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-muted-foreground">This video hasn&apos;t been analyzed yet.</span>
            <Button size="sm" onClick={triggerProcessing} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {loading ? "Processing..." : "Analyze with AI"}
            </Button>
          </>
        )}
        {currentStatus === "processing" && (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
            <span className="text-sm text-muted-foreground">AI is analyzing this video...</span>
          </>
        )}
        {currentStatus === "failed" && (
          <>
            <XCircle className="h-5 w-5 text-destructive" />
            <span className="text-sm text-muted-foreground">Processing failed.</span>
            <Button size="sm" variant="outline" onClick={triggerProcessing} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Retry
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
