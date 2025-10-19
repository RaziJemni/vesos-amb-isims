"use client"

import { X, MapPin, Calendar, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { TranslationKey } from "@/lib/translations"

interface EventDetailModalProps {
  event: any
  isOpen: boolean
  onClose: () => void
  t: TranslationKey
}

export function EventDetailModal({ event, isOpen, onClose, t }: EventDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="sticky top-0 flex justify-end p-4 bg-white border-b">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Event image - optional */}
        {event.image && (
          <div className="w-full h-64 md:h-80 overflow-hidden">
            <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Event details */}
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{event.title}</h2>

            {/* Date and Location */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="h-5 w-5 text-secondary flex-shrink-0" />
                <span>{event.date}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Additional details - optional */}
          {event.details && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900">Details</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.details}</p>
            </div>
          )}

          {/* Gallery - optional */}
          {event.gallery && event.gallery.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.gallery.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${event.title} ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Registration link - optional, only for upcoming events */}
          {event.registrationLink && (
            <div className="pt-4 border-t">
              <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  Register for this event
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
