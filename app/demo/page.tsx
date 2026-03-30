"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  ArrowLeft,
  Play,
  Pause,
  Bookmark,
  Heart,
  Share2,
  X,
  Volume2,
  Maximize,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Send,
} from "lucide-react"

// ─── Constants ────────────────────────────────────────────────────────────────

// Drop thumb-poilievre.jpg and thumb-carney.jpg into /public to activate them.
// Falls back to the YouTube thumbnail automatically.
const YT_THUMB = "https://img.youtube.com/vi/vzpgOhTEgbE/maxresdefault.jpg"
const THUMB_POILIEVRE = "/thumb-poilievre.jpg"
const THUMB_CARNEY = "/thumb-carney.jpg"

const MOCK_CLIPS = [
  {
    id: 1,
    topic: "Housing",
    topicAccent: "#3b82f6",
    overlay: "rgba(15, 23, 42, 0.52)",
    thumb: THUMB_CARNEY,
    thumbPosition: "center center",
    startSeconds: 862,   // 14:22
    durationSeconds: 383, // 6m 23s
    timestamp: "14:22 – 20:45",
    duration: "6m 23s",
    title: "Housing Affordability — Can Ottawa Actually Fix the Crisis?",
    matchedInterest: "Housing",
    caption: '"There are Canadians who have given up on ever owning a home. That ends with us."',
    captionSpeaker: "Mark Carney, Liberal Party",
    likes: "34.1k",
    bullets: [
      "Liberals pledge to double Canada's homebuilding rate to 500,000 homes per year.",
      "Conservatives promise to remove the GST on all new homes under $1M.",
      'Poilievre blames "gatekeepers and bureaucrats" for blocking construction.',
    ],
    leftView:
      "The housing crisis is the result of decades of government underinvestment. Bold public spending and zoning reform is the only way out.",
    rightView:
      "Government red tape, taxes, and overregulation are why homes cost too much. Cut the GST, remove gatekeepers, and let the market build.",
    chatResponse:
      "**Housing Affordability — 14:22 to 20:45**\n\nMark Carney (Liberal) pledged to double Canada's homebuilding rate to 500,000 homes per year through federal-municipal partnerships, calling housing a fundamental right.\n\nPierre Poilievre (Conservative) promised to remove the GST on all new homes under $1M and cut red tape, arguing government regulations are the core driver of unaffordability.\n\n**What this means for you:** Both leaders agree housing is in crisis — they disagree on whether the solution is more government investment or less government interference.",
  },
  {
    id: 2,
    topic: "Cost of Living",
    topicAccent: "#f97316",
    overlay: "rgba(67, 20, 7, 0.52)",
    thumb: THUMB_POILIEVRE,
    thumbPosition: "60% center",
    startSeconds: 1690,  // 28:10
    durationSeconds: 388, // 6m 28s
    timestamp: "28:10 – 34:38",
    duration: "6m 28s",
    title: "Axe the Tax — Carbon Pricing and the Cost of Living Crisis",
    matchedInterest: "Cost of Living",
    caption: '"Canadians cannot afford to heat their homes. Axe the carbon tax, build the pipelines, bring it home."',
    captionSpeaker: "Pierre Poilievre, Conservative Party",
    likes: "51.7k",
    bullets: [
      "Poilievre promises to eliminate the federal carbon tax on day one in office.",
      "Carney defends carbon pricing as essential for Canada's climate commitments.",
      "Key dispute: whether the carbon rebate actually leaves most Canadians better off.",
    ],
    leftView:
      "The carbon price is working — emissions are falling and most Canadians get more back than they pay. Scrapping it would set back climate progress by a decade.",
    rightView:
      "The carbon tax is a tax on everything — heating, fuel, groceries. Ordinary Canadians shouldn't bear the burden of a policy that's costing us our competitiveness.",
    chatResponse:
      "**Carbon Tax & Cost of Living — 28:10 to 34:38**\n\nPierre Poilievre (Conservative) promised to eliminate the federal carbon tax on day one, arguing it drives up the cost of heating, groceries, and fuel for ordinary Canadians.\n\nMark Carney (Liberal) defended carbon pricing as non-negotiable for meeting climate targets, pointing to the rebate that returns money to households.\n\n**What this means for you:** The carbon tax costs the average Canadian household ~$700/year before the rebate. The PBO found most households come out ahead — but that varies significantly by province and income.",
  },
  {
    id: 3,
    topic: "US Relations",
    topicAccent: "#ef4444",
    overlay: "rgba(69, 10, 10, 0.52)",
    thumb: THUMB_CARNEY,
    thumbPosition: "40% center",
    startSeconds: 2755,  // 45:55
    durationSeconds: 395, // 6m 35s
    timestamp: "45:55 – 52:30",
    duration: "6m 35s",
    title: "Standing Up to Trump — Canada's Response to US Trade Threats",
    matchedInterest: "US Relations",
    caption: '"Canada is not for sale. Not now, not ever. We will defend our sovereignty."',
    captionSpeaker: "Mark Carney, Liberal Party",
    likes: "62.3k",
    bullets: [
      "Both leaders condemn Trump's tariffs but differ sharply on how to respond.",
      "Carney favours retaliatory tariffs and rebuilding alliances with European partners.",
      "Poilievre argues a stronger economy — not more government — is the best defence.",
    ],
    leftView:
      "Canada must respond with coordinated retaliatory tariffs and deepen ties with European allies. Economic coercion from the US demands a firm, unified response.",
    rightView:
      "The best way to counter US pressure is to make Canada so economically strong that threats lose their sting — through lower taxes, less regulation, more energy.",
    chatResponse:
      "**US Tariffs & Canadian Sovereignty — 45:55 to 52:30**\n\nMark Carney (Liberal) called for retaliatory tariffs matching US measures dollar-for-dollar and pledged to deepen trade ties with European partners, framing this as an existential moment for Canadian sovereignty.\n\nPierre Poilievre (Conservative) agreed tariffs are unjust but argued the response should be building a stronger Canadian economy — more pipelines, lower taxes, less dependence on the US.\n\n**What this means for you:** Canada sends ~75% of its exports to the US. Carney wants to diversify quickly via government action; Poilievre believes deregulation and energy independence are the long-term answer.",
  },
  {
    id: 4,
    topic: "Healthcare",
    topicAccent: "#10b981",
    overlay: "rgba(6, 46, 30, 0.52)",
    thumb: THUMB_POILIEVRE,
    thumbPosition: "30% center",
    startSeconds: 3734,  // 1:02:14
    durationSeconds: 396, // 6m 36s
    timestamp: "1:02:14 – 1:08:50",
    duration: "6m 36s",
    title: "Healthcare Wait Times — A System Under Pressure",
    matchedInterest: "Healthcare",
    caption: '"No Canadian should wait 28 hours in an emergency room. We need to bring doctors home."',
    captionSpeaker: "Jagmeet Singh, NDP",
    likes: "29.8k",
    bullets: [
      "NDP proposes national pharmacare and bringing internationally trained doctors home.",
      "Liberals commit to $25B in new health transfers tied to provincial wait-time targets.",
      "Conservatives say publishing provincial outcomes will drive accountability and reform.",
    ],
    leftView:
      "Canada's healthcare crisis demands more federal investment and a universal pharmacare program — not cost-cutting that leaves provinces to fend for themselves.",
    rightView:
      "Provincial governments need more flexibility, not more federal strings. Transparency, competition, and private delivery options will cut wait times faster than spending.",
    chatResponse:
      "**Healthcare Wait Times — 1:02:14 to 1:08:50**\n\nJagmeet Singh (NDP) pushed for national pharmacare, dental care expansion, and fast-tracking internationally trained doctors — calling the status quo a system in crisis.\n\nMark Carney (Liberal) committed to $25B in new federal health transfers but tied them to provinces meeting wait-time benchmarks.\n\nPierre Poilievre (Conservative) argued transparency and publishing provincial outcomes would create accountability and drive improvement without new federal conditions.\n\n**What this means for you:** The average Canadian waits 27.4 weeks for specialist treatment. All three parties acknowledge the problem — but disagree on whether money, standards, or market competition is the fix.",
  },
]

