"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CarouselItem } from "@/lib/types"

interface CarouselProps {
  items: readonly CarouselItem[]
  renderItem: (item: CarouselItem, index: number) => React.ReactNode
  itemsPerSlide?: number
  showIndicators?: boolean
}

export function Carousel({ items, renderItem, itemsPerSlide = 3, showIndicators = true }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = Math.ceil(items.length / itemsPerSlide)

  // Reset to the first slide whenever the items or itemsPerSlide change
  // This ensures when the parent swaps the item array (e.g. switching years)
  // the carousel shows the first slide and navigation works predictably.
  useEffect(() => {
    setCurrentSlide(0)
  }, [items, itemsPerSlide])

  const goToPrevious = () => {
    setCurrentSlide((prev) => {
      const newSlide = prev === 0 ? totalSlides - 1 : prev - 1
      return newSlide
    })
  }

  const goToNext = () => {
    setCurrentSlide((prev) => {
      const newSlide = prev === totalSlides - 1 ? 0 : prev + 1
      return newSlide
    })
  }

  const startIndex = currentSlide * itemsPerSlide
  const visibleItems = items.slice(startIndex, startIndex + itemsPerSlide)

  return (
    <div className="space-y-6">
      {/* Carousel Items */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={goToPrevious}
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Previous slide"
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {/* Slide Indicators */}
        {showIndicators && (
          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-primary w-8" : "bg-primary/30 w-2"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        )}

        <Button
          onClick={goToNext}
          variant="default"
          size="icon"
          className="h-10 w-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label="Next slide"
          type="button"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
