import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Landmark, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";

const trustPillars = [
  "Always show source context",
  "Differentiate official vs. user-submitted video",
  "Support discussion without optimizing for outrage",
];

const timelineMoments = [
  {
    time: "02:14",
    label: "Budget update",
    detail: "Summary generated from an official city council livestream.",
  },
  {
    time: "11:08",
    label: "Housing claim flagged",
    detail: "Quote, speaker, and surrounding context appear together before discussion starts.",
  },
  {
    time: "19:42",
    label: "Threaded discussion",
    detail: "Residents discuss one moment instead of arguing about a whole two-hour meeting.",
  },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border/70">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(49,88,138,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(43,141,128,0.14),transparent_30%),linear-gradient(180deg,rgba(244,247,250,0.95),rgba(255,255,255,0.92))]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-primary">
            <Landmark className="h-3.5 w-3.5" />
            Governance & Collaboration
          </div>

          <h1 className="max-w-3xl font-serif text-4xl leading-[1.02] tracking-tight text-balance sm:text-5xl lg:text-7xl">
            See the full context behind civic moments.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            OpenFloor turns debates, hearings, council meetings, and public briefings into
            timestamped summaries, notable statements, and threaded discussions grounded in the
            original source material.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/explore">
                Explore Public Clips
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6 bg-background/80">
              <Link href="/submit">Submit a Civic Video</Link>
            </Button>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
            {trustPillars.map((pillar) => (
              <div key={pillar} className="rounded-2xl border border-border/70 bg-background/75 px-4 py-3">
                {pillar}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-8 hidden h-32 w-32 rounded-full bg-primary/10 blur-3xl lg:block" />
          <div className="absolute -bottom-6 right-6 hidden h-36 w-36 rounded-full bg-accent/15 blur-3xl lg:block" />

          <div className="relative overflow-hidden rounded-[32px] border border-border/70 bg-card/95 p-5 shadow-[0_24px_80px_rgba(35,52,79,0.12)]">
            <div className="rounded-[24px] border border-border/60 bg-background p-5">
              <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Official Source
                  </p>
                  <h2 className="mt-1 text-lg font-semibold">Boston City Council Hearing</h2>
                  <p className="text-sm text-muted-foreground">Transportation, housing, and street safety</p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-border/70 bg-muted/35 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Gemini Summary
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Council members debated bus lane funding, commuter reliability, and whether
                    short-term parking changes should accompany the proposed safety upgrades.
                  </p>

                  <div className="mt-4 space-y-3">
                    {timelineMoments.map((moment) => (
                      <div key={moment.time} className="rounded-2xl border border-border/70 bg-background px-3 py-3">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-mono text-primary">{moment.time}</span>
                          <span className="font-medium">{moment.label}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">{moment.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border/70 bg-slate-950 p-4 text-slate-50">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-200">
                    <MessageSquareText className="h-4 w-4 text-emerald-300" />
                    Clip Discussion
                  </div>

                  <blockquote className="rounded-2xl bg-white/6 p-4 text-sm leading-6 text-slate-100">
                    “If we remove this funding now, riders will feel it before the next school term.”
                  </blockquote>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="font-medium text-slate-100">Context shown by default</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Users see what was said before and after the clip, not just a 15-second fragment.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="font-medium text-slate-100">Public browsing, low-friction posting</p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        Anyone can read. Logged-in users can comment, vote, bookmark, and report.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-emerald-300/25 bg-emerald-300/10 p-3 text-emerald-50">
                      <p className="font-medium">Designed for understanding, not virality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
