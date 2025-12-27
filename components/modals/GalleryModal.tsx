"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        // Lock scroll when modal opens
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "Escape") onClose();
            if (e.key === "Tab" && modalRef.current) {
                const focusables = Array.from(
                    modalRef.current.querySelectorAll<HTMLElement>(
                        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    )
                );
                if (!focusables.length) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement as HTMLElement | null;
                if (e.shiftKey) {
                    if (
                        active === first ||
                        !modalRef.current.contains(active)
                    ) {
                        e.preventDefault();
                        last.focus();
                    }
                } else if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
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
            role="dialog"
            aria-modal="true"
            aria-label="Gallery images"
            ref={modalRef}
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
                    ref={closeButtonRef}
                >
                    <X className="h-8 w-8 text-white" />
                </button>

                {/* Main image */}
                <Image
                    src={images[currentIndex]}
                    alt={`Gallery image ${currentIndex + 1}`}
                    width={1600}
                    height={900}
                    loading="lazy"
                    sizes="100vw"
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
