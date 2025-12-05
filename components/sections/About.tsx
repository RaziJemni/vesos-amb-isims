"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { Translations } from "@/lib/translations"

interface AboutProps {
  t: Translations
}

export function About({ t }: AboutProps) {
  const ref = useScrollAnimation()

  return (
    <section id="about" className="min-h-screen flex items-center justify-center py- md:py-16 relative overflow-hidden bg-white">
      
      <div className="container px-4 relative">
        <div ref={ref} className="mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-balance animate-fade-in-up animate-in">
            {t.about.title}
          </h2>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl" />
            <div className="relative bg-background/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
              <p className="text-xl text-primary-dark leading-relaxed text-pretty mb-8">
                {t.about.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

