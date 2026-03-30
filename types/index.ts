export interface User {
  id: string;
  auth0Sub: string;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export type SourceType = "user_submitted" | "youtube" | "congress" | "youtube_gov" | "city_council";
export type ProcessingStatus = "pending" | "processing" | "completed" | "failed";

export interface KeyPoint {
  text: string;
  timestampSeconds: number;
}

export interface NotableStatement {
  quote: string;
  speaker: string;
  timestampSeconds: number;
  context: string;
  importance: string;
  topicTags: string[];
}

export interface Video {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  sourceType: SourceType;
  sourceOrg: string | null;
  sourceUrl: string | null;
  publishedAt: string | null;
  transcript: string | null;
  summary: string | null;
  keyPoints: KeyPoint[] | null;
  notableStatements: NotableStatement[] | null;
  topics: string[] | null;
  processingStatus: ProcessingStatus;
  submittedBy: string | null;
  createdAt: string;
}

export interface Clip {
  id: string;
  videoId: string;
  userId: string | null;
  title: string;
  description: string | null;
  startSeconds: number;
  endSeconds: number;
  quote: string | null;
  speaker: string | null;
  context: string | null;
  importance: string | null;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  clipId: string;
  parentId: string | null;
  userId: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  depth: number;
  createdAt: string;
  // Joined fields
  user?: Pick<User, "displayName" | "avatarUrl">;
  replies?: Comment[];
}

export type VoteType = "up" | "down";
export type TargetType = "clip" | "comment";

export interface Vote {
  id: string;
  userId: string;
  targetType: TargetType;
  targetId: string;
  voteType: VoteType;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  clipId: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string | null;
  targetType: TargetType;
  targetId: string;
  reason: string;
  details: string | null;
  status: "pending" | "reviewed" | "actioned";
  createdAt: string;
}

// Clip with joined video info for card display
export interface ClipWithVideo extends Clip {
  video?: Pick<Video, "title" | "thumbnailUrl" | "sourceType" | "sourceOrg" | "url">;
  user?: Pick<User, "displayName" | "avatarUrl">;
}
