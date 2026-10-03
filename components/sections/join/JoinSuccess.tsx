"use client";

import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Translations } from "@/lib/translations";

interface JoinSuccessProps {
    t: Translations;
    onReset: () => void;
}

export function JoinSuccess({ t, onReset }: JoinSuccessProps) {
    return (
        <div className="py-12 px-4 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
                <h3 className="text-2xl sm:text-3xl font-bold text-primary-dark">
                    {t.join.form.successTitle ||
                        "Application Submitted Successfully!"}
                </h3>
                <p className="text-primary-dark/80 text-base">
                    {t.join.form.success}
                </p>
                <p className="text-sm text-gray-500 pt-2">
                    {t.join.form.successSubtitle ||
                        "Our HR team will review your application and get in touch to schedule an interview."}
                </p>
            </div>
            <div className="pt-4">
                <Button
                    onClick={onReset}
                    variant="outline"
                    className="gap-2 border-primary/30 text-primary hover:bg-primary/5"
                >
                    <RotateCcw className="w-4 h-4" />
                    {t.join.form.submitAnother || "Submit another response"}
                </Button>
            </div>
        </div>
    );
}
