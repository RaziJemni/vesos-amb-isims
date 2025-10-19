"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel } from "./carousel"
import type { TranslationKey } from "@/lib/translations"

interface PreviousBureauModalProps {
  isOpen: boolean
  onClose: () => void
  t: TranslationKey
}

export function PreviousBureauModal({ isOpen, onClose, t }: PreviousBureauModalProps) {
  const [selectedYear, setSelectedYear] = useState(0)

  if (!isOpen) return null

  const bureaus = t.team.previousBureaus || []

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
              <div className="space-y-8">
                {/* Year Tabs */}
                <div className="flex gap-2 flex-wrap">
                  {bureaus.map((bureau, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedYear(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedYear === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {bureau.year}
                    </button>
                  ))}
                </div>

                {/* Carousel for Selected Year */}
                {bureaus[selectedYear] && (
                  <Carousel
                    items={bureaus[selectedYear].members}
                    itemsPerSlide={3}
                    renderItem={(member) => (
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-primary mb-1">{member.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="text-xs text-secondary hover:underline block truncate"
                              title={member.email}
                            >
                              {member.email}
                            </a>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  />
                )}
              </div>
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
