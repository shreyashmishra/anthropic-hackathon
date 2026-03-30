"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ClipVoteBar } from "@/components/clip/clip-vote-bar";
import { CommentForm } from "./comment-form";
import { RelativeTime } from "@/components/shared/relative-time";
import { MessageSquare, Flag, ChevronDown, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { Comment } from "@/types";

interface CommentItemProps {
  comment: Comment;
  onReply?: (comment: unknown) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function CommentItem({ comment, onReply, isCollapsed, onToggleCollapse }: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);

  const initials = (comment.user?.displayName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleReport() {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetType: "comment",
          targetId: comment.id,
          reason: "inappropriate",
        }),
      });
      if (res.ok) toast.success("Report submitted");
      else toast.error("Sign in to report");
    } catch {
      toast.error("Failed to submit report");
    }
  }

  return (
    <div className="group">
      <div className="flex gap-2">
        <div className="flex flex-col items-center">
          <Avatar className="h-7 w-7">
            <AvatarImage src={comment.user?.avatarUrl || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="w-0.5 flex-1 bg-border hover:bg-primary/50 transition-colors mt-1 rounded-full cursor-pointer"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium">
              {comment.user?.displayName || "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              <RelativeTime date={comment.createdAt} />
            </span>
            {isCollapsed && (
              <button onClick={onToggleCollapse} className="text-xs text-muted-foreground hover:text-foreground">
                <ChevronRight className="h-3 w-3 inline" /> collapsed
              </button>
            )}
          </div>

          {!isCollapsed && (
            <>
              <p className="text-sm mb-2 whitespace-pre-wrap">{comment.content}</p>

              <div className="flex items-center gap-1 -ml-2">
                <ClipVoteBar
                  targetType="comment"
                  targetId={comment.id}
                  initialUpvotes={comment.upvotes}
                  initialDownvotes={comment.downvotes}
                  compact
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 text-muted-foreground"
                  onClick={() => setShowReply(!showReply)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground opacity-0 group-hover:opacity-100">
                      ...
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleReport}>
                      <Flag className="h-3 w-3 mr-2" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {showReply && (
                <div className="mt-2">
                  <CommentForm
                    clipId={comment.clipId}
                    parentId={comment.id}
                    onCommentAdded={(c) => {
                      onReply?.(c);
                      setShowReply(false);
                    }}
                    onCancel={() => setShowReply(false)}
                    placeholder="Write a reply..."
                    autoFocus
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
