"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "Is the summary biased toward one political party?",
    answer:
      "No. CivicBrief is deliberately nonpartisan. Every clip summary presents what each candidate actually said, in their own words, without editorial framing. We show both the left-leaning and right-leaning perspective side by side so you can form your own opinion.",
  },
  {
    question: "What types of videos does CivicBrief support?",
    answer:
      "We support presidential debates, vice-presidential debates, Senate and House hearings, town halls, press conferences, and major political speeches from YouTube, C-SPAN, and most major news network embed links. If the video has audio, we can analyze it.",
  },
  {
    question: "How does CivicBrief personalize results to me?",
    answer:
      "When you set up your profile, you select the policy areas that affect your daily life — such as healthcare costs, housing, student debt, or immigration. Our AI ranks and filters the debate clips so the most relevant moments for your interests appear first.",
  },
  {
    question: "Will you store or share my political interests?",
    answer:
      "Your interest profile is stored only to personalize your experience and is never sold or shared with third parties, advertisers, or political campaigns. You can delete your profile at any time.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">
              Frequently asked
              <br />
              questions
            </h2>
            <p className="mt-4 text-muted-foreground text-sm">
              Have more questions?{" "}
              <a href="#" className="underline hover:text-foreground">
                Contact us
              </a>
            </p>
          </div>
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index} className="border-t">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between py-5 text-left"
                >
                  <span className="text-sm pr-4">{faq.question}</span>
                  <Plus
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${openIndex === index ? "rotate-45" : ""}`}
                  />
                </button>
                {openIndex === index && <div className="pb-5 text-sm text-muted-foreground">{faq.answer}</div>}
              </div>
            ))}
            <div className="border-t" />
          </div>
        </div>
      </div>
    </section>
  )
}
