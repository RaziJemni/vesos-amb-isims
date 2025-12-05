"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import type { Language } from "@/lib/translations";

interface LanguageToggleProps {
    currentLanguage: Language;
    onToggle: () => void;
}

export function LanguageToggle({
    currentLanguage,
    onToggle,
}: LanguageToggleProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onToggle}
            className="gap-2 font-medium bg-transparent"
        >
            <Globe className="h-4 w-4" />
            {currentLanguage === "en"
                ? "FR"
                : currentLanguage === "fr"
                ? "AR"
                : "EN"}
        </Button>
    );
}
