import { FileText, Globe, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 text-sm border rounded-full mb-6">How it works</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
            The easiest way to
            <br />
            launch your AI business
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Train your AI, add your brand, connect payments, and start selling access — all in one platform.
          </p>
        </div>

        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">1. Train your AI chat</h3>
            <p className="text-muted-foreground leading-relaxed">
              Set clear instructions, adjust temperature, and define capabilities. Train your AI chat with your files,
              data, and knowledge so it can answer with your unique expertise.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <InstructionsCard />
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <BrandCard />
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl mb-4">2. Add your brand</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload your logo and favicon, adjust colors, and customize texts. Make your AI chat reflect your existing
              brand and voice — fully branded, professional, and SEO-friendly.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <h3 className="font-serif text-2xl md:text-3xl mb-4">3. Connect a custom domain</h3>
            <p className="text-muted-foreground leading-relaxed">
              Add your own domain or subdomain. Your AI chat will feel like a seamless part of your brand — not a
              third-party tool.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <DomainCard />
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <PaymentsCard />
          </div>
          <div>
            <h3 className="font-serif text-2xl md:text-3xl mb-4">4. Set up payments</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect Stripe in minutes. Offer free trial messages, then sell access with flexible paid plans.
            </p>
          </div>
        </div>

        {/* Step 5 */}
        <div className="text-center mb-16">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">5. Go Live!</h3>
          <p className="text-muted-foreground max-w-lg mx-auto mb-6">
            Your branded AI is ready. Share the link, invite users, and start turning conversations into revenue.
          </p>
          <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6">
            Make your AI chat
          </Button>
        </div>

        {/* Chat demo */}
        <ChatDemo />
      </div>
    </section>
  )
}

function InstructionsCard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <h4 className="text-sm font-medium mb-4">Instructions</h4>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground">Role</label>
            <div className="h-0.5 bg-muted mt-2 w-full" />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Personality</label>
            <div className="h-0.5 bg-muted mt-2 w-full" />
          </div>
        </div>

        <h4 className="text-sm font-medium mt-6 mb-3">Files</h4>
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <FileText className="w-4 h-4 text-purple-500" />
          <span className="text-sm">Report.pdf</span>
        </div>

        <h4 className="text-sm font-medium mt-6 mb-3">Website</h4>
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">mywebsite.com</span>
        </div>
      </div>
    </div>
  )
}

function BrandCard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <span className="text-purple-500 font-bold">A</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Upload className="w-4 h-4" />
            Upload logo
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Background</span>
            <div className="w-8 h-8 rounded-full bg-gray-100 border" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Accent</span>
            <div className="w-8 h-8 rounded-full bg-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
}

function DomainCard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 p-3 border rounded-lg">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">chat.mybusiness.com</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
          <span className="text-sm text-green-600">Domain connected</span>
        </div>
      </div>
    </div>
  )
}

function PaymentsCard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <span className="text-purple-500 font-bold text-xl italic">stripe</span>
          <Button variant="outline" size="sm">
            Connect Stripe
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 border rounded-lg text-sm">100 messages</span>
            <span className="px-3 py-1.5 border rounded-lg text-sm">$4.00/mo</span>
            <span className="text-green-500 text-sm font-medium">+$1.00</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 border rounded-lg text-sm">200 messages</span>
            <span className="px-3 py-1.5 border rounded-lg text-sm">$8.00/mo</span>
            <span className="text-green-500 text-sm font-medium">+$2.00</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="mt-4 gap-1 bg-transparent">
          <span>+</span> Add plan
        </Button>
      </div>
    </div>
  )
}

function ChatDemo() {
  return (
    <div className="relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#e8f5e9]/50 via-[#e3f2fd]/50 to-[#f3e5f5]/50 rounded-3xl" />

      <div className="relative rounded-3xl p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center">
                <span className="text-purple-500 text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-medium">Fitness X</span>
            </div>
            <nav className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Chat</span>
              <span className="text-sm text-muted-foreground">About</span>
              <span className="text-sm text-muted-foreground">Pricing</span>
              <span className="text-sm text-muted-foreground">Log in</span>
              <button className="px-3 py-1 text-xs bg-purple-500 text-white rounded-full">Sign up</button>
            </nav>
          </div>

          {/* Chat content */}
          <div className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">How can I help?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ready to get fit? Ask me about exercises, diet,
              <br />
              or how to build the perfect routine for you.
            </p>

            <div className="max-w-md mx-auto mb-6">
              <div className="border rounded-lg p-3">
                <input type="text" placeholder="Ask anything" className="w-full text-sm outline-none" />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>📎</span> 0 Files
                  </div>
                  <button className="w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white text-xs">↑</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-left max-w-md mx-auto space-y-2">
              <p className="text-sm text-muted-foreground">Quick healthy breakfast?</p>
              <p className="text-sm text-muted-foreground">Best stretch for back pain?</p>
              <p className="text-sm text-muted-foreground">Easy home workouts?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
