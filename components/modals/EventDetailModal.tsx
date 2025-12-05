"use client";

import { useEffect, useRef, useState } from "react";
import { X, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import GalleryModal from "@/components/modals/GalleryModal";
import type { Language } from "@/lib/translations";
import type { Event } from "@/lib/types";

interface EventDetailModalProps {
    event: Event;
    language: Language;
    onClose: () => void;
}

export default function EventDetailModal({
    event,
    language,
    onClose,
}: EventDetailModalProps) {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!event) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key !== "Tab" || !modalRef.current) return;
            const focusables = Array.from(
                modalRef.current.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
                )
            );
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;
            if (e.shiftKey) {
                if (active === first || !modalRef.current.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (active === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [event, onClose]);

    if (!event) return null;

    const title =
        language === "fr"
            ? event.titleFr || event.title
            : language === "ar"
            ? (event as any).titleAr || event.titleFr || event.title
            : event.title;
    const description =
        language === "fr"
            ? event.descriptionFr || event.description
            : language === "ar"
            ? (event as any).descriptionAr ||
              event.descriptionFr ||
              event.description
            : event.description;
    const location =
        language === "fr"
            ? event.locationFr || event.location
            : language === "ar"
            ? (event as any).locationAr || event.locationFr || event.location
            : event.location;
    const details =
        language === "fr"
            ? event.detailsFr || event.details
            : language === "ar"
            ? (event as any).detailsAr || event.detailsFr || event.details
            : event.details;

    // Build full gallery including main image at the beginning
    const fullGallery = event.image
        ? [event.image, ...(event.gallery || [])]
        : event.gallery || [];

    const handleImageClick = (index: number) => {
        setGalleryIndex(index);
        setGalleryOpen(true);
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="event-detail-title"
                    ref={modalRef}
                >
                    {/* Close button */}
                    <div className="sticky top-0 flex justify-end p-4 bg-white border-b">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close"
                            ref={closeButtonRef}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Event image - optional */}
                    {event.image && (
                        <div
                            className="w-full h-64 md:h-80 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImageClick(0)}
                        >
                            <img
                                src={event.image || "/placeholder.svg"}
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Event details */}
                    <div className="p-6 md:p-8 space-y-6">
                        <div>
                            <h2
                                id="event-detail-title"
                                className="text-3xl md:text-4xl font-bold mb-4 text-primary"
                            >
                                {title}
                            </h2>

                            {/* Date and Location */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <Calendar className="h-5 w-5 text-secondary flex-shrink-0" />
                                    <span>{event.date}</span>
                                </div>
                                {location && (
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <MapPin className="h-5 w-5 text-secondary flex-shrink-0" />
                                        <span>{location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                {language === "fr"
                                    ? "Description"
                                    : language === "ar"
                                    ? "الوصف"
                                    : "Description"}
                            </h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {description}
                            </p>
                        </div>

                        {/* Additional details - optional */}
                        {details && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                    {language === "fr"
                                        ? "Détails"
                                        : language === "ar"
                                        ? "التفاصيل"
                                        : "Details"}
                                </h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {details}
                                </p>
                            </div>
                        )}

                        {/* Gallery - optional */}
                        {event.gallery && event.gallery.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                    {language === "fr"
                                        ? "Galerie"
                                        : language === "ar"
                                        ? "المعرض"
                                        : "Gallery"}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {event.gallery.map((image, i) => (
                                        <div
                                            key={i}
                                            className="cursor-pointer hover:opacity-80 transition-opacity rounded-lg overflow-hidden"
                                            onClick={() =>
                                                handleImageClick(i + 1)
                                            }
                                        >
                                            <img
                                                src={
                                                    image || "/placeholder.svg"
                                                }
                                                alt={`${title} ${i + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Registration link - optional, only for upcoming events */}
                        {event.registrationLink && (
                            <div className="pt-4 border-t">
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2">
                                        <LinkIcon className="h-4 w-4" />
                                        {language === "fr"
                                            ? "S'inscrire"
                                            : language === "ar"
                                            ? "التسجيل في هذا الحدث"
                                            : "Register for this event"}
                                    </Button>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {galleryOpen && fullGallery.length > 0 && (
                <GalleryModal
                    images={fullGallery}
                    initialIndex={galleryIndex}
                    onClose={() => setGalleryOpen(false)}
                />
            )}
        </>
    );
}
