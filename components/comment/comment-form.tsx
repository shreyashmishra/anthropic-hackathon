"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoginButton } from "@/components/auth/login-button";
import { useSessionUser } from "@/components/auth/session-provider";
import { useDraftComment } from "@/hooks/use-draft-comment";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface CommentFormProps {
  clipId: string;
  parentId?: string;
  onCommentAdded?: (comment: unknown) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function CommentForm({
  clipId,
  parentId,
  onCommentAdded,
  onCancel,
  placeholder = "Share your thoughts...",
  autoFocus = false,
}: CommentFormProps) {
  const pathname = usePathname();
  const { user } = useSessionUser();
  const { draft, setDraft, clearDraft } = useDraftComment(parentId ? `${clipId}:${parentId}` : clipId);
  const [content, setContent] = useState(draft);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        <p className="mb-3">
          Log in with a username and any password to join the discussion.
        </p>
        <LoginButton nextPath={pathname ?? `/clip/${clipId}`} label="Open Login Portal" />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clipId, parentId, content: content.trim() }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please log in first");
        }
        throw new Error("Failed to post comment");
      }

      const comment = await res.json();
      clearDraft();
      setContent("");
      onCommentAdded?.(comment);
      toast.success("Comment posted");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setDraft(e.target.value);
        }}
        placeholder={placeholder}
        rows={3}
        autoFocus={autoFocus}
        className="resize-none"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {draft && content ? "Draft saved" : ""}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-3.5 w-3.5 mr-1" />}
            {submitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}
