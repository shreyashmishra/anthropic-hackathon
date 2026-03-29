import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8f5e9]/40 via-[#e3f2fd]/40 to-[#f3e5f5]/30" />

      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4">Create your own AI chat</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Turn your knowledge into revenue. Train a custom AI chat your clients will rely on and pay for.
        </p>
        <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">Get started</Button>
      </div>
    </section>
  )
}
