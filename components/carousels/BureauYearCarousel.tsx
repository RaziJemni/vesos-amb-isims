"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BureauYearCarouselProps {
  bureaus: ReadonlyArray<{
    year: string
    members: ReadonlyArray<{ name: string; role: string; email?: string }>
  }>
}

export function BureauYearCarousel({ bureaus }: BureauYearCarouselProps) {
  const [selectedYear, setSelectedYear] = useState(0)

  const handlePrev = () => {
    setSelectedYear((prev) => (prev === 0 ? bureaus.length - 1 : prev - 1))
  }
  const handleNext = () => {
    setSelectedYear((prev) => (prev === bureaus.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Year Tabs */}
      <div className="flex gap-2 flex-wrap justify-center mb-4">
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

      {/* Members Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto py-2 pb-20">
        {bureaus[selectedYear].members.map((member, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow">
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
        ))}
      </div>

      {/* Arrow Buttons at Bottom Center */}
      <div className="absolute left-0 right-0 bottom-2 flex justify-center pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <Button
            onClick={handlePrev}
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleNext}
            variant="default"
            size="icon"
            className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label="Next year"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
