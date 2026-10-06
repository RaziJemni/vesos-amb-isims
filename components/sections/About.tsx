"use client";

import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { Translations } from "@/lib/translations";

interface AboutProps {
    t: Translations;
}

export function About({ t }: AboutProps) {
    const ref = useScrollAnimation();

    const paragraphs = (t.about.description || "").split("\n\n").filter(Boolean);

    return (
        <section
            id="about"
            className="relative py-12 sm:py-16 lg:py-20 bg-white text-slate-800 overflow-hidden"
        >
            {/* Ambient subtle background glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute top-1/4 -start-24 w-80 h-80 rounded-full bg-[#00abec]/5 blur-3xl" />
                <div className="absolute bottom-1/4 -end-24 w-80 h-80 rounded-full bg-[#de5a6c]/5 blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
                <div
                    ref={ref}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-14 items-center animate-fade-in-up animate-in"
                >
                    {/* Left Column: Narrative Story */}
                    <div className="flex flex-col items-start text-start space-y-4 sm:space-y-5">
                        {/* Heading */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1c325d] leading-tight text-balance">
                            {t.about.title}
                        </h2>

                        {/* Narrative Story Paragraphs */}
                        <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed font-normal text-pretty">
                            {paragraphs.length > 0 ? (
                                paragraphs.map((para, idx) => (
                                    <p key={idx}>{para}</p>
                                ))
                            ) : (
                                <p>{t.about.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Framed Photography of Active Members & Partner Badge */}
                    <div className="relative w-full flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg">
                            {/* Ambient decorative backdrop accent */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-[#00abec]/15 via-[#de5a6c]/10 to-transparent rounded-3xl blur-2xl -z-10"
                            />

                            {/* Main Framed Photography: Team Building & Active Members */}
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 ring-1 ring-slate-200/80">
                                <Image
                                    src="/assets/images/events/previous/2024-2025/season-launch-integration-day-2024/1.avif"
                                    alt="SOS Ambassadors Club ISIMS members at Season Launch Integration Day 2024"
                                    fill
                                    sizes="(max-width: 640px) 94vw, (max-width: 1024px) 50vw, 480px"
                                    className="object-cover object-center hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
