"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import EventDetailModal from "@/components/modals/EventDetailModal";
import { PreviousEventsModal } from "@/components/modals/PreviousEventsModal";
import type { Language, Translations } from "@/lib/translations";
import type { Event } from "@/lib/types";
import { getLocalizedEvent, getLocalizedData } from "@/lib/translations";

const { events: eventsData } = getLocalizedData();

interface EventsProps {
    t: Translations;
    language: Language;
}

export function Events({ t, language }: EventsProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showPreviousModal, setShowPreviousModal] = useState(false);

    const recentRef = useScrollAnimation();
    const upcomingRef = useScrollAnimation();
    const previousButtonRef = useScrollAnimation();

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        // keep previous modal open so the detail modal can stack on top
    };

    const closeModal = () => setSelectedEvent(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // `eventsData.previousEvents` is an array of groups: { year: "2023-2024", events: [...] }
    const previousGroups = (eventsData.previousEvents || [])
        .slice()
        .sort((a, b) => {
            const aStart = parseInt(String(a.year).split("-")[0], 10) || 0;
            const bStart = parseInt(String(b.year).split("-")[0], 10) || 0;
            return bStart - aStart;
        });

    const previousEventsByYear = previousGroups.reduce<Record<string, Event[]>>(
        (acc, g) => {
            acc[g.year] = g.events || [];
            return acc;
        },
        {}
    );

    const previousYears = previousGroups.map((g) => g.year);
    const hasPreviousEvents = previousYears.length > 0;
    const previousButtonLabel =
        language === "fr"
            ? "Évènements précédents"
            : language === "ar"
            ? "الفعاليات السابقة"
            : "Previous events";
    const viewDetailsLabel =
        language === "fr"
            ? "Cliquez pour voir les détails"
            : language === "ar"
            ? "اضغط لعرض التفاصيل"
            : "Click to view details";
    const noUpcomingLabel =
        language === "fr"
            ? "Pas d'évènements à venir bientôt"
            : language === "ar"
            ? "لا توجد فعاليات قادمة قريباً"
            : "No upcoming events soon";

    // Recent should always show the latest two events regardless of their season
    const allPreviousEvents: Event[] = previousGroups.flatMap(
        (g) => g.events || []
    );
    const recentEvents = allPreviousEvents
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);

    return (
        <>
            <section
                id="events"
                className="relative min-h-screen flex items-center py-20 md:py-32 bg-primary/30 text-primary-dark"
            >
                <div className="absolute left-0 right-0 top-0 h-[8vh] pointer-events-none bg-gradient-to-b from-white to-transparent" />
                <div className="container px-4 relative flex flex-col items-center">
                    <div className="flex flex-col items-center gap-4 mb-12 animate-fade-in-up animate-in max-w-4xl text-center">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance">
                            {t.events.title}
                        </h2>
                    </div>

                    <div className="w-full max-w-6xl space-y-20">
                        {/* Recent Events */}
                        <div>
                            <div className="text-center mb-8">
                                <h3 className="text-xl md:text-2xl font-medium text-primary-dark">
                                    {t.events.recent}
                                </h3>
                            </div>
                            <div
                                ref={recentRef}
                                className="grid gap-6 md:grid-cols-2 animate-stagger"
                            >
                                {recentEvents.map((event, index) => {
                                    const localizedEvent = getLocalizedEvent(
                                        event,
                                        language
                                    );
                                    return (
                                        <Card
                                            key={index}
                                            className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden"
                                            onClick={() =>
                                                handleEventClick(localizedEvent)
                                            }
                                        >
                                            {localizedEvent.image && (
                                                <div className="w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5">
                                                    <Image
                                                        src={
                                                            localizedEvent.image ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={
                                                            localizedEvent.title
                                                        }
                                                        width={1280}
                                                        height={720}
                                                        loading="lazy"
                                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader>
                                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                    <Calendar className="h-4 w-4" />
                                                    <span className="text-sm">
                                                        {localizedEvent.date}
                                                    </span>
                                                </div>
                                                {localizedEvent.location && (
                                                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="text-sm">
                                                            {
                                                                localizedEvent.location
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                <CardTitle className="text-xl">
                                                    {localizedEvent.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground leading-relaxed">
                                                    {localizedEvent.description}
                                                </p>
                                                <p className="text-xs text-primary mt-3 font-medium">
                                                    {viewDetailsLabel}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Previous Button */}
                        <div
                            ref={previousButtonRef}
                            className="w-full max-w-6xl flex justify-center mt-16 px-4 animate-fade-in-up animate-in"
                        >
                            <Button
                                variant="secondary"
                                onClick={() =>
                                    hasPreviousEvents &&
                                    setShowPreviousModal(true)
                                }
                                className="w-full sm:w-auto px-8 py-6 text-base shadow-md hover:shadow-lg"
                                disabled={!hasPreviousEvents}
                            >
                                {previousButtonLabel}
                            </Button>
                        </div>

                        {/* Upcoming Events */}
                        <div>
                            <div className="text-center mb-8">
                                <h3 className="text-xl md:text-2xl font-medium">
                                    {t.events.upcoming}
                                </h3>
                            </div>
                            {eventsData.upcomingEvents.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-lg text-muted-foreground">
                                        {noUpcomingLabel}
                                    </p>
                                </div>
                            ) : (
                                <div
                                    ref={upcomingRef}
                                    className={`grid gap-6 animate-stagger ${
                                        eventsData.upcomingEvents.length === 1
                                            ? "md:flex md:justify-center md:w-full"
                                            : "md:grid-cols-2"
                                    }`}
                                >
                                    {eventsData.upcomingEvents.map(
                                        (event, index) => {
                                            const localizedEvent =
                                                getLocalizedEvent(
                                                    event,
                                                    language
                                                );
                                            return (
                                                <Card
                                                    key={index}
                                                    className={`border-2 border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 overflow-hidden ${
                                                        eventsData
                                                            .upcomingEvents
                                                            .length === 1
                                                            ? "w-full md:max-w-md"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleEventClick(
                                                            localizedEvent
                                                        )
                                                    }
                                                >
                                                    {localizedEvent.image && (
                                                        <div className="w-full aspect-[16/9] overflow-hidden bg-gray-200">
                                                            <Image
                                                                src={
                                                                    localizedEvent.image ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={
                                                                    localizedEvent.title
                                                                }
                                                                width={1280}
                                                                height={720}
                                                                loading="lazy"
                                                                sizes="(min-width: 1024px) 50vw, 100vw"
                                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    )}
                                                    <CardHeader>
                                                        <div className="flex items-center gap-2 text-primary mb-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="text-sm font-medium">
                                                                {
                                                                    localizedEvent.date
                                                                }
                                                            </span>
                                                        </div>
                                                        {localizedEvent.location && (
                                                            <div className="flex items-center gap-2 text-primary mb-2">
                                                                <MapPin className="h-4 w-4" />
                                                                <span className="text-sm">
                                                                    {
                                                                        localizedEvent.location
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        <CardTitle className="text-xl">
                                                            {
                                                                localizedEvent.title
                                                            }
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <p className="text-muted-foreground leading-relaxed">
                                                            {
                                                                localizedEvent.description
                                                            }
                                                        </p>
                                                        <p className="text-xs text-primary mt-3 font-medium">
                                                            Click to view
                                                            details & register
                                                        </p>
                                                    </CardContent>
                                                </Card>
                                            );
                                        }
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="absolute left-0 right-0 bottom-0 h-[8vh] pointer-events-none bg-gradient-to-b from-transparent to-white" />
            </section>

            {showPreviousModal && hasPreviousEvents && (
                <PreviousEventsModal
                    open={showPreviousModal}
                    previousGroups={previousGroups}
                    language={language}
                    onClose={() => setShowPreviousModal(false)}
                    onSelectEvent={(event) => handleEventClick(event)}
                />
            )}

            {selectedEvent && (
                <EventDetailModal
                    event={selectedEvent}
                    language={language}
                    onClose={closeModal}
                />
            )}
        </>
    );
}
