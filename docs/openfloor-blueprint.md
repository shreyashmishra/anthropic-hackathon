# OpenFloor Blueprint

## 1. Product Concept and Elevator Pitch

**Recommended name:** OpenFloor

**Elevator pitch:** OpenFloor helps people participate in democracy more effectively by turning long civic and political videos into understandable, timestamped summaries and clip-based discussions. It brings together official public-interest video, nonpartisan AI analysis, and structured conversation so people can understand what was said, why it matters, and how to discuss it with context instead of outrage.

## 2. Alternate Product Names

- OpenFloor
- CivicLens
- PublicRecord
- CommonThread
- Floorlight

## 3. Problem and Solution Framing

**Problem**

- Civic and political video is long, fragmented, and hard to follow.
- Important public statements are often missed because most people cannot watch full hearings or debates.
- Discussions happen without enough context and are easily manipulated by short, decontextualized clips.
- Government footage may be public, but it is not truly accessible to normal people.

**Solution**

- Ingest public-interest civic video from official sources and user-submitted links.
- Use Gemini to generate summaries, chapters, notable statements, and topic labels.
- Turn notable moments into clip-based discussion threads with context and provenance.
- Let anyone browse, while allowing low-friction participation through a lightweight local login portal in the hackathon MVP.

## 4. Why It Fits Governance & Collaboration

- Helps people participate in democracy by making civic information understandable.
- Supports collaboration across disagreement by grounding discussion in shared source material.
- Improves collective decision-making by reducing confusion and surfacing key moments from long public meetings.
- Encourages informed discussion instead of engagement-driven outrage.
- Treats public records as civic infrastructure, not entertainment content.

## 5. MVP vs. Future Features

### MVP

- Public home page and public browsing while logged out
- Video submission by URL
- Official-source ingestion for 2-3 source types
- Gemini transcript processing and structured summary generation
- Notable statement extraction with timestamps and context
- Auto-generated clips from notable statements
- Video detail page with summary, statements, and clips
- Clip detail page with Reddit-like threaded comments
- Built-in demo-user participation for posting, commenting, voting, bookmarking, and reporting
- Clear source labels for official vs. user-submitted content
- Local storage for drafts, preferences, recent views, and thread UI state

### Future Features

- Speaker identification and richer transcript/chapter timelines
- Issue/topic clustering across clips and videos
- Fact/claim typing with citations and uncertainty labels
- Cross-source comparison views on the same topic
- Follow topics, public bodies, and discussion threads
- Source health dashboard and ingestion admin tools
- Constructive ranking models that elevate well-supported comments
- Moderator review queue with escalation tooling

## 6. Recommended Technical Architecture

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- Server-rendered browsing pages for SEO and public accessibility
- Client components for voting, comments, local draft persistence, and UI preferences

### Access model

- Public browsing remains open
- Hackathon MVP uses a lightweight local login portal so users can participate without external auth complexity
- Optional future upgrade: swap the local login portal for a real auth provider once the core product loop is proven

### AI Layer

- Gemini API for transcript understanding, summarization, notable-statement extraction, topic labeling, and clip-context generation
- Structured JSON outputs for deterministic parsing
- Context caching for repeated analysis on long videos or repeated transcript prompts

### Backend

- Next.js route handlers for MVP
- Background job orchestration for video processing and ingestion
- For hackathon speed: one app repo with job tables and cron-triggered workers
- For production: move long-running ingestion/processing to a queue worker or Inngest/Trigger.dev-style job runner

### Data Layer

- Current repo: Drizzle ORM + SQLite for local prototype speed
- Recommended deployment: Drizzle ORM + PostgreSQL on Supabase or Neon
- Object storage for thumbnails, derived clips, and optional transcript artifacts

### Search and Discovery

- MVP: relational filters on source, topic, date, and sort order
- Future: full-text or vector-assisted search for transcript and statement discovery

## 7. Database Schema

