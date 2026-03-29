import { Button } from "@/components/ui/button"
import { DashboardMockup } from "@/components/dashboard-mockup"

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8f5e9]/30 via-[#e3f2fd]/30 to-[#f3e5f5]/20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-balance">
            Launch and monetize your own branded AI chat
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto">
            Turn your knowledge into revenue. Train a custom AI chat your clients will rely on and pay for.
          </p>
          <Button className="mt-8 rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            Make your AI chat
          </Button>
        </div>

        <div className="mt-12">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
