"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BureauYearCarousel } from "../carousels/BureauYearCarousel"
import type { Translations } from "@/lib/translations"
import teamData from "@/data/team.json"

interface PreviousBureauModalProps {
  isOpen: boolean
  onClose: () => void
  t: Translations
  language: 'en' | 'fr'
}

export function PreviousBureauModal({ isOpen, onClose, t, language }: PreviousBureauModalProps) {
  if (!isOpen) return null

  const bureaus = teamData.previousBureaus || []

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in animate-in">
          {/* Header */}
          <div className="sticky top-0 bg-primary text-primary-foreground p-6 flex items-center justify-between border-b">
            <h2 className="text-2xl font-bold">{t.team.previousBureausTitle}</h2>
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
            {bureaus && bureaus.length > 0 ? (
              <BureauYearCarousel bureaus={bureaus} />
            ) : (
              <p className="text-center text-muted-foreground py-8">{t.team.noPreviousBureaus}</p>
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
    </>
  )
}
