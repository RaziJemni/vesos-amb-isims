"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { EventDetailModal } from "../modals/EventDetailModal"
import { PreviousEventsModal } from "../modals/PreviousEventsModal"
import type { Translations } from "@/lib/translations"
import type { Event } from "@/lib/types"
import eventsData from "@/data/events.json"
import { getLocalizedEvent } from "@/lib/translations"

interface EventsProps {
  t: Translations
  language: 'en' | 'fr'
}

export function Events({ t, language }: EventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showPreviousEvents, setShowPreviousEvents] = useState(false)
  const recentRef = useScrollAnimation()
  const upcomingRef = useScrollAnimation()

  const handleEventClick = (event: Event) => {
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
                {eventsData.recentEvents.map((event, index) => {
                  const localizedEvent = getLocalizedEvent(event, language)
                  return (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(localizedEvent)}
                  >
                    {localizedEvent.image && (
                      <div className="w-full h-48 overflow-hidden bg-gray-200">
                        <img
                          src={localizedEvent.image || "/placeholder.svg"}
                          alt={localizedEvent.title}
                          className="w-full h-full object-cover"
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
              <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center animate-fade-in-up">
                {t.events.upcoming}
              </h3>
              <div ref={upcomingRef} className="grid gap-6 md:grid-cols-2 animate-stagger">
                {eventsData.upcomingEvents.map((event, index) => {
                  const localizedEvent = getLocalizedEvent(event, language)
                  return (
                  <Card
                    key={index}
                    className="border-2 border-primary/50 hover:shadow-lg transition-all duration-300 bg-primary/5 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(localizedEvent)}
                  >
                    {localizedEvent.image && (
                      <div className="w-full h-48 overflow-hidden bg-gray-200">
                        <img
                          src={localizedEvent.image || "/placeholder.svg"}
                          alt={localizedEvent.title}
                          className="w-full h-full object-cover"
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

      <PreviousEventsModal isOpen={showPreviousEvents} onClose={() => setShowPreviousEvents(false)} t={t} language={language} />
    </>
  )
}
