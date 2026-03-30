import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  auth0Sub: text("auth0_sub").notNull().unique(),
  email: text("email"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const videos = sqliteTable("videos", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  durationSeconds: integer("duration_seconds"),
  sourceType: text("source_type").notNull().default("user_submitted"), // user_submitted, congress, youtube_gov, city_council
  sourceOrg: text("source_org"),
  sourceUrl: text("source_url"),
  publishedAt: text("published_at"),
  transcript: text("transcript"),
  summary: text("summary"),
  keyPoints: text("key_points"), // JSON string
  notableStatements: text("notable_statements"), // JSON string
  topics: text("topics"), // JSON string
  processingStatus: text("processing_status").notNull().default("pending"), // pending, processing, completed, failed
  submittedBy: text("submitted_by").references(() => users.id),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const clips = sqliteTable("clips", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  videoId: text("video_id").notNull().references(() => videos.id),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  startSeconds: integer("start_seconds").notNull(),
  endSeconds: integer("end_seconds").notNull(),
  quote: text("quote"),
  speaker: text("speaker"),
  context: text("context"),
  importance: text("importance"),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  commentCount: integer("comment_count").notNull().default(0),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  clipId: text("clip_id").notNull().references(() => clips.id),
  parentId: text("parent_id"),
  userId: text("user_id").references(() => users.id),
  content: text("content").notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  depth: integer("depth").notNull().default(0),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export const votes = sqliteTable("votes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  targetType: text("target_type").notNull(), // clip or comment
  targetId: text("target_id").notNull(),
  voteType: text("vote_type").notNull(), // up or down
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
}, (table) => [
  uniqueIndex("votes_user_target_idx").on(table.userId, table.targetType, table.targetId),
]);

export const bookmarks = sqliteTable("bookmarks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id),
  clipId: text("clip_id").notNull().references(() => clips.id),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
}, (table) => [
  uniqueIndex("bookmarks_user_clip_idx").on(table.userId, table.clipId),
]);

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  reporterId: text("reporter_id").references(() => users.id),
  targetType: text("target_type").notNull(), // clip or comment
  targetId: text("target_id").notNull(),
  reason: text("reason").notNull(),
  details: text("details"),
  status: text("status").notNull().default("pending"), // pending, reviewed, actioned
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});
