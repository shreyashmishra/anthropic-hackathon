import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DashboardMockup } from "@/components/dashboard-mockup"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-white/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-full mb-6">
            Powered by AI · Fully personalized
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            Stay informed on politics in{" "}
            <span className="italic text-blue-700">minutes</span>, not hours
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
            Debates are long. Your time isn&apos;t. Paste any political debate or hearing link — we
            clip and summarize the moments that matter most to <em>you</em>.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <Button
              asChild
              className="rounded-full bg-blue-700 text-white hover:bg-blue-800 px-6"
            >
              <Link href="/demo">Try it free</Link>
            </Button>
            <Button variant="outline" className="rounded-full px-6">
              See how it works
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
