import { AppFooter } from "@/components/layout/app-footer";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Landmark, ShieldCheck, Sparkles, Users } from "lucide-react";

const values = [
  {
    title: "Context before virality",
    body:
      "Every highlighted moment should show what happened around it and link back to the full recording or transcript.",
  },
  {
    title: "Transparent provenance",
    body:
      "Official government or public-interest sources are labeled clearly, with source organization, date, and original URL.",
  },
  {
    title: "Constructive participation",
    body:
      "Anonymous browsing stays open, while the current build uses a lightweight local login portal for comments, voting, bookmarking, and reporting.",
  },
];

const architecture = [
  {
    icon: Sparkles,
    title: "Gemini for analysis",
    body:
      "Gemini handles transcript understanding, summary generation, notable-statement extraction, topic tagging, and clip-context generation.",
  },
  {
    icon: Database,
    title: "Backend for the civic record",
    body:
      "Shared data such as videos, clips, comments, votes, reports, and source-ingestion metadata belongs in the database, not in local storage.",
  },
  {
    icon: ShieldCheck,
    title: "Safety by design",
    body:
      "The product should separate verified facts, disputed claims, and opinions where possible, and avoid ranking systems that simply reward heat.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1">
        <section className="border-b border-border/70 bg-[linear-gradient(180deg,rgba(49,88,138,0.06),rgba(255,255,255,0))]">
          <div className="container mx-auto px-4 py-14">
            <Badge variant="outline" className="mb-4 gap-2 border-primary/20 bg-primary/5 text-primary">
              <Landmark className="h-3.5 w-3.5" />
              Governance & Collaboration
            </Badge>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
              OpenFloor helps people participate in democracy with more context and less noise.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Long public meetings are technically accessible but practically hard to follow. OpenFloor
              turns civic and political video into understandable summaries, timestamped moments, and
              clip-based discussions that stay grounded in the original source.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-4 lg:grid-cols-3">
            {values.map((value) => (
              <Card key={value.title} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-7 text-muted-foreground">
                  {value.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Why this fits the track</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              The product is aimed at informed civic participation, clearer public understanding,
              and more respectful collaboration across disagreements. It treats public footage as
              civic infrastructure instead of algorithmic entertainment inventory.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {architecture.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="h-full">
                  <CardContent className="pt-6">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <Card className="border-dashed">
            <CardContent className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <Users className="h-4 w-4" />
                  Product Blueprint
                </div>
                <h2 className="text-xl font-semibold">The repo now includes a full implementation blueprint.</h2>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  It covers the elevator pitch, MVP scope, architecture, database schema, Gemini
                  workflow, ingestion plan, local-storage strategy, moderation guidance, and a
                  step-by-step delivery plan for the hackathon.
                </p>
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm font-mono">
                docs/openfloor-blueprint.md
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <AppFooter />
    </div>
  );
}
