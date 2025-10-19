"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Translations } from "@/lib/translations"

interface GoalItem {
  readonly icon: string
  readonly title: string
  readonly description: string
}

interface GoalsProps {
  t: Translations
}

export function Goals({ t }: GoalsProps) {
  const ref = useScrollAnimation()
  
  // Early return if no goals data
  if (!t.goals?.items?.length) {
    return (
      <section id="goals" className="relative min-h-screen flex items-center py-20 md:py-32 bg-[#EB5C7F]/10">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance animate-fade-in-up animate-in">
            {t.goals?.title || 'Our Goals'}
          </h2>
          <div className="text-center text-gray-600">Loading goals...</div>
        </div>
      </section>
    )
  }

  // Type-safe access to the readonly goals array
  const goals = t.goals.items

  return (
    <section id="goals" className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-[#EB5C7F]/10">
      <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance animate-fade-in-up animate-in">
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
                <CardTitle className="text-xl text-[#0066cc]">{goal.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{goal.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
