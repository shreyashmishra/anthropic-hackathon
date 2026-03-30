import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-indigo-50/40 to-white/20" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">
          Democracy deserves your attention.
          <br />
          <span className="italic text-blue-700">Even when time doesn&apos;t.</span>
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Join thousands of voters who use CivicBrief to cut through hours of political content and stay genuinely
          informed.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button
            asChild
            className="rounded-full bg-blue-700 text-white hover:bg-blue-800 px-8 py-6 text-base"
          >
            <Link href="/demo">Try the demo</Link>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Free to use · No credit card required</p>
      </div>
    </section>
  )
}
