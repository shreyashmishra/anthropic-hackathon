"use client";

import { useState, useCallback } from "react";
import { CommentItem } from "./comment-item";
import { CommentForm } from "./comment-form";
import { useUIPreferences } from "@/hooks/use-ui-preferences";
import type { Comment } from "@/types";

interface CommentThreadProps {
  clipId: string;
  initialComments: Comment[];
}

function buildTree(comments: Comment[]): Comment[] {
  const map = new Map<string, Comment & { replies: Comment[] }>();
  const roots: (Comment & { replies: Comment[] })[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, replies: [] });
  }

  for (const c of comments) {
    const node = map.get(c.id)!;
    if (c.parentId && map.has(c.parentId)) {
      map.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

function CommentNode({
  comment,
  depth,
  collapsedIds,
  toggleCollapsed,
  onReply,
}: {
  comment: Comment & { replies?: Comment[] };
  depth: number;
  collapsedIds: string[];
  toggleCollapsed: (id: string) => void;
  onReply: (comment: unknown) => void;
}) {
  const isCollapsed = collapsedIds.includes(comment.id);
  const maxDepth = 6;

  return (
    <div className={depth > 0 ? "ml-4 pl-0" : ""}>
      <CommentItem
        comment={comment}
        onReply={onReply}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => toggleCollapsed(comment.id)}
      />
      {!isCollapsed && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {depth < maxDepth ? (
            comment.replies.map((reply) => (
              <CommentNode
                key={reply.id}
                comment={reply as Comment & { replies?: Comment[] }}
                depth={depth + 1}
                collapsedIds={collapsedIds}
                toggleCollapsed={toggleCollapsed}
                onReply={onReply}
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground ml-4 py-2">
              {comment.replies.length} more {comment.replies.length === 1 ? "reply" : "replies"}...
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function CommentThread({ clipId, initialComments }: CommentThreadProps) {
  const [comments, setComments] = useState(initialComments);
  const { collapsedIds, toggleCollapsed } = useUIPreferences();

  const handleNewComment = useCallback((comment: unknown) => {
    setComments((prev) => [...prev, comment as Comment]);
  }, []);

  const tree = buildTree(comments);

  return (
    <div className="space-y-4">
      <CommentForm clipId={clipId} onCommentAdded={handleNewComment} />

      <div className="space-y-3">
        {tree.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No comments yet. Be the first to share your thoughts.
          </p>
        ) : (
          tree.map((comment) => (
            <CommentNode
              key={comment.id}
              comment={comment}
              depth={0}
              collapsedIds={collapsedIds}
              toggleCollapsed={toggleCollapsed}
              onReply={handleNewComment}
            />
          ))
        )}
      </div>
    </div>
  );
}
