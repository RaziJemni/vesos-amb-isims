"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import { Carousel } from "./carousel"
import { EventDetailModal } from "./event-detail-modal"
import { useState } from "react"
import type { TranslationKey } from "@/lib/translations"

interface PreviousEventsModalProps {
  isOpen: boolean
  onClose: () => void
  t: TranslationKey
}

export function PreviousEventsModal({ isOpen, onClose, t }: PreviousEventsModalProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  if (!isOpen) return null

  const previousEvents = t.events.previousEvents || []

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsDetailModalOpen(true)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in animate-in">
          {/* Header */}
          <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex items-center justify-between border-b">
            <h2 className="text-2xl font-bold">Previous Events</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {previousEvents && previousEvents.length > 0 ? (
              <Carousel
                items={previousEvents}
                itemsPerSlide={2}
                renderItem={(event) => (
                  <Card
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden hover-lift"
                    onClick={() => handleEventClick(event)}
                  >
                    {event.image && (
                      <div className="w-full h-40 overflow-hidden bg-gray-200">
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
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{event.description}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                      >
                        More Details
                      </Button>
                    </CardContent>
                  </Card>
                )}
              />
            ) : (
              <p className="text-center text-muted-foreground py-8">No previous events to display</p>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-muted p-6 border-t flex justify-end">
            <Button onClick={onClose} variant="default">
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          t={t}
        />
      )}
    </>
  )
}
