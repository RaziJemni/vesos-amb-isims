"use client"

// no useState required here
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Instagram, Linkedin } from "lucide-react"
import type { Translations } from "@/lib/translations"
import teamData from "@/data/team.json"
import { getLocalizedRole } from "@/lib/translations"

interface TeamProps {
  t: Translations
  language: 'en' | 'fr'
}

export function Team({ t, language }: TeamProps) {
  const ref = useScrollAnimation()
  // removed unused previous bureaus state

  return (
    <section id="team" className="py-20 md:py-32 relative bg-white">
      <div className="container px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance text-primary-dark animate-fade-in-up animate-in">
          {t.team.title}
        </h2>
        <div ref={ref} className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto animate-stagger">
          {teamData.currentBureau.members.map((member, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-t-4 border-t-primary hover-lift"
            >
              <div className="relative w-full h-[350px] bg-gradient-to-br from-primary/10 to-secondary/10">
                <img
                  src={`${member.image}?w=400&h=500&fit=crop&auto=format&dpr=2`}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold mb-1 text-primary">{member.name}</h3>
                  <p className="text-muted-foreground font-medium">{getLocalizedRole(member, language)}</p>
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
      </div>
    </section>
  )
}
