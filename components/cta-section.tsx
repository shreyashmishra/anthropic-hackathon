import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(49,88,138,0.08),rgba(43,141,128,0.08))]" />

      <div className="relative mx-auto max-w-4xl rounded-[36px] border border-border/70 bg-background/90 px-8 py-14 text-center shadow-[0_20px_70px_rgba(35,52,79,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Start With Public Context</p>
        <h2 className="mt-5 font-serif text-3xl text-balance sm:text-4xl lg:text-5xl">
          Bring clarity back to civic video.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
          Build a place where people can understand what public officials said, see the source
          material, and discuss one moment at a time without collapsing everything into outrage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-6">
            <Link href="/submit">Submit a Video</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-6 bg-background/80">
            <Link href="/about">Read the Product Framing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
