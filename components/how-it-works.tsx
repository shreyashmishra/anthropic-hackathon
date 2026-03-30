import { DatabaseZap, Landmark, MessageSquareCode, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Landmark,
    eyebrow: "1. Bring in source material",
    title: "Upload recorded debate links and public video clips.",
    body:
      "Start with recorded debates, political interviews, town halls, or other public video URLs. Every record keeps its provenance: source channel, original URL, date, and speaker metadata when available.",
  },
  {
    icon: Sparkles,
    eyebrow: "2. Turn long recordings into usable context",
    title: "Gemini creates summaries, chapters, topics, and notable statements.",
    body:
      "The system prioritizes substance over spectacle, producing timestamped summaries, policy-relevant moments, and clip candidates with context and links back to the full transcript.",
  },
  {
    icon: MessageSquareCode,
    eyebrow: "3. Discuss one moment at a time",
    title: "Each clip becomes a threaded conversation instead of a decontextualized reaction post.",
    body:
      "Users can browse anonymously, then open a lightweight local login portal to comment, vote, bookmark, and report. Ranking should favor clarity and usefulness, not raw engagement bait.",
  },
  {
    icon: DatabaseZap,
    eyebrow: "4. Keep the shared record trustworthy",
    title: "Store canonical civic data on the backend and keep lightweight state local.",
    body:
      "Local storage handles drafts, preferences, recently viewed clips, and collapsed threads. Shared discussion data, moderation actions, summaries, and official-source metadata stay in the database.",
  },
];

const principles = [
  "Clip context is mandatory. The app never presents a highlight without surrounding context and a path back to the full source.",
  "Officially ingested government video is labeled differently from user-submitted footage.",
  "The product explains why a moment was highlighted and where the original material came from.",
];

export function HowItWorks() {
  return (
    <section className="bg-background px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            How OpenFloor Works
          </span>
          <h2 className="mt-6 font-serif text-3xl text-balance sm:text-4xl lg:text-5xl">
            Built for people who want to understand civic decisions without watching every minute live.
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            The workflow is designed to reduce confusion, preserve provenance, and create room for
            more constructive public discussion.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="rounded-[28px] border border-border/70 bg-card/80 p-6 shadow-sm transition-transform hover:-translate-y-0.5"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{step.eyebrow}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">{step.body}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-[28px] border border-border/70 bg-[linear-gradient(135deg,rgba(49,88,138,0.06),rgba(43,141,128,0.06))] p-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Civic trust rules are part of the product, not an afterthought.</h3>
              <p className="text-sm text-muted-foreground">
                OpenFloor is designed to help people participate in democracy more effectively, not to manufacture political heat.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle} className="rounded-2xl border border-border/60 bg-background/90 px-4 py-4 text-sm leading-6">
                {principle}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
