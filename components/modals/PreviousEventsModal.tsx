"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, X } from "lucide-react";
import type { Event } from "@/lib/types";
import { getLocalizedEvent, type Language } from "@/lib/translations";

interface PreviousEventsModalProps {
    open: boolean;
    previousGroups: { year: string; events: Event[] }[];
    language: Language;
    onClose: () => void;
    onSelectEvent: (event: Event) => void;
}

export function PreviousEventsModal({
    open,
    previousGroups,
    language,
    onClose,
    onSelectEvent,
}: PreviousEventsModalProps) {
    const sortedGroups = useMemo(() => {
        return (previousGroups || []).slice().sort((a, b) => {
            const aStart = parseInt(String(a.year).split("-")[0], 10) || 0;
            const bStart = parseInt(String(b.year).split("-")[0], 10) || 0;
            return bStart - aStart;
        });
    }, [previousGroups]);

    const previousYears = sortedGroups.map((g) => g.year);

    const [activeIndex, setActiveIndex] = useState<number>(0);

    const scrollRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Lock background scroll so we only ever see ONE scrollbar (inside modal) and trap focus
    useEffect(() => {
        if (!open) return;
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
            } else if (active === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    useEffect(() => {
        // Only reset the active tab when the modal is opened or when the years list changes
        // while the modal is open. This prevents parent re-renders from forcing the
        // modal back to the first year while a user is interacting with it.
        if (open && previousYears.length) {
            setActiveIndex(0);
        }
    }, [open, previousYears.length]);

    if (!open) return null;

    // Enable vertical wheel → horizontal scroll on the cards row
    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const onWheel = (event: WheelEvent) => {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                el.scrollLeft += event.deltaY;
                event.preventDefault();
            }
        };

        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="previous-events-title"
                ref={modalRef}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between gap-4 p-4 border-b bg-white">
                    <h3
                        id="previous-events-title"
                        className="text-2xl font-semibold text-primary-dark"
                    >
                        {language === "fr"
                            ? "Événements précédents"
                            : language === "ar"
                            ? "الفعاليات السابقة"
                            : "Previous events"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close previous events"
                        ref={closeButtonRef}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* YEAR SELECTOR */}
                <div className="p-4 border-b">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {previousYears.map((year, idx) => (
                            <button
                                key={year}
                                onClick={() => setActiveIndex(idx)}
                                className={`px-4 py-2 rounded-full border transition-colors ${
                                    activeIndex === idx
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-primary-dark border-gray-200 hover:border-primary/60"
                                }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT – ONLY THIS SCROLLS VERTICALLY */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div
                        ref={scrollRef}
                        className="grid auto-cols-[320px] grid-flow-col gap-4 overflow-x-auto overflow-y-hidden pb-4 pr-2"
                    >
                        {(sortedGroups[activeIndex]?.events || []).map(
                            (event) => {
                                const localized = getLocalizedEvent(
                                    event,
                                    language
                                );

                                return (
                                    <Card
                                        key={event.id}
                                        className="min-w-[320px] max-w-[380px] snap-start flex flex-col border-gray-200 hover:shadow-lg transition cursor-pointer"
                                        onClick={() => onSelectEvent(localized)}
                                    >
                                        {localized.image && (
                                            <div className="w-full aspect-[16/9] overflow-hidden bg-gray-100">
                                                <Image
                                                    src={localized.image}
                                                    alt={localized.title}
                                                    width={960}
                                                    height={540}
                                                    loading="lazy"
                                                    sizes="(min-width: 1024px) 50vw, 100vw"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}

                                        <CardHeader>
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">
                                                    {localized.date}
                                                </span>
                                            </div>

                                            {localized.location && (
                                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                    <MapPin className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {localized.location}
                                                    </span>
                                                </div>
                                            )}

                                            <CardTitle className="text-lg">
                                                {localized.title}
                                            </CardTitle>
                                        </CardHeader>

                                        <CardContent className="flex-1">
                                            <p className="text-sm text-muted-foreground line-clamp-4">
                                                {localized.description}
                                            </p>
                                            <p className="text-xs text-primary mt-3 font-medium">
                                                {language === "fr"
                                                    ? "Cliquer pour les détails"
                                                    : language === "ar"
                                                    ? "اضغط لرؤية التفاصيل"
                                                    : "Click for details"}
                                            </p>
                                        </CardContent>
                                    </Card>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t bg-white flex justify-end">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="min-w-[120px]"
                    >
                        {language === "fr"
                            ? "Fermer"
                            : language === "ar"
                            ? "إغلاق"
                            : "Close"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
