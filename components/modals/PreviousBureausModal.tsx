"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Bureau } from "@/lib/types";
import { getLocalizedRole, type Language } from "@/lib/translations";

interface PreviousBureausModalProps {
    open: boolean;
    bureaus: Bureau[];
    language: Language;
    onClose: () => void;
}

export function PreviousBureausModal({
    open,
    bureaus,
    language,
    onClose,
}: PreviousBureausModalProps) {
    const years = useMemo(() => bureaus.map((b) => b.year), [bureaus]);
    const [activeYear, setActiveYear] = useState<string | null>(
        years[0] ?? null
    );
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (years.length) {
            setActiveYear(years[0]);
        }
    }, [years.join("")]);

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

    if (!open) return null;

    const activeBureau = bureaus.find((b) => b.year === activeYear);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="previous-bureaus-title"
                ref={modalRef}
            >
                <div className="flex items-center justify-between gap-4 p-4 border-b sticky top-0 bg-white z-10">
                    <h3
                        id="previous-bureaus-title"
                        className="text-2xl font-semibold text-primary-dark"
                    >
                        {language === "fr"
                            ? "Bureaux précédents"
                            : language === "ar"
                            ? "المكاتب السابقة"
                            : "Previous bureaus"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close previous bureaus"
                        ref={closeButtonRef}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-4 border-b">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {bureaus.map((bureau) => (
                            <button
                                key={bureau.year}
                                onClick={() => setActiveYear(bureau.year)}
                                className={`px-4 py-2 rounded-full border transition-colors ${
                                    activeYear === bureau.year
                                        ? "bg-primary text-white border-primary"
                                        : "bg-white text-primary-dark border-gray-200 hover:border-primary/60"
                                }`}
                            >
                                {bureau.year}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    <div className="p-4 h-full">
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-1 pb-24">
                            {(activeBureau?.members || []).map(
                                (member, index) => (
                                    <Card
                                        key={`${activeYear}-${index}`}
                                        className="h-full border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-full h-80 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
                                            <img
                                                src={`${member.image}?w=320&h=320&fit=crop&auto=format&dpr=2`}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-4 space-y-2">
                                            <div>
                                                <h4 className="text-lg font-semibold text-primary-dark">
                                                    {member.name}
                                                </h4>
                                                <p className="text-sm text-primary-dark/80">
                                                    {getLocalizedRole(
                                                        member,
                                                        language
                                                    )}
                                                </p>
                                            </div>
                                            {member.email && (
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="text-sm text-primary hover:underline break-words"
                                                >
                                                    {member.email}
                                                </a>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            )}
                        </div>
                    </div>
                </div>

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
