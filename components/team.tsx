"use client"

import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Instagram, Linkedin, History } from "lucide-react"
import { PreviousBureauModal } from "./previous-bureau-modal"
import type { TranslationKey } from "@/lib/translations"

interface TeamProps {
  t: TranslationKey
}

export function Team({ t }: TeamProps) {
  const ref = useScrollAnimation()
  const [showPreviousBureaus, setShowPreviousBureaus] = useState(false)

  return (
    <section id="team" className="py-20 md:py-32 bg-background">
      <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance text-primary animate-fade-in-up animate-in">
          {t.team.title}
        </h2>
        <div ref={ref} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto animate-stagger">
          {t.team.members.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-primary hover-lift"
            >
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                <img
                  src={`/placeholder.svg?height=400&width=400&query=professional+headshot`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-1 text-primary">{member.name}</h3>
                  <p className="text-muted-foreground font-medium">{member.role}</p>
                </div>

                <div className="space-y-3 border-t pt-4">
                  {member.email && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-secondary flex-shrink-0" />
                      <a
                        href={`mailto:${member.email}`}
                        className="text-muted-foreground hover:text-primary transition-colors truncate"
                        title={member.email}
                      >
                        {member.email}
                      </a>
                    </div>
                  )}

                  {(member.instagram || member.linkedin) && (
                    <div className="flex justify-center gap-3 pt-2">
                      {member.instagram && (
                        <a
                          href={member.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-secondary text-white rounded-full flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300 flex-shrink-0"
                          title="Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-secondary text-white rounded-full flex items-center justify-center hover:opacity-80 hover:scale-110 transition-all duration-300 flex-shrink-0"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button
            onClick={() => setShowPreviousBureaus(true)}
            variant="outline"
            size="lg"
            className="gap-2 border-primary text-primary hover:bg-primary/10"
          >
            <History className="h-5 w-5" />
            {t.team.viewPreviousBureaus}
          </Button>
        </div>
      </div>

      <PreviousBureauModal isOpen={showPreviousBureaus} onClose={() => setShowPreviousBureaus(false)} t={t} />
    </section>
  )
}
