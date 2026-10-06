"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Translations } from "@/lib/translations";

// Authentic event imagery featured in the continuous swiping photo carousel
const heroSlides = [
    {
        src: "/assets/images/events/previous/2022-2023/integration-day-2022/1.avif",
        alt: "Integration Day 2022 - SOS Ambassadors Club ISIMS founding community",
    },
    {
        src: "/assets/images/events/previous/2022-2023/team-building-day-2023/1.avif",
        alt: "Team Building Day 2023 - Student ambassadors bonding and collaborative activities",
    },
    {
        src: "/assets/images/events/previous/2023-2024/season-launch-integration-day-2023/1.avif",
        alt: "Season Launch Integration Day 2023 - Welcoming new club members at ISIMS",
    },
    {
        src: "/assets/images/events/previous/2024-2025/second-anniversary-celebration-2024/1.avif",
        alt: "Second Anniversary Celebration 2024 - Two years of dedication to children in need",
    },
    {
        src: "/assets/images/events/previous/2025-2026/join-connect-season-opener-2025/1.avif",
        alt: "Join & Connect Season Opener 2025 - Active club ambassadors at the ISIMS campus stand",
    },
];

// Extended slides array with clone bookends for seamless infinite continuous forward/backward swiping
const extendedSlides = [
    heroSlides[heroSlides.length - 1],
    ...heroSlides,
    heroSlides[0],
];

interface HeroProps {
    t: Translations;
}

