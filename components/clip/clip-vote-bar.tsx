"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { useSessionUser } from "@/components/auth/session-provider";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ClipVoteBarProps {
  targetType: "clip" | "comment";
  targetId: string;
  initialUpvotes: number;
  initialDownvotes: number;
  initialUserVote?: "up" | "down" | null;
  compact?: boolean;
}

export function ClipVoteBar({
  targetType,
  targetId,
  initialUpvotes,
  initialDownvotes,
  initialUserVote = null,
  compact = false,
}: ClipVoteBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useSessionUser();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);

  async function vote(voteType: "up" | "down") {
    if (!user) {
      toast.error("Log in to vote");
      router.push(`/login?next=${encodeURIComponent(pathname ?? "/explore")}`);
      return;
    }

    // Optimistic update
    const prevUp = upvotes;
    const prevDown = downvotes;
    const prevVote = userVote;

    if (userVote === voteType) {
      // Toggle off
      setUserVote(null);
      if (voteType === "up") setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    } else if (userVote) {
      // Switch
      setUserVote(voteType);
      if (voteType === "up") {
        setUpvotes((v) => v + 1);
        setDownvotes((v) => v - 1);
      } else {
        setUpvotes((v) => v - 1);
        setDownvotes((v) => v + 1);
      }
    } else {
      // New vote
      setUserVote(voteType);
      if (voteType === "up") setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
    }

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId, voteType }),
      });

      if (!res.ok) throw new Error();
    } catch {
      // Revert
      setUpvotes(prevUp);
      setDownvotes(prevDown);
      setUserVote(prevVote);
      toast.error("Failed to vote");
    }
  }

  const net = upvotes - downvotes;
  const size = compact ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", userVote === "up" && "text-primary bg-primary/10")}
        onClick={() => vote("up")}
      >
        <ArrowBigUp className={size} />
      </Button>
      <span className={cn("font-semibold min-w-[2ch] text-center", compact ? "text-xs" : "text-sm")}>
        {net}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-8 w-8", userVote === "down" && "text-destructive bg-destructive/10")}
        onClick={() => vote("down")}
      >
        <ArrowBigDown className={size} />
      </Button>
    </div>
  );
}
