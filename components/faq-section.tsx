"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How does OpenFloor stay nonpartisan if it highlights political moments?",
    answer:
      "The product is designed to surface policy-relevant statements, procedural decisions, and substantive claims, not the most inflammatory content. Every highlighted moment links back to the original recording, includes context, and explains why the system considered it notable.",
  },
  {
    question: "Can people browse without creating an account?",
    answer:
      "Yes. Public browsing is a core requirement. Anyone can read videos, clips, summaries, and discussions without creating an account, and the current hackathon build uses a lightweight local login portal only when someone wants to participate.",
  },
  {
    question: "What happens when Gemini gets something wrong?",
    answer:
      "AI outputs are clearly labeled as generated assistance, not authoritative truth. The product should distinguish verified facts, disputed claims, and opinions where possible, while always pointing users back to the original source material for verification.",
  },
  {
    question: "Why separate official government sources from user submissions?",
    answer:
      "Because provenance matters. Officially ingested content should be visibly labeled so users understand whether a clip came directly from a government or public institution feed versus a user-submitted public link.",
  },
  {
    question: "Why use local storage at all if there is a backend?",
    answer:
      "Local storage keeps lightweight, per-device state off the server: draft comments, UI preferences, recently viewed clips, onboarding state, and collapsed thread settings. Shared civic records, moderation data, and canonical summaries remain in the database.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">FAQ</p>
          <h2 className="mt-4 font-serif text-3xl text-balance sm:text-4xl lg:text-5xl">
            Questions the product has to answer up front.
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
            Trust, transparency, provenance, and anonymous browsing are product requirements, not
            optional polish.
          </p>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-card/80 px-6">
          {faqs.map((faq, index) => (
            <div key={faq.question} className="border-b border-border/70 last:border-b-0">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-medium">{faq.question}</span>
                <Plus
                  className={`h-4 w-4 shrink-0 transition-transform ${openIndex === index ? "rotate-45" : ""}`}
                />
              </button>
              {openIndex === index ? (
                <div className="pb-5 text-sm leading-7 text-muted-foreground">{faq.answer}</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
