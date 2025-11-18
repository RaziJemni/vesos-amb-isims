"use client"

// no React hooks required here
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import type { Translations } from "@/lib/translations"
import type { Event } from "@/lib/types"
import eventsData from "@/data/events.json"
import { getLocalizedEvent } from "@/lib/translations"

interface EventsProps {
  t: Translations
  language: 'en' | 'fr'
}

export function Events({ t, language }: EventsProps) {
  // keep a simple click handler; modal implementation was removed earlier
  // removed unused previous events state
  const recentRef = useScrollAnimation()
  const upcomingRef = useScrollAnimation()

  const handleEventClick = (event: Event) => {
    // TODO: wire this to a details view or external link if needed
    console.log("Event clicked:", event)
  }

  return (
    <>
      <section id="events" className="py-20 md:py-32 relative bg-white">
        <div className="container px-4 relative">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance text-primary-dark animate-fade-in-up animate-in">
            {t.events.title}
          </h2>

          <div className="max-w-6xl mx-auto space-y-20">
            {/* Recent Events */}
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-medium text-primary-dark">
                  {t.events.recent}
                </h3>
              </div>
              <div ref={recentRef} className="grid gap-6 md:grid-cols-2 animate-stagger">
                {eventsData.recentEvents.map((event, index) => {
                  const localizedEvent = getLocalizedEvent(event, language)
                  return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(localizedEvent)}
                  >
                    {localizedEvent.image && (
                      <div className="w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                        <img
                          src={localizedEvent.image || "/placeholder.svg"}
                          alt={localizedEvent.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{localizedEvent.date}</span>
                      </div>
                      {localizedEvent.location && (
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{localizedEvent.location}</span>
                        </div>
                      )}
                      <CardTitle className="text-xl">{localizedEvent.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{localizedEvent.description}</p>
                      <p className="text-xs text-primary mt-3 font-medium">Click to view details</p>
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl md:text-2xl font-medium text-primary-dark">
                  {t.events.upcoming}
                </h3>
              </div>
              <div ref={upcomingRef} className="grid gap-6 md:grid-cols-2 animate-stagger">
                {eventsData.upcomingEvents.map((event, index) => {
                  const localizedEvent = getLocalizedEvent(event, language)
                  return (
                  <Card
                    key={index}
                    className="border-2 border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(localizedEvent)}
                  >
                    {localizedEvent.image && (
                      <div className="w-full aspect-[16/9] overflow-hidden bg-gray-200">
                        <img
                          src={localizedEvent.image || "/placeholder.svg"}
                          alt={localizedEvent.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">{localizedEvent.date}</span>
                      </div>
                      {localizedEvent.location && (
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{localizedEvent.location}</span>
                        </div>
                      )}
                      <CardTitle className="text-xl">{localizedEvent.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{localizedEvent.description}</p>
                      <p className="text-xs text-primary mt-3 font-medium">Click to view details & register</p>
                    </CardContent>
                  </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
