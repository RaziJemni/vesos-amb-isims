"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Card, CardContent } from "@/components/ui/card";
import {
    Megaphone,
    HeartHandshake,
    Coins,
    GraduationCap,
    Globe,
    CalendarDays,
} from "lucide-react";
import type { Translations } from "@/lib/translations";

interface GoalsProps {
    t: Translations;
}

// Meta properties and imagery for each of the 6 pillars with strictly alternating brand colors
const goalMeta = [
    {
        icon: Megaphone,
        color: "#00abec", // Blue
        badgeBg: "bg-[#00abec]/10",
        badgeText: "text-[#00abec]",
        borderActive: "border-[#00abec]",
        borderHover: "hover:border-[#00abec]",
        bgActive: "bg-[#00abec]/5",
        pillTag: "Awareness & Voice",
        image: "/assets/images/events/previous/2024-2025/mental-health-awareness-day-2025/1.avif",
        actionHighlight: "University campaigns reaching hundreds of students across campus.",
        isPrimary: true,
    },
    {
        icon: HeartHandshake,
        color: "#de5a6c", // Coral
        badgeBg: "bg-[#de5a6c]/10",
        badgeText: "text-[#de5a6c]",
        borderActive: "border-[#de5a6c]",
        borderHover: "hover:border-[#de5a6c]",
        bgActive: "bg-[#de5a6c]/5",
        pillTag: "Campus Solidarity",
        image: "/assets/images/events/previous/2024-2025/team-building-day-2024/1.avif",
        actionHighlight: "Promoting inclusive empathy, mutual aid, and civic responsibility.",
        isPrimary: false,
    },
    {
        icon: Coins,
        color: "#00abec", // Blue (Alternating)
        badgeBg: "bg-[#00abec]/10",
        badgeText: "text-[#00abec]",
        borderActive: "border-[#00abec]",
        borderHover: "hover:border-[#00abec]",
        bgActive: "bg-[#00abec]/5",
        pillTag: "Charity & Donations",
        image: "/assets/images/events/previous/2023-2024/season-launch-integration-day-2023/1.avif",
        actionHighlight: "Direct fundraising drives supporting SOS Village d'Enfants.",
        isPrimary: true,
    },
    {
        icon: GraduationCap,
        color: "#de5a6c", // Coral (Alternating)
        badgeBg: "bg-[#de5a6c]/10",
        badgeText: "text-[#de5a6c]",
        borderActive: "border-[#de5a6c]",
        borderHover: "hover:border-[#de5a6c]",
        bgActive: "bg-[#de5a6c]/5",
        pillTag: "Student Empowerment",
        image: "/assets/images/events/previous/2022-2023/public-speaking-training-2023/1.avif",
        actionHighlight: "Leadership, civic engagement, and soft skills workshops.",
        isPrimary: false,
    },
    {
        icon: Globe,
        color: "#00abec", // Blue (Alternating)
        badgeBg: "bg-[#00abec]/10",
        badgeText: "text-[#00abec]",
        borderActive: "border-[#00abec]",
        borderHover: "hover:border-[#00abec]",
        bgActive: "bg-[#00abec]/5",
        pillTag: "National Network",
        image: "/assets/images/events/previous/2024-2025/second-anniversary-celebration-2024/1.avif",
        actionHighlight: "Uniting SOS Village student ambassador clubs throughout Tunisia.",
        isPrimary: false,
    },
    {
        icon: CalendarDays,
        color: "#de5a6c", // Coral (Alternating)
        badgeBg: "bg-[#de5a6c]/10",
        badgeText: "text-[#de5a6c]",
        borderActive: "border-[#de5a6c]",
        borderHover: "hover:border-[#de5a6c]",
        bgActive: "bg-[#de5a6c]/5",
        pillTag: "Direct Field Action",
        image: "/assets/images/events/previous/2025-2026/join-connect-season-opener-2025/1.avif",
        actionHighlight: "Conferences, cultural outings, and educational bootcamps.",
        isPrimary: false,
    },
];

