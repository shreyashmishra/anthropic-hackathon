import { geminiAnalysisModel, geminiTranscriptionModel } from "./client";
import { buildVideoAnalysisPrompt, buildTranscriptPrompt } from "./prompts";
import { db } from "@/lib/db";
import { videos, clips } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { extractYouTubeId } from "@/lib/youtube";

async function fetchYouTubeTranscript(videoId: string): Promise<string | null> {
  // Try to get captions via YouTube's timedtext endpoint
  try {
    const response = await fetch(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    const html = await response.text();

    // Extract captions URL from the page
    const captionsMatch = html.match(/"captionTracks":\[.*?"baseUrl":"(.*?)"/);
    if (!captionsMatch) return null;

    const captionsUrl = captionsMatch[1].replace(/\\u0026/g, "&");
    const captionsResponse = await fetch(captionsUrl);
    const captionsXml = await captionsResponse.text();

    // Parse XML captions into text with timestamps
    const lines: string[] = [];
    const regex = /<text start="([\d.]+)"[^>]*>(.*?)<\/text>/g;
    let match;
    while ((match = regex.exec(captionsXml)) !== null) {
      const seconds = Math.floor(parseFloat(match[1]));
      const text = match[2]
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      lines.push(`[${mins}:${secs.toString().padStart(2, "0")}] ${text}`);
    }

    return lines.length > 0 ? lines.join("\n") : null;
  } catch {
    return null;
  }
}

async function transcribeWithGemini(videoUrl: string): Promise<string> {
  const result = await geminiTranscriptionModel.generateContent([
    {
      fileData: {
        mimeType: "video/mp4",
        fileUri: videoUrl,
      },
    },
    { text: buildTranscriptPrompt() },
  ]);
  return result.response.text();
}

function parseGeminiJson(text: string): Record<string, unknown> {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  return JSON.parse(cleaned.trim());
}

export async function processVideo(videoId: string) {
  // Update status to processing
  await db.update(videos).set({ processingStatus: "processing" }).where(eq(videos.id, videoId));

  try {
    const video = await db.select().from(videos).where(eq(videos.id, videoId)).get();
    if (!video) throw new Error("Video not found");

    let transcript = video.transcript;

    // Step 1: Get transcript
    if (!transcript) {
      const youtubeId = extractYouTubeId(video.url);
      if (youtubeId) {
        transcript = await fetchYouTubeTranscript(youtubeId);
      }
      // If YouTube captions not available, try Gemini transcription
      if (!transcript) {
        if (youtubeId) {
          throw new Error("No YouTube captions were found for this video yet.");
        }
        transcript = await transcribeWithGemini(video.url);
      }
    }

    // Step 2: Analyze with Gemini
    const analysisPrompt = buildVideoAnalysisPrompt(transcript);
    const result = await geminiAnalysisModel.generateContent(analysisPrompt);
    const responseText = result.response.text();
    const analysis = parseGeminiJson(responseText);

    // Step 3: Update video record
    await db
      .update(videos)
      .set({
        transcript,
        summary: analysis.summary as string,
        keyPoints: JSON.stringify(analysis.key_points),
        notableStatements: JSON.stringify(analysis.notable_statements),
        topics: JSON.stringify(analysis.topics),
        processingStatus: "completed",
      })
      .where(eq(videos.id, videoId));

    // Step 4: Auto-generate clips from notable statements
    const statements = analysis.notable_statements as Array<{
      quote: string;
      speaker: string;
      timestamp_seconds: number;
      context: string;
      importance: string;
      topic_tags: string[];
    }>;

    if (statements && Array.isArray(statements)) {
      for (const stmt of statements) {
        const startSeconds = Math.max(0, (stmt.timestamp_seconds || 0) - 15);
        const endSeconds = (stmt.timestamp_seconds || 0) + 15;
        const title =
          stmt.quote.length > 80
            ? stmt.quote.substring(0, 77) + "..."
            : stmt.quote;

        await db.insert(clips).values({
          videoId,
          title,
          startSeconds,
          endSeconds,
          quote: stmt.quote,
          speaker: stmt.speaker,
          context: stmt.context,
          importance: stmt.importance,
        });
      }
    }

    return { success: true };
  } catch (error) {
    await db
      .update(videos)
      .set({ processingStatus: "failed" })
      .where(eq(videos.id, videoId));
    throw error;
  }
}