Use the following schema as the canonical production design. The current SQLite schema is a lighter MVP subset.

### `users`

- `id`
- `auth0_sub` or another stable identity key
- `email`
- `display_name`
- `avatar_url`
- `role`
- `created_at`

### `user_settings`

- `user_id`
- `default_sort`
- `email_notifications`
- `safety_preferences`
- `created_at`
- `updated_at`

### `sources`

- `id`
- `name`
- `source_type` (`congress`, `city_council`, `committee`, `briefing`, `official_channel`, `user_submitted`)
- `organization_name`
- `homepage_url`
- `feed_url`
- `jurisdiction`
- `is_official`
- `trust_notes`
- `created_at`

### `source_feeds`

- `id`
- `source_id`
- `feed_type` (`youtube_playlist`, `rss`, `api`, `scraper`)
- `feed_identifier`
- `poll_frequency_minutes`
- `last_success_at`
- `status`

### `ingestion_runs`

- `id`
- `source_feed_id`
- `started_at`
- `completed_at`
- `status`
- `videos_found`
- `videos_created`
- `error_summary`

### `videos`

- `id`
- `source_id`
- `submitted_by_user_id`
- `title`
- `description`
- `canonical_url`
- `source_url`
- `thumbnail_url`
- `published_at`
- `duration_seconds`
- `source_type`
- `is_official_source`
- `processing_status`
- `language_code`
- `created_at`

### `video_speakers`

- `id`
- `video_id`
- `display_name`
- `role_label`
- `organization`

### `video_transcripts`

- `id`
- `video_id`
- `transcript_text`
- `transcript_source` (`official_caption`, `gemini_transcription`, `manual_upload`)
- `confidence_notes`
- `created_at`

### `video_segments`

- `id`
- `video_id`
- `start_seconds`
- `end_seconds`
- `title`
- `summary`
- `speaker_ids`
- `created_at`

### `video_summaries`

- `id`
- `video_id`
- `summary`
- `key_points_json`
- `topic_tags_json`
- `generation_model`
- `generated_at`

### `statements`

- `id`
- `video_id`
- `speaker_id`
- `start_seconds`
- `end_seconds`
- `quote`
- `paraphrase`
- `context`
- `importance_reason`
- `statement_type` (`claim`, `commitment`, `decision`, `procedural`, `opinion`)
- `verification_state` (`verified`, `disputed`, `unverified`, `opinion`)
- `topic_tags_json`
- `created_at`

### `clips`

- `id`
- `video_id`
- `statement_id`
- `created_by_user_id`
- `title`
- `description`
- `start_seconds`
- `end_seconds`
- `quote`
- `speaker_name`
- `context`
- `importance`
- `clip_asset_url`
- `created_at`

### `clip_posts`

- `id`
- `clip_id`
- `author_user_id`
- `headline`
- `body`
- `ranking_score`
- `comment_count`
- `upvote_count`
- `downvote_count`
- `created_at`

### `comments`

- `id`
- `clip_post_id`
- `parent_comment_id`
- `user_id`
- `body`
- `depth`
- `upvote_count`
- `downvote_count`
- `constructive_score`
- `created_at`

### `votes`

- `id`
- `user_id`
- `target_type` (`clip_post`, `comment`)
- `target_id`
- `vote_type` (`up`, `down`)
- `created_at`

### `bookmarks`

- `id`
- `user_id`
- `clip_id`
- `created_at`

### `thread_follows`

- `id`
- `user_id`
- `clip_post_id`
- `created_at`

### `reports`

- `id`
- `reporter_user_id`
- `target_type`
- `target_id`
- `reason`
- `details`
- `status`
- `created_at`

### `moderation_actions`

- `id`
- `report_id`
- `moderator_user_id`
- `action_type`
- `notes`
- `created_at`

## 8. Frontend Pages and Components

### Core Pages

