import { GoogleGenerativeAI, SchemaType, type ResponseSchema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const defaultGeminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const videoAnalysisSchema: ResponseSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "A concise 3-5 sentence summary of the civic video.",
    },
    key_points: {
      type: SchemaType.ARRAY,
      description: "Core points or decisions with approximate timestamps.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          text: {
            type: SchemaType.STRING,
            description: "Plain-language explanation of the point.",
          },
          timestamp_seconds: {
            type: SchemaType.INTEGER,
            description: "Approximate timestamp in seconds from the start of the video.",
          },
        },
        required: ["text", "timestamp_seconds"],
      },
    },
    notable_statements: {
      type: SchemaType.ARRAY,
      description: "Substantive statements that deserve discussion or follow-up review.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          quote: {
            type: SchemaType.STRING,
            description: "Exact quote or close paraphrase.",
          },
          speaker: {
            type: SchemaType.STRING,
            description: "Speaker name, or Unknown Speaker when unclear.",
          },
          timestamp_seconds: {
            type: SchemaType.INTEGER,
            description: "Approximate timestamp in seconds from the start of the video.",
          },
          context: {
            type: SchemaType.STRING,
            description: "Short description of what was being discussed around the statement.",
          },
          importance: {
            type: SchemaType.STRING,
            description: "Why the statement is notable in civic or policy terms.",
          },
          topic_tags: {
            type: SchemaType.ARRAY,
            description: "Relevant canonical topic ids.",
            items: {
              type: SchemaType.STRING,
            },
          },
        },
        required: ["quote", "speaker", "timestamp_seconds", "context", "importance", "topic_tags"],
      },
    },
    topics: {
      type: SchemaType.ARRAY,
      description: "Canonical topic ids describing the video.",
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: ["summary", "key_points", "notable_statements", "topics"],
};

export const geminiAnalysisModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_ANALYSIS_MODEL || defaultGeminiModel,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: videoAnalysisSchema,
  },
});

export const geminiTranscriptionModel = genAI.getGenerativeModel({
  model: process.env.GEMINI_TRANSCRIBE_MODEL || defaultGeminiModel,
});

export { genAI };
