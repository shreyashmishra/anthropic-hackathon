export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 text-sm border rounded-full mb-6">How it works</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
            From a 2-hour debate
            <br />
            to a 5-minute brief
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            No more watching hours of content hoping to catch what matters. CivicBrief does the work for you — and
            personalizes it to <em>your</em> life.
          </p>
        </div>

        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <span className="text-sm font-medium text-blue-700 mb-2 block">Step 1</span>
            <h3 className="font-serif text-2xl md:text-3xl mb-4">Paste any debate or hearing link</h3>
            <p className="text-muted-foreground leading-relaxed">
              Works with YouTube, C-SPAN, and major news network videos. Presidential debates, Senate hearings,
              town halls — if it's political and long-form, we can brief it.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <PasteUrlCard />
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <InterestsCard />
          </div>
          <div>
            <span className="text-sm font-medium text-blue-700 mb-2 block">Step 2</span>
            <h3 className="font-serif text-2xl md:text-3xl mb-4">Tell us what you care about</h3>
            <p className="text-muted-foreground leading-relaxed">
              Select the issues that affect your life — healthcare, housing costs, student debt, small business,
              climate, immigration. Your brief is filtered and ranked accordingly.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="order-2 md:order-1">
            <span className="text-sm font-medium text-blue-700 mb-2 block">Step 3</span>
            <h3 className="font-serif text-2xl md:text-3xl mb-4">Get your personalized brief</h3>
            <p className="text-muted-foreground leading-relaxed">
              We surface the exact clips from the debate that affect you most. Each clip includes a balanced,
              neutral summary showing what each candidate actually said — no spin.
            </p>
          </div>
          <div className="order-1 md:order-2">
            <ClipResultCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function PasteUrlCard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <label className="text-sm text-muted-foreground block mb-2">Paste a video link</label>
        <div className="flex items-center gap-2 border rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z" />
            <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
          </svg>
          <span className="text-sm text-muted-foreground truncate">youtube.com/watch?v=bvr_ZzAQCVk</span>
        </div>
        <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center shrink-0">
            <span className="text-xs">▶</span>
          </div>
          <div>
            <p className="text-xs font-medium">2024 Presidential Debate</p>
            <p className="text-xs text-muted-foreground">CNN · 1h 47m</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InterestsCard() {
  const interests = [
    { label: "Economy", selected: true },
    { label: "Healthcare", selected: true },
    { label: "Housing", selected: false },
    { label: "Immigration", selected: false },
    { label: "Climate", selected: false },
    { label: "Education", selected: false },
    { label: "Social Security", selected: true },
    { label: "Foreign Policy", selected: false },
  ]
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <p className="text-sm font-medium mb-3">I care most about…</p>
        <div className="flex flex-wrap gap-2">
          {interests.map((item) => (
            <span
              key={item.label}
              className={`px-3 py-1.5 text-xs rounded-full border cursor-pointer transition-colors ${
                item.selected
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-muted-foreground border-border"
              }`}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ClipResultCard() {
  return (
    <div className="bg-muted/50 rounded-xl p-6">
      <div className="bg-white rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">Healthcare</span>
          <span className="text-xs text-muted-foreground">23:14 – 27:52 · 4m 38s</span>
        </div>
        <p className="text-sm font-medium mb-1">Medicare Drug Pricing — What Changes for Seniors</p>
        <p className="text-xs text-blue-600 mb-2">⭐ Matched your interest in Healthcare</p>
        <ul className="space-y-1.5">
          <li className="text-xs text-muted-foreground flex gap-1.5">
            <span className="shrink-0">•</span>Candidate A proposes capping insulin at $35/month for all Americans
          </li>
          <li className="text-xs text-muted-foreground flex gap-1.5">
            <span className="shrink-0">•</span>Candidate B argues market competition drives prices down better
          </li>
        </ul>
        <div className="flex gap-2 mt-3">
          <button className="px-3 py-1 text-xs bg-blue-700 text-white rounded-full">▶ Watch Clip</button>
          <button className="px-3 py-1 text-xs border rounded-full text-muted-foreground">Left View</button>
          <button className="px-3 py-1 text-xs border rounded-full text-muted-foreground">Right View</button>
        </div>
      </div>
    </div>
  )
}