- `/` landing page
- `/explore` browse videos and clips
- `/video/[id]` full video detail with summary and notable statements
- `/clip/[id]` threaded discussion for a specific moment
- `/submit` add a public civic video
- `/sources` browse by source type and organization
- `/topics` browse by policy topic
- `/about` explain trust, transparency, and product framing

### Logged-in Pages

- `/bookmarks`
- `/profile`
- `/settings`

### Components

- `AppHeader` with public browsing and demo-user participation affordances
- `VideoSubmitForm`
- `VideoPlayer`
- `VideoSummary`
- `VideoStatements`
- `ClipCard`
- `CommentThread`
- `CommentForm`
- `SourceBadge`
- local-storage hooks for drafts, preferences, recent views, and collapsed threads

## 9. User Flows

### Logged-out

1. Land on the home page
2. Browse public sources, videos, topics, and clips
3. Open a video and read the Gemini-generated summary
4. Open a clip and read the threaded discussion
5. Hit a participation boundary when attempting to comment or vote
6. Enter a clip discussion immediately in demo mode

### Logged-in

1. Enter through the lightweight local login portal
2. Submit a civic video or browse ingested official content
3. Open a video and review summary plus notable statements
4. Create or open a clip discussion
5. Comment, reply, vote, bookmark, or report
6. Return later to bookmarked clips and followed discussions

## 10. Gemini-Based AI Pipeline

Design the AI workflow around Gemini structured outputs and multimodal best practices.

### A. Transcript generation or transcript processing

1. Prefer official captions or transcripts when available.
2. If no trusted transcript exists, use Gemini video understanding on the original file or YouTube URL.
3. Store the raw transcript separately from the summary so future prompts can be re-run without re-fetching the source.
4. Count tokens before analysis on very long inputs and split by chapters if needed.

**Implementation notes**

- Use Gemini video/file inputs through the Files API for videos over 20 MB or longer than about 1 minute.
- Use one video per prompt request.
- Put the text instruction after the video part in the request contents.
- Use Gemini structured outputs for transcript-derived analysis.

### B. Summary generation

1. Feed transcript plus source metadata into Gemini.
2. Ask for:
   - overall summary
   - key points
   - topic tags
   - uncertainty notes when audio or speaker attribution is unclear
3. Validate the JSON output against an application schema before saving.

### C. Notable statement extraction

1. Ask Gemini for statements that are substantive, policy-relevant, or decision-relevant.
2. Reject “shock value” selection criteria explicitly in the prompt.
3. Require these fields:
   - quote or close paraphrase
   - speaker
   - timestamp
   - surrounding context
   - why it matters
   - topic tags
   - statement type
4. Run a second-pass dedupe/ranking step so multiple near-identical highlights do not flood the UI.

### D. Clip creation

1. Start with a canonical context window around each statement, for example 15 seconds before and after.
2. Store clip metadata even before rendering a derived media file.
3. Link every clip back to:
   - full video
   - transcript anchor
   - source organization
   - original URL

### E. Topic grouping

1. Use Gemini to classify videos and statements into a controlled civic topic taxonomy.
2. Cluster clips by shared topics first.
3. Only add semantic retrieval or embedding-based grouping if time remains after the MVP works reliably.

### F. Recommended Gemini request pattern

- Fast path: Gemini Flash model for extraction and structured analysis
- Deep synthesis path: Gemini Pro model for especially long or complex hearings
- Use JSON schema / structured output mode instead of free-form JSON parsing
- Validate every response in application code before persistence
- Use context caching when multiple prompts will query the same long hearing

## 11. Plan for Automatic Ingestion of Official Sources

### Initial source set

- U.S. Congress / parliamentary archives
- City council YouTube channels
- Committee hearing channels
- Government briefing channels
- Public legislative session archives

### Ingestion architecture