export function Hero({ t }: HeroProps) {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [withTransition, setWithTransition] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const isTransitioningRef = useRef(false);
    const touchStartX = useRef<number | null>(null);
    const touchMoveX = useRef<number | null>(null);

    const handleNext = useCallback(() => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setWithTransition(true);
        setCurrentIndex((prev) => prev + 1);
    }, []);

    const handlePrev = useCallback(() => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setWithTransition(true);
        setCurrentIndex((prev) => prev - 1);
    }, []);

    const handleTransitionEnd = () => {
        isTransitioningRef.current = false;
        if (currentIndex >= extendedSlides.length - 1) {
            setWithTransition(false);
            setCurrentIndex(1);
        } else if (currentIndex <= 0) {
            setWithTransition(false);
            setCurrentIndex(heroSlides.length);
        }
    };

    // Re-enable transition on subsequent frame after index jump
    useEffect(() => {
        if (!withTransition) {
            const raf = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setWithTransition(true);
                });
            });
            return () => cancelAnimationFrame(raf);
        }
    }, [withTransition]);

    // Continuous auto-swipe loop every 3.5 seconds
    useEffect(() => {
        if (isPaused) return;
        const timer = setInterval(() => {
            handleNext();
        }, 3500);
        return () => clearInterval(timer);
    }, [isPaused, handleNext]);

    const goToSlide = (slideIdx: number) => {
        if (isTransitioningRef.current) return;
        setWithTransition(true);
        setCurrentIndex(slideIdx + 1);
    };

    // Calculate real active index for dot indicators (0 to 5)
    const activeDotIndex =
        currentIndex === 0
            ? heroSlides.length - 1
            : currentIndex === extendedSlides.length - 1
            ? 0
            : currentIndex - 1;

    // Touch swipe gesture handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchMoveX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchMoveX.current !== null) {
            const delta = touchStartX.current - touchMoveX.current;
            if (delta > 40) {
                handleNext();
            } else if (delta < -40) {
                handlePrev();
            }
        }
        touchStartX.current = null;
        touchMoveX.current = null;
    };

    return (
        <section className="relative min-h-[85vh] lg:min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-[#00abec] via-[#009ee3] to-[#008cc7] text-white pt-16 pb-10 sm:pt-20 sm:pb-14 lg:py-0">
            {/* Ambient Lighting & Atmospheric Depth */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute -top-32 -start-32 w-96 h-96 sm:w-[540px] sm:h-[540px] rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-32 -end-32 w-96 h-96 sm:w-[540px] sm:h-[540px] rounded-full bg-[#1c325d]/25 blur-3xl" />
                <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-80 h-80 rounded-full bg-[#de5a6c]/15 blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 items-center">
                    {/* Left Column: High-Impact Headline, Subtitle & Action CTAs (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-center text-start items-start space-y-4 sm:space-y-5 animate-fade-in-up animate-in">
                        {/* High-Impact Headline with Accent Underline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-white leading-[1.12] text-balance">
                            {t.hero.title.includes("SOS") ? (
                                <>
                                    {t.hero.title.split("SOS")[0]}
                                    <span className="relative inline-block font-black text-white">
                                        SOS
                                        <span className="absolute -bottom-1 sm:-bottom-1.5 left-0 right-0 h-1 sm:h-1.5 bg-[#de5a6c] rounded-full shadow-sm" />
                                    </span>
                                    {t.hero.title.split("SOS")[1]}
                                </>
                            ) : (
                                t.hero.title
                            )}
                        </h1>

                        {/* Descriptive Subtitle */}
                        <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-lg text-pretty leading-relaxed font-normal">
                            {t.hero.subtitle}
                        </p>

                        {/* Dual High-Contrast Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1 w-full sm:w-auto">
                            {/* Primary CTA: Become a Member (Crisp White Button on Blue) */}
                            <Button
                                asChild
                                size="lg"
                                className="gap-2 text-sm sm:text-base font-bold px-6 py-5 rounded-xl bg-white hover:bg-white/95 text-[#1c325d] hover:text-[#00abec] shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-transparent cursor-pointer"
                            >
                                <a
                                    href="#join"
                                    className="inline-flex items-center justify-center gap-2"
                                >
                                    <span>{t.hero.cta}</span>
                                    <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0 text-[#00abec]" />
                                </a>
                            </Button>

                            {/* Secondary CTA: Donate Here (Clear White Outline) */}
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="gap-2 text-sm sm:text-base font-semibold px-6 py-5 rounded-xl border-2 border-white/80 hover:border-white text-white hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0 transition-all bg-transparent shadow-sm cursor-pointer"
                            >
                                <a
                                    href="https://sosve.tn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2"
                                >
                                    <span>{t.hero.donate}</span>
                                    <ArrowRight className="h-4.5 w-4.5 rtl:rotate-180 shrink-0" />
                                </a>
                            </Button>
                        </div>

                        {/* Chapter Beacon */}
                        <div className="flex items-center gap-2.5 pt-0.5 text-xs text-white/90 font-medium">
                            <span className="flex h-2 w-2 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                            </span>
                            <span>
                                Higher Institute of Computer Science and Multimedia • Sfax
                            </span>
                        </div>
                    </div>

                    {/* Right Column: Continuous Auto-Swiping Photo Showcase (5 cols) */}
                    <div className="lg:col-span-5 relative w-full flex items-center justify-center lg:justify-end mt-6 lg:mt-0">
                        <div
                            className="relative w-full max-w-md xl:max-w-lg group"
                            onMouseEnter={() => setIsPaused(true)}
                            onMouseLeave={() => setIsPaused(false)}
                        >
                            {/* Ambient Lighting Depth */}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -inset-4 sm:-inset-6 bg-gradient-to-tr from-white/20 via-[#de5a6c]/20 to-[#1c325d]/30 rounded-3xl blur-2xl -z-10 group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Main Carousel Frame */}
                            <div
                                dir="ltr"
                                className="relative w-full aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-[#0c4a6e]/50 border-4 border-white/50 ring-1 ring-white/30 bg-slate-900 select-none cursor-grab active:cursor-grabbing"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {/* Continuous Slider Track */}
                                <div
                                    className={`flex h-full w-full ${
                                        withTransition
                                            ? "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                            : ""
                                    }`}
                                    style={{
                                        transform: `translateX(-${currentIndex * 100}%)`,
                                    }}
                                    onTransitionEnd={handleTransitionEnd}
                                >
                                    {extendedSlides.map((slide, idx) => (
                                        <div
                                            key={idx}
                                            className="relative min-w-full w-full h-full shrink-0"
                                        >
                                            <Image
                                                src={slide.src}
                                                alt={slide.alt}
                                                fill
                                                priority={idx <= 2}
                                                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 50vw, 560px"
                                                className="object-cover object-center pointer-events-none"
                                                draggable={false}
                                            />
                                            {/* Soft bottom vignette */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                                        </div>
                                    ))}
                                </div>

                                {/* Previous Slide Button */}
                                <button
                                    type="button"
                                    onClick={handlePrev}
                                    aria-label="Previous image"
                                    className="absolute top-1/2 start-3 sm:start-4 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#1c325d] shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:opacity-100 cursor-pointer z-20"
                                >
                                    <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                                </button>

                                {/* Next Slide Button */}
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    aria-label="Next image"
                                    className="absolute top-1/2 end-3 sm:end-4 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-[#1c325d] shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 focus:opacity-100 cursor-pointer z-20"
                                >
                                    <ChevronRight className="w-5 h-5 rtl:rotate-180" />
                                </button>

                                {/* Slide Indicators / Dots */}
                                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/20">
                                    {heroSlides.map((_, dotIdx) => {
                                        const isActive = dotIdx === activeDotIndex;
                                        return (
                                            <button
                                                key={dotIdx}
                                                type="button"
                                                onClick={() => goToSlide(dotIdx)}
                                                aria-label={`Go to slide ${dotIdx + 1}`}
                                                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                                    isActive
                                                        ? "w-6 sm:w-7 bg-white shadow-sm"
                                                        : "w-2 bg-white/50 hover:bg-white/80"
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Scroll Anchor */}
            <a
                href="#about"
                aria-label={t.hero.scroll}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-xs font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors cursor-pointer"
            >
                <span>{t.hero.scroll}</span>
                <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center p-1">
                    <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
                </div>
            </a>
        </section>
    );
}
