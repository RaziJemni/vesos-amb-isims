"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import type { Translations } from "@/lib/translations"

/**
 * About section component
 * Displays club information, mission, and background
 * Features scroll animations and responsive design
 */
interface AboutProps {
  t: Translations
}

export function About({ t }: AboutProps) {
  const ref = useScrollAnimation()

  return (
    <section id="about" className="min-h-screen flex items-center py-20 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/5" />
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container px-4 relative">
        <div ref={ref} className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-[2fr,3fr] gap-12 items-center">
            {/* Left side: Title and key points */}
            <div className="text-left space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance animate-fade-in-up animate-in">
                  {t.about.title}
                </h2>
                <div className="h-1 w-20 bg-primary mt-6 rounded-full" />
              </div>
              
              {/* Key points */}
              <div className="space-y-6 text-muted-foreground/90">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-1">Growth & Learning</h3>
                    <p className="text-sm leading-relaxed">Fostering personal and professional development through hands-on experiences.</p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-1">Community</h3>
                    <p className="text-sm leading-relaxed">Building a supportive network of like-minded students and professionals.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Main description with visual enhancement */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur" />
              <div className="relative bg-background shadow-xl rounded-lg p-8 space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">{t.about.description}</p>
                
                {/* Stats or highlights */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-muted">
                  <div>
                    <div className="text-3xl font-bold text-foreground">200+</div>
                    <div className="text-sm text-muted-foreground">Active Members</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">50+</div>
                    <div className="text-sm text-muted-foreground">Events Per Year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