const ALL_INTERESTS = [
  "Housing",
  "Cost of Living",
  "Healthcare",
  "US Relations",
  "Climate",
  "Education",
  "Indigenous Rights",
  "Immigration",
  "Gun Policy",
  "Quebec / Unity",
]

const LOADING_STEPS = [
  "Transcribing audio…",
  "Identifying key policy moments…",
  "Matching to your interests…",
  "Generating balanced summaries…",
]
const STEP_DURATION = 1800

type Stage = "input" | "loading" | "results"

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [stage, setStage] = useState<Stage>("input")
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Housing", "Cost of Living", "Healthcare"])
  const [loadingStep, setLoadingStep] = useState(0)

  function toggleInterest(i: string) {
    setSelectedInterests((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
  }

  function handleAnalyze() {
    setStage("loading")
    setLoadingStep(0)
    LOADING_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setLoadingStep(i)
        if (i === LOADING_STEPS.length - 1) setTimeout(() => setStage("results"), STEP_DURATION)
      }, i * STEP_DURATION)
    })
  }

  if (stage === "results") {
    return <TikTokFeed clips={MOCK_CLIPS} onBack={() => setStage("input")} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-serif text-lg italic">
            <span className="text-blue-700">Civic</span>Brief
          </Link>
          <Button size="sm" className="rounded-full bg-blue-700 text-white hover:bg-blue-800 px-4">
            Sign up free
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* ── INPUT ── */}
        {stage === "input" && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-serif text-3xl md:text-4xl mb-3">
                Get your personalized Canadian political brief
              </h1>
              <p className="text-muted-foreground">
                Paste a debate link, pick your issues, and we&apos;ll clip what matters to you.
              </p>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <label className="text-sm font-medium block mb-2">Debate or video link</label>
              <div className="flex items-center gap-3 border rounded-xl px-4 py-3 bg-gray-50">
                <svg className="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                </svg>
                <span className="text-sm text-gray-700">youtube.com/watch?v=vzpgOhTEgbE</span>
              </div>

              {/* Detected video — shows thumbnail */}
              <div className="mt-3 flex items-center gap-3 p-3 bg-gray-50 border rounded-xl">
                <div
                  className="w-20 h-12 rounded-lg bg-gray-200 shrink-0 overflow-hidden relative"
                  style={{
                    backgroundImage: `url(${YT_THUMB})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" fill="currentColor" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    Poilievre vs. Carney — 2025 Federal Leaders&apos; Debate
                  </p>
                  <p className="text-xs text-muted-foreground">Global News · April 2025 · 2h 4m</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium">What issues matter most to you?</label>
                <span className="text-xs text-muted-foreground">{selectedInterests.length} selected</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                We&apos;ll surface the debate moments most relevant to your life.
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_INTERESTS.map((interest) => {
                  const active = selectedInterests.includes(interest)
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 text-sm rounded-full border transition-all ${
                        active
                          ? "bg-blue-700 text-white border-blue-700"
                          : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-700"
                      }`}
                    >
                      {interest}
                    </button>
                  )
                })}
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={selectedInterests.length === 0}
              className="w-full rounded-xl bg-blue-700 text-white hover:bg-blue-800 py-6 text-base font-medium disabled:opacity-50"
            >
              Analyze Debate →
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Free to use · No account required · Nonpartisan AI summaries
            </p>
          </div>
        )}

        {/* ── LOADING ── */}
        {stage === "loading" && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-700 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl">🎬</span>
              </div>
            </div>
            <div className="text-center">
              <h2 className="font-serif text-2xl mb-2">Building your brief…</h2>
              <p className="text-muted-foreground text-sm">Analyzing 2h 4m of debate footage</p>
            </div>
            <div className="w-full max-w-sm space-y-3">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                      loadingStep > i
                        ? "bg-green-500"
                        : loadingStep === i
                        ? "bg-blue-700 animate-pulse"
                        : "bg-gray-200"
                    }`}
                  >
                    {loadingStep > i ? (
                      <CheckCircle className="w-3 h-3 text-white" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors ${
                      loadingStep >= i ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full max-w-sm bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-700 h-1.5 rounded-full transition-all duration-[1600ms] ease-linear"
                style={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// ─── TikTok Feed ──────────────────────────────────────────────────────────────

function TikTokFeed({ clips, onBack }: { clips: typeof MOCK_CLIPS; onBack: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedView, setExpandedView] = useState<Record<number, "left" | "right" | null>>({})
  const [playingClip, setPlayingClip] = useState<(typeof MOCK_CLIPS)[0] | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleScroll() {
    if (!containerRef.current) return
    const idx = Math.round(containerRef.current.scrollTop / window.innerHeight)
    if (idx !== activeIndex) {
      setActiveIndex(idx)
      setExpandedView({})
    }
  }

  function scrollTo(idx: number) {
    containerRef.current?.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" })
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="fixed inset-0 overflow-y-scroll snap-y snap-mandatory bg-black"
        style={{ scrollbarWidth: "none" } as React.CSSProperties}
      >
        {clips.map((clip, index) => (
          <ClipFeedCard
            key={clip.id}
            clip={clip}
            index={index}
            total={clips.length}
            isActive={activeIndex === index}
            expandedView={expandedView[clip.id] ?? null}
            onToggleView={(side) =>
              setExpandedView((prev) => ({
                ...prev,
                [clip.id]: prev[clip.id] === side ? null : side,
              }))
            }
            onWatchClip={() => setPlayingClip(clip)}
            onBack={onBack}
            onScrollDown={() => scrollTo(index + 1)}
            onScrollUp={() => scrollTo(index - 1)}
          />
        ))}
      </div>

      {playingClip && <VideoPlayerModal clip={playingClip} onClose={() => setPlayingClip(null)} />}
    </>
  )
}

// ─── Feed Card ────────────────────────────────────────────────────────────────

function ClipFeedCard({
  clip,
  index,
  total,
  isActive,
  expandedView,
  onToggleView,
  onWatchClip,
  onBack,
  onScrollDown,
  onScrollUp,
}: {
  clip: (typeof MOCK_CLIPS)[0]
  index: number
  total: number
  isActive: boolean
  expandedView: "left" | "right" | null
  onToggleView: (side: "left" | "right") => void
  onWatchClip: () => void
  onBack: () => void
  onScrollDown: () => void
  onScrollUp: () => void
}) {
  const [progressStarted, setProgressStarted] = useState(false)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    if (isActive) {
      const t = setTimeout(() => setProgressStarted(true), 80)
      return () => clearTimeout(t)
    } else {
      setProgressStarted(false)
      setChatOpen(false)
    }
  }, [isActive])

  return (
    <div className="relative w-full snap-start flex-shrink-0" style={{ height: "100dvh" }}>

      {/* ── Background: provided photo, fallback to YT thumbnail ── */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `url(${clip.thumb}), url(${YT_THUMB})`,
          backgroundSize: "cover",
          backgroundPosition: clip.thumbPosition,
        }}
      />

      {/* Colour-tinted overlay per clip topic */}
      <div className="absolute inset-0" style={{ backgroundColor: clip.overlay }} />

      {/* Vignette: dark at top + bottom for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/50 pointer-events-none" />

      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-5 pb-2 z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-white/80 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> My Brief
        </button>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === index ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="font-serif text-sm italic text-white/80">
          <span className="text-white">Civic</span>Brief
        </div>
      </div>

      {/* ── Right action buttons ── */}
      <div className="absolute right-3 flex flex-col items-center gap-5 z-10" style={{ bottom: "148px" }}>
        <ActionBtn
          icon={<Heart className={`w-6 h-6 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />}
          label={liked ? "♥" : clip.likes}
          onClick={() => setLiked((p) => !p)}
        />
        <ActionBtn
          icon={<Bookmark className={`w-6 h-6 ${saved ? "fill-white" : ""} text-white`} />}
          label={saved ? "Saved" : "Save"}
          onClick={() => setSaved((p) => !p)}
        />
        <ActionBtn icon={<Share2 className="w-6 h-6 text-white" />} label="Share" onClick={() => {}} />
        <ActionBtn
          icon={<span className="text-2xl leading-none">🔴</span>}
          label="Liberal"
          onClick={() => onToggleView("left")}
          active={expandedView === "left"}
          activeColor="text-red-300"
        />
        <ActionBtn
          icon={<span className="text-2xl leading-none">🔵</span>}
          label="Conserv."
          onClick={() => onToggleView("right")}
          active={expandedView === "right"}
          activeColor="text-blue-300"
        />
        <ActionBtn
          icon={<MessageCircle className="w-6 h-6 text-white" />}
          label="Ask AI"
          onClick={() => { setChatOpen(true) }}
          active={chatOpen}
          activeColor="text-yellow-300"
        />
      </div>

      {/* Up / Down hints */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-25 z-10">
        {index > 0 && (
          <button onClick={onScrollUp} className="text-white">
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
        {index < total - 1 && (
          <button onClick={onScrollDown} className="text-white">
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ── Centre: quote caption (only when no sheet open) ── */}
      {!expandedView && (
        <div
          className="absolute left-4 right-20 flex justify-center z-10 pointer-events-none"
          style={{ top: "32%" }}
        >
          <div className="bg-black/55 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-sm text-center">
            <p className="text-white/90 text-sm italic leading-relaxed">{clip.caption}</p>
            <p className="text-white/50 text-xs mt-1.5">— {clip.captionSpeaker}</p>
          </div>
        </div>
      )}

      {/* ── Bottom info ── */}
      <div className="absolute bottom-0 left-0 right-20 px-4 pb-7 z-10">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="px-2.5 py-0.5 text-xs rounded-full font-semibold text-white"
            style={{ backgroundColor: clip.topicAccent }}
          >
            {clip.topic.toUpperCase()}
          </span>
          <span className="text-white/55 text-xs">
            {clip.timestamp} · {clip.duration}
          </span>
        </div>

        <h2 className="text-white font-bold text-lg leading-snug mb-1">{clip.title}</h2>

        <p className="text-xs mb-3" style={{ color: clip.topicAccent }}>
          ⭐ Matched your interest in <strong>{clip.matchedInterest}</strong>
        </p>

        <ul className="space-y-1 mb-4">
          {clip.bullets.map((b, i) => (
            <li key={i} className="text-white/80 text-sm flex gap-2 leading-snug">
              <span className="shrink-0 mt-0.5 opacity-50">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Watch clip button */}
        <button
          onClick={onWatchClip}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white border border-white/30 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          Watch clip
        </button>
      </div>

      {/* ── Perspective bottom sheet ── */}
      {expandedView && (
        <div
          className="absolute bottom-0 left-0 right-0 rounded-t-3xl px-5 pt-5 pb-8 z-20"
          style={{
            background:
              expandedView === "left"
                ? "linear-gradient(to top, rgba(153,27,27,0.97), rgba(185,28,28,0.92))"
                : "linear-gradient(to top, rgba(30,64,175,0.97), rgba(29,78,216,0.92))",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-semibold text-sm">
              {expandedView === "left"
                ? "🔴 Liberal perspective"
                : "🔵 Conservative perspective"}
            </span>
            <button
              onClick={() => onToggleView(expandedView)}
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-white text-sm leading-relaxed mb-3">
            {expandedView === "left" ? clip.leftView : clip.rightView}
          </p>
          <p className="text-white/45 text-xs">
            CivicBrief presents both perspectives without endorsing either. Form your own opinion.
          </p>
        </div>
      )}

      {/* ── Chat panel ── */}
      {chatOpen && (
        <ChatPanel
          clip={clip}
          onClose={() => setChatOpen(false)}
        />
      )}

      {/* ── Thin progress bar ── */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/15 z-10">
        <div
          className="h-full rounded-full"
          style={{
            width: progressStarted ? "100%" : "0%",
            backgroundColor: clip.topicAccent,
            transition: progressStarted ? "width 20s linear" : "none",
          }}
        />
      </div>
    </div>
  )
}

// ─── Chat Panel ──────────────────────────────────────────────────────────────

function ChatPanel({
  clip,
  onClose,
}: {
  clip: (typeof MOCK_CLIPS)[0]
  onClose: () => void
}) {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([])
  const [typing, setTyping] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput("")
    setMessages((prev) => [...prev, { role: "user", text }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { role: "ai", text: clip.chatResponse }])
    }, 1200)
  }

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, typing])

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-3xl overflow-hidden"
      style={{ maxHeight: "72dvh", background: "rgba(10,10,20,0.96)", backdropFilter: "blur(20px)" }}
      onTouchMove={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">CB</span>
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-none">CivicBrief AI</p>
            <p className="text-white/40 text-xs mt-0.5">{clip.topic} · {clip.timestamp}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        onScroll={(e) => e.stopPropagation()}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        style={{ scrollbarWidth: "none" }}
      >
        {messages.length === 0 && (
          <p className="text-white/40 text-sm text-center py-6">Ask a question about this clip</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                <span className="text-white text-xs font-bold">CB</span>
              </div>
            )}
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white/10 text-white/90 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mr-2 mt-0.5">
              <span className="text-white text-xs font-bold">CB</span>
            </div>
            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-5 pt-2 shrink-0 border-t border-white/10">
        <div className="flex items-center gap-2 bg-white/10 rounded-2xl px-4 py-2.5">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about this clip…"
            autoFocus
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/35 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-7 h-7 rounded-full bg-blue-600 disabled:bg-white/20 flex items-center justify-center transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        <p className="text-white/25 text-xs text-center mt-2">AI summaries are for information only — always verify with primary sources.</p>
      </div>
    </div>
  )
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionBtn({
  icon,
  label,
  onClick,
  active = false,
  activeColor = "",
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
  activeColor?: string
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
          active ? "bg-white/30 ring-2 ring-white/40" : "bg-white/15 hover:bg-white/25"
        }`}
      >
        {icon}
      </div>
      <span className={`text-xs ${active ? activeColor || "text-white" : "text-white/70"}`}>{label}</span>
    </button>
  )
}

// ─── Video Player Modal ───────────────────────────────────────────────────────

function VideoPlayerModal({
  clip,
  onClose,
}: {
  clip: (typeof MOCK_CLIPS)[0]
  onClose: () => void
}) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setIsPlaying(false)
            return 100
          }
          return p + 100 / (clip.durationSeconds * 2)
        })
      }, 500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, clip.durationSeconds])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === " ") {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const elapsed = Math.floor((progress / 100) * clip.durationSeconds)
  const currentTime = formatSeconds(clip.startSeconds + elapsed)
  const remaining = clip.durationSeconds - elapsed

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black">
        {/* Video area */}
        <div
          className="relative w-full cursor-pointer select-none"
          style={{ aspectRatio: "16/9" }}
          onClick={() => setIsPlaying((p) => !p)}
        >
          {/* Real thumbnail as background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${YT_THUMB})`,
              backgroundSize: "cover",
              backgroundPosition: clip.thumbPosition,
            }}
          />

          {/* Topic-tinted overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: clip.overlay }} />

          {/* Top gradient */}
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />
          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 text-xs rounded font-bold text-white"
                style={{ backgroundColor: clip.topicAccent }}
              >
                {clip.topic.toUpperCase()}
              </span>
              <span className="text-white/70 text-xs">2025 Canadian Federal Leaders&apos; Debate</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
              className="w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Play/pause overlay */}
          {!isPlaying && progress < 100 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          )}

          {progress >= 100 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40">
              <p className="text-white/80 text-sm">Clip ended</p>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setProgress(0)
                  setIsPlaying(true)
                }}
                className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-full border border-white/20 transition-colors"
              >
                <Play className="w-4 h-4" fill="currentColor" /> Replay
              </button>
            </div>
          )}

          {/* Caption */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
            <div className="bg-black/70 rounded-lg px-4 py-2 max-w-xl text-center">
              <p className="text-white text-sm italic leading-relaxed">{clip.caption}</p>
              <p className="text-gray-400 text-xs mt-1">— {clip.captionSpeaker}</p>
            </div>
          </div>

          {/* Current time */}
          <div className="absolute top-12 right-4">
            <span className="text-white/60 text-xs tabular-nums bg-black/30 px-1.5 py-0.5 rounded">
              {currentTime}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-950 px-4 pt-3 pb-4">
          {/* Scrubber */}
          <div className="relative h-1 bg-white/20 rounded-full mb-3 cursor-pointer group">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: clip.topicAccent }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (progress >= 100) {
                  setProgress(0)
                  setIsPlaying(true)
                } else {
                  setIsPlaying((p) => !p)
                }
              }}
              className="w-8 h-8 flex items-center justify-center text-white hover:text-blue-400 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" fill="currentColor" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
              )}
            </button>
            <Volume2 className="w-4 h-4 text-white/60" />
            <div className="w-20 h-1 bg-white/20 rounded-full">
              <div className="w-3/4 h-full bg-white/60 rounded-full" />
            </div>
            <div className="flex-1" />
            <span className="text-white/60 text-xs tabular-nums">
              {currentTime} / {formatSeconds(clip.startSeconds + clip.durationSeconds)}
            </span>
            <span className="text-white/35 text-xs">−{formatSeconds(remaining)}</span>
            <Maximize className="w-4 h-4 text-white/60 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>

        {/* Info bar */}
        <div className="bg-gray-900 px-4 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{clip.title}</p>
            <p className="text-gray-400 text-xs mt-0.5">
              {clip.timestamp} · {clip.duration} · 2025 Canadian Federal Leaders&apos; Debate
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-xs text-gray-400 hover:text-white border border-gray-700 rounded-full px-3 py-1 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSeconds(s: number): string {
  s = Math.max(0, Math.floor(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`
}
