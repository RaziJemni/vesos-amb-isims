"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Calendar, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import GalleryModal from "@/components/modals/GalleryModal";
import type { Event } from "@/lib/types";

interface EventDetailModalProps {
    event: Event;
    language: "en" | "fr";
    onClose: () => void;
}

export default function EventDetailModal({
    event,
    language,
    onClose,
}: EventDetailModalProps) {
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        // Lock scroll when modal opens
        document.body.style.overflow = "hidden";

        return () => {
            // Unlock scroll when modal closes
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!event) return null;

    const title =
        language === "fr" ? event.titleFr || event.title : event.title;
    const description =
        language === "fr"
            ? event.descriptionFr || event.description
            : event.description;
    const location =
        language === "fr" ? event.locationFr || event.location : event.location;
    const details =
        language === "fr" ? event.detailsFr || event.details : event.details;

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
                >
                    {/* Close button */}
                    <div className="sticky top-0 flex justify-end p-4 bg-white border-b">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close"
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
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
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
                                    {language === "fr" ? "Détails" : "Details"}
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
                                    {language === "fr" ? "Galerie" : "Gallery"}
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
