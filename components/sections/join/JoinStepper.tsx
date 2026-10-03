"use client";

import { Check } from "lucide-react";
import type { Translations } from "@/lib/translations";

export type WizardStep = 1 | 2 | 3;

export interface StepDefinition {
    number: WizardStep;
    title: string;
    desc: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface JoinStepperProps {
    steps: StepDefinition[];
    currentStep: WizardStep;
    progressPercentage: number;
    t: Translations;
    onStepClick: (step: WizardStep) => void;
}

export function JoinStepper({
    steps,
    currentStep,
    progressPercentage,
    t,
    onStepClick,
}: JoinStepperProps) {
    return (
        <div className="mb-8">
            {/* Progress Bar Track */}
            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                    style={{
                        width: `${progressPercentage}%`,
                    }}
                />
            </div>

            {/* Stepper Nodes */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {steps.map((s) => {
                    const isDone = currentStep > s.number;
                    const isActive = currentStep === s.number;
                    const Icon = s.icon;

                    return (
                        <button
                            key={s.number}
                            type="button"
                            onClick={() => onStepClick(s.number)}
                            className={`flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 p-2 rounded-xl transition-all ${
                                isActive
                                    ? "bg-primary/10 border border-primary/30"
                                    : isDone
                                    ? "hover:bg-gray-50 cursor-pointer"
                                    : "opacity-60 cursor-default"
                            }`}
                        >
                            <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${
                                    isDone
                                        ? "bg-green-600 text-white shadow-sm"
                                        : isActive
                                        ? "bg-primary text-white shadow-md ring-4 ring-primary/20"
                                        : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                {isDone ? (
                                    <Check className="w-5 h-5 stroke-[2.5]" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </div>
                            <div className="hidden sm:block min-w-0">
                                <span className="block text-xs font-semibold text-primary uppercase tracking-wider">
                                    {t.join.form.step || "Step"} {s.number}{" "}
                                    {t.join.form.of || "of"} 3
                                </span>
                                <span
                                    className={`block text-sm font-semibold truncate ${
                                        isActive
                                            ? "text-primary-dark"
                                            : "text-gray-600"
                                    }`}
                                >
                                    {s.title}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Active Step Subtitle for Mobile */}
            <div className="mt-4 sm:hidden text-center bg-primary/5 py-2 px-3 rounded-lg">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {t.join.form.step || "Step"} {currentStep}{" "}
                    {t.join.form.of || "of"} 3: {steps[currentStep - 1].title}
                </p>
            </div>
        </div>
    );
}
