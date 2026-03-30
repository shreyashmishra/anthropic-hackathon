"use client"

import { Globe, Clock, CheckCircle } from "lucide-react"

const clips = [
  {
    topic: "Healthcare",
    topicColor: "bg-emerald-100 text-emerald-700",
    timestamp: "23:14 – 27:52",
    duration: "4m 38s",
    title: "Medicare Drug Pricing — What Changes for Seniors",
    matched: "Healthcare",
    bullets: [
      "Candidate A proposes capping insulin at $35/month for all Americans",
      "Candidate B argues market competition drives down prices better than regulation",
      "Key dispute: whether the Inflation Reduction Act's provisions should expand",
    ],
  },
  {
    topic: "Economy",
    topicColor: "bg-amber-100 text-amber-700",
    timestamp: "8:03 – 14:17",
    duration: "6m 14s",
    title: "Inflation & Cost of Living — Competing Plans",
    matched: "Economy",
    bullets: [
      "Candidate A says inflation dropped from 9% peak to near 3% under current policies",
      "Candidate B attributes high prices to 'the worst inflation in 40 years'",
      "Both propose different tax strategies targeting the middle class",
    ],
  },
]

export function DashboardMockup() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl border overflow-hidden">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            app.civicbrief.ai/demo
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 border-r bg-muted/10 p-4 hidden md:block">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-serif text-sm italic">
              <span className="text-blue-700">Civic</span>Brief
            </span>
          </div>
          <nav className="space-y-1">
            {[
              { icon: "▸", label: "My Briefs", active: false },
              { icon: "✦", label: "Analyze Video", active: false },
              { icon: "◉", label: "Results", active: true },
              { icon: "⊕", label: "Saved Clips", active: false },
              { icon: "⚙", label: "My Interests", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer ${
                  item.active ? "bg-blue-50 text-blue-700" : "text-muted-foreground"
                }`}
              >
                <span>{item.icon}</span> {item.label}
              </div>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5 overflow-hidden">
          {/* Brief header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Brief ready</span>
            </div>
            <h3 className="font-semibold text-base">2024 Presidential Debate</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> 1h 47m analyzed
              </span>
              <span className="text-xs text-muted-foreground">4 clips · 24 min of highlights</span>
            </div>
          </div>

          {/* Interest tags */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {["Economy", "Healthcare", "Social Security"].map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Clips */}
          <div className="space-y-3">
            {clips.map((clip, i) => (
              <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${clip.topicColor}`}>
                      {clip.topic}
                    </span>
                    <span className="text-xs text-muted-foreground">{clip.timestamp}</span>
                    <span className="text-xs text-muted-foreground">· {clip.duration}</span>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">{clip.title}</p>
                <p className="text-xs text-blue-600 mb-2">⭐ Matched your interest in {clip.matched}</p>
                <ul className="space-y-1">
                  {clip.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-muted-foreground flex gap-1.5">
                      <span className="mt-0.5 shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 text-xs bg-blue-700 text-white rounded-full">▶ Watch Clip</button>
                  <button className="px-3 py-1 text-xs border rounded-full text-muted-foreground">Left View</button>
                  <button className="px-3 py-1 text-xs border rounded-full text-muted-foreground">Right View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
