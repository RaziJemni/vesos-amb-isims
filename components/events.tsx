"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { EventDetailModal } from "./event-detail-modal"
import { PreviousEventsModal } from "./previous-events-modal"
import type { TranslationKey } from "@/lib/translations"

interface EventsProps {
  t: TranslationKey
}

export function Events({ t }: EventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPreviousEvents, setShowPreviousEvents] = useState(false)
  const recentRef = useScrollAnimation()
  const upcomingRef = useScrollAnimation()

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  return (
    <>
      <section id="events" className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 text-balance animate-fade-in-up animate-in">
            {t.events.title}
          </h2>

          <div className="max-w-6xl mx-auto space-y-16">
            {/* Recent Events */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center animate-fade-in-up">
                {t.events.recent}
              </h3>
              <div ref={recentRef} className="grid gap-6 md:grid-cols-2 animate-stagger">
                {t.events.recentEvents.map((event, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(event)}
                  >
                    {event.image && (
                      <div className="w-full h-48 overflow-hidden bg-gray-200">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                      <p className="text-xs text-primary mt-3 font-medium">Click to view details</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center animate-fade-in-up">
                {t.events.upcoming}
              </h3>
              <div ref={upcomingRef} className="grid gap-6 md:grid-cols-2 animate-stagger">
                {t.events.upcomingEvents.map((event, index) => (
                  <Card
                    key={index}
                    className="border-2 border-primary/50 hover:shadow-lg transition-all duration-300 bg-primary/5 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(event)}
                  >
                    {event.image && (
                      <div className="w-full h-48 overflow-hidden bg-gray-200">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm font-medium">{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-primary mb-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{event.location}</span>
                        </div>
                      )}
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                      <p className="text-xs text-primary mt-3 font-medium">Click to view details & register</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <Button
            onClick={() => setShowPreviousEvents(true)}
            variant="outline"
            size="lg"
            className="gap-2 border-primary text-primary hover:bg-primary/10"
          >
            See More Previous Events
          </Button>
        </div>
      </section>

      {selectedEvent && (
        <EventDetailModal event={selectedEvent} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} t={t} />
      )}

      <PreviousEventsModal isOpen={showPreviousEvents} onClose={() => setShowPreviousEvents(false)} t={t} />
    </>
  )
}
