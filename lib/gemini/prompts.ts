import { TOPICS } from "@/lib/constants";

const topicList = TOPICS.map((t) => t.id).join(", ");

export function buildVideoAnalysisPrompt(transcript: string) {
  return `You are an expert, nonpartisan civic analyst. Analyze the following transcript from a civic or political video (e.g., a debate, hearing, town hall, city council meeting, or legislative session).

Your analysis must be:
- Factual and nonpartisan
- Focused on substance, not entertainment value
- Clear about what is a fact vs. a claim vs. an opinion

Return your analysis as a JSON object with the following structure:

{
  "summary": "A 3-5 sentence summary of the video covering the main topics discussed, key decisions made, and overall context.",
  "key_points": [
    {
      "text": "Description of the key point",
      "timestamp_seconds": 0
    }
  ],
  "notable_statements": [
    {
      "quote": "The exact or closely paraphrased statement",
      "speaker": "Name of the speaker (or 'Unknown Speaker' if unclear)",
      "timestamp_seconds": 0,
      "context": "What was being discussed when this statement was made",
      "importance": "Why this statement matters or is notable (policy impact, contradiction, commitment, etc.)",
      "topic_tags": ["topic1", "topic2"]
    }
  ],
  "topics": ["topic1", "topic2"]
}

Rules:
- For notable_statements, focus on: policy commitments, factual claims, contradictions, significant decisions, proposals, and substantive arguments
- Do NOT select statements for shock value or outrage potential
- Available topic tags: ${topicList}
- Include 5-15 notable statements depending on video length
- Include 3-8 key points
- Timestamps should be approximate seconds from the start
- If you cannot determine a timestamp, use 0

TRANSCRIPT:
${transcript}

Respond ONLY with the JSON object. No markdown formatting, no code fences.`;
}

export function buildTranscriptPrompt() {
  return `Transcribe the audio from this video. Include speaker labels when you can identify different speakers. Format as plain text with approximate timestamps in [MM:SS] format at the start of each new speaker section or topic shift. Be thorough and accurate. Do not summarize - provide the full transcript.`;
}

export function buildClipContextPrompt(quote: string, surroundingText: string) {
  return `Given this quote from a civic/political video:

"${quote}"

And the surrounding transcript context:
${surroundingText}

Provide a brief (2-3 sentence) nonpartisan explanation of:
1. What was being discussed
2. Why this statement is notable or significant

Be factual. Do not editorialize. Respond in plain text, not JSON.`;
}