1. Define each source as a `source` plus one or more `source_feeds`.
2. Poll feeds on a schedule.
3. Normalize discovered video metadata into a canonical `videos` table.
4. Mark `is_official_source = true` only for verified sources.
5. Run processing jobs after successful ingest.
6. Keep a traceable `ingestion_runs` log for transparency and debugging.

### Transparency requirements

- Preserve original titles where possible
- Store original source URLs
- Show source organization and ingestion timestamp
- Avoid editing quotes in ways that change meaning
- Keep user-submitted and official-source material visually distinct

## 12. Local Storage vs. Database Plan

### Store in local storage

- Theme and UI preferences
- Draft comments and draft clip-post text
- Recently viewed videos and clips
- Saved filters and sort state
- Onboarding state
- Collapsed thread preferences

### Store in database

- Users and demo-identity mapping
- Shared videos, summaries, statements, clips, and transcripts
- Comments, votes, bookmarks, follows, and reports
- Moderation actions
- Source ingestion records and provenance metadata
- Anything that must sync across devices or users

### Rule of thumb

- If the state is per-user, per-device, temporary, and non-sensitive, default to local storage.
- If the state is shared, canonical, security-sensitive, or moderation-relevant, store it in the backend.

## 13. Moderation and Safety Recommendations

- Require source context around every highlighted clip.
- Label AI-generated summaries and notable-moment explanations.
- Separate verified facts, disputed claims, and opinions where feasible.
- Do not rank purely by raw votes; incorporate recency, discussion quality, and report status.
- Add easy reporting for harassment, misinformation framing, missing context, and spam.
- Distinguish official-source clips from user-submitted clips at every browse surface.
- Add moderator tooling for clip takedown, comment removal, and context correction.
- Keep minimal personal data and allow anonymous browsing.

## 14. Extra Alignment With Governance & Collaboration

- Add “What happened before and after this clip?” as a first-class interaction.
- Highlight procedural decisions and policy changes, not just rhetorical conflict.
- Build discussion prompts that encourage explanation and evidence over dunking.
- Surface minority or less-upvoted but substantively useful comments through quality-aware ranking.
- Show why a clip was highlighted and how it was generated.
- Add source pages for institutions so users can follow a public body over time.

## 15. Step-by-Step Implementation Plan

### Phase 1: Product shell

1. Finish the public landing page and trust framing
2. Keep public browsing open
3. Keep participation friction low with the lightweight local login portal

### Phase 2: Core data model

1. Finalize Drizzle schema for videos, clips, comments, votes, bookmarks, reports
2. Add source and ingestion tables
3. Decide local SQLite vs. production PostgreSQL deployment path

### Phase 3: Video submission and processing

1. Submit public video URLs
2. Persist basic metadata
3. Run Gemini transcript/analysis job
4. Save summary, key points, topics, and notable statements
5. Auto-create clip records from notable statements

### Phase 4: Public browse surfaces

1. Explore page
2. Sources page
3. Topics page
4. Video detail page
5. Clip discussion page

### Phase 5: Participation

1. Lightweight local login
2. Commenting and replies
3. Voting
4. Bookmarking
5. Reporting

### Phase 6: Local storage polish

1. Persist drafts
2. Persist UI preferences
3. Persist recent views
4. Persist thread-collapse state

### Phase 7: Official-source ingestion

1. Add source definitions
2. Build polling jobs
3. Normalize source metadata
4. Process ingested videos automatically
5. Add admin/source monitoring

### Phase 8: Trust and moderation

1. Add provenance UI
2. Add fact/claim/opinion labels
3. Add moderation queue
4. Refine ranking for constructive discussion

## 16. Recommended Next Moves For This Repo

- Keep the existing lightweight monolith for the hackathon
- Continue using Drizzle and the current MVP tables while expanding toward the schema above
- Migrate SQLite to PostgreSQL when shared deployment matters
- Upgrade the Gemini integration to structured outputs and model-configurable defaults
- Finish bookmarks/profile routes and source ingestion workers after the core browse/analysis flow is stable
