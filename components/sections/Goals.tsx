"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Translations } from "@/lib/translations"

interface GoalsProps {
  t: Translations
}

export function Goals({ t }: GoalsProps) {
  const ref = useScrollAnimation()
  
  // Early return if no goals data
  if (!t.goals?.items?.length) {
    return (
      <section id="goals" className="relative min-h-screen flex items-center py-20 md:py-32 bg-white">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance animate-fade-in-up animate-in text-primary-dark">
            {t.goals?.title || 'Our Goals'}
          </h2>
          <div className="text-center text-primary-dark">Loading goals...</div>
        </div>
      </section>
    )
  }

  // Type-safe access to the readonly goals array
  const goals = t.goals.items

  return (
    <section id="goals" className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-accent/30 text-primary-dark">
      {/* Top fade: fade from white (page) into the goals section */}
      <div className="absolute left-0 right-0 top-0 h-[8vh] pointer-events-none bg-gradient-to-b from-white to-transparent" />
      <div className="container px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance animate-fade-in-up animate-in text-primary-dark">
          {t.goals.title}
        </h2>
        <div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto animate-stagger">
          {goals.map((goal, index) => (
              <Card
              key={index}
              className="border-2 border-[#EB5C7F]/20 hover:border-[#EB5C7F] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white hover-scale"
            >
              <CardHeader>
                <div className="mb-4 text-4xl">{goal.icon}</div>
                <CardTitle className="text-xl text-primary-dark">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary-dark leading-relaxed">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Bottom fade: blend the goals section into the white section below */}
      <div className="absolute left-0 right-0 bottom-0 h-[8vh] pointer-events-none bg-gradient-to-b from-transparent to-white" />
    </section>
  )
}
