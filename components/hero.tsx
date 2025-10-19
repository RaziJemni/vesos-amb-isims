"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { TranslationKey } from "@/lib/translations"

interface HeroProps {
  t: TranslationKey
}

export function Hero({ t }: HeroProps) {
  const scrollToJoin = () => {
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary text-primary-foreground">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in-up animate-in">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="pt-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={scrollToJoin}
              className="gap-2 text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              {t.hero.cta}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
