"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "What is Outchat.ai and how does it work?",
    answer:
      "Outchat.ai is a platform that allows you to create, train, and monetize your own AI chat assistant. You can customize it with your knowledge, brand it with your colors and logo, and sell access to your clients.",
  },
  {
    question: "How does Outchat.ai use my data to build a custom AI chat?",
    answer:
      "We use your uploaded files, documents, and website content to train your AI assistant. Your data is used exclusively to power your chat and is never shared with other users or used to train other models.",
  },
  {
    question: "How do I get started with Outchat.ai and what are the pricing options?",
    answer:
      "Getting started is easy - sign up, upload your knowledge base, customize your branding, and launch. We offer flexible pricing plans based on usage, with options for free trials and premium tiers.",
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">
              Frequently asked
              <br />
              questions
            </h2>
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