export function Goals({ t }: GoalsProps) {
    const ref = useScrollAnimation();
    const [selectedIndex, setSelectedIndex] = useState(0);

    if (!t.goals?.items?.length) {
        return null;
    }

    const goals = t.goals.items;
    const activeGoal = goals[selectedIndex] || goals[0];
    const activeMeta = goalMeta[selectedIndex] || goalMeta[0];
    const ActiveIcon = activeMeta.icon;

    return (
        <section
            id="goals"
            className="relative py-12 sm:py-16 lg:py-20 bg-slate-50/80 border-y border-slate-200/70 text-slate-800 overflow-hidden"
        >
            {/* Ambient Lighting Gradients */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="absolute top-1/4 -start-24 w-96 h-96 rounded-full bg-[#00abec]/5 blur-3xl" />
                <div className="absolute bottom-1/4 -end-24 w-96 h-96 rounded-full bg-[#de5a6c]/5 blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
                {/* Clean Section Header (No Eyebrow Pill) */}
                <div className="max-w-2xl mx-auto text-center space-y-2.5 mb-8 sm:mb-10 lg:mb-12 animate-fade-in-up animate-in">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1c325d] text-balance">
                        {t.goals.title}
                    </h2>

                    <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-xl mx-auto text-pretty font-normal">
                        {t.goals.subtitle ||
                            "Six concrete pillars driving student solidarity, awareness campaigns, and tangible support for children supported by SOS Village."}
                    </p>
                </div>

                {/* Interactive Spotlight & Pillar Showcase */}
                <div
                    ref={ref}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch animate-fade-in-up animate-in"
                >
                    {/* Left Column: Dynamic Spotlight Card (Fixed Locked Height) */}
                    <div className="lg:col-span-5 h-full flex flex-col">
                        <Card className="relative w-full h-full min-h-[360px] sm:min-h-[380px] overflow-hidden bg-white border-2 border-slate-200/90 rounded-2xl shadow-lg flex flex-col justify-start transition-all duration-300">
                            {/* Top Ambient Highlight Strip */}
                            <div
                                className="h-1.5 w-full transition-colors duration-500 shrink-0"
                                style={{ backgroundColor: activeMeta.color }}
                            />

                            {/* Spotlight Imagery */}
                            <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                                <Image
                                    key={activeMeta.image}
                                    src={activeMeta.image}
                                    alt={activeGoal.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 420px"
                                    className="object-cover object-center animate-fade-in transition-transform duration-700 hover:scale-105"
                                />
                            </div>

                            {/* Spotlight Content Area (Always Identical Size) */}
                            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex items-center justify-center w-11 h-11 rounded-xl ${activeMeta.badgeBg} ${activeMeta.badgeText} shadow-xs shrink-0`}
                                        >
                                            <ActiveIcon className="w-5.5 h-5.5" />
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-[#1c325d] leading-tight">
                                            {activeGoal.title}
                                        </h3>
                                    </div>

                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal text-pretty min-h-[3.25rem]">
                                        {activeGoal.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Interactive Pillar List with Alternating Hover Colors */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-2 sm:space-y-2.5">
                        {goals.map((goal, index) => {
                            const meta = goalMeta[index] || goalMeta[0];
                            const Icon = meta.icon;
                            const isSelected = selectedIndex === index;

                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setSelectedIndex(index)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full text-start px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3.5 cursor-pointer group ${
                                        isSelected
                                            ? `bg-white ${meta.borderActive} shadow-md -translate-x-0.5 rtl:translate-x-0.5`
                                            : `bg-white/80 hover:bg-white border-slate-200/80 ${meta.borderHover} shadow-xs hover:shadow`
                                    }`}
                                >
                                    {/* Icon Badge */}
                                    <div
                                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg shrink-0 transition-transform duration-200 ${
                                            isSelected
                                                ? `${meta.badgeBg} ${meta.badgeText} scale-105`
                                                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                                        }`}
                                    >
                                        <Icon className="w-4.5 h-4.5" />
                                    </div>

                                    {/* Title and Short Description */}
                                    <div className="min-w-0 flex-1">
                                        <h4
                                            className={`text-sm sm:text-base font-bold truncate transition-colors ${
                                                isSelected
                                                    ? "text-[#1c325d]"
                                                    : "text-slate-700 group-hover:text-[#1c325d]"
                                            }`}
                                        >
                                            {goal.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 truncate max-w-md font-normal mt-0.5">
                                            {goal.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
