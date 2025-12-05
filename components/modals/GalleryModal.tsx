"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryModalProps {
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}

export default function GalleryModal({
    images,
    initialIndex = 0,
    onClose,
}: GalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        // Lock scroll when modal opens
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = "unset";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentIndex, onClose]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
                    aria-label="Close"
                >
                    <X className="h-8 w-8 text-white" />
                </button>

                {/* Main image */}
                <img
                    src={images[currentIndex]}
                    alt={`Gallery image ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                />

                {/* Previous button */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 p-3 hover:bg-white/20 rounded-full transition-colors"
                    aria-label="Previous image"
                    disabled={images.length <= 1}
                >
                    <ChevronLeft className="h-8 w-8 text-white" />
                </button>

                {/* Next button */}
                <button
                    onClick={goToNext}
                    className="absolute right-4 p-3 hover:bg-white/20 rounded-all transition-colors"
                    aria-label="Next image"
                    disabled={images.length <= 1}
                >
                    <ChevronRight className="h-8 w-8 text-white" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}
