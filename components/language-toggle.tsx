"use client";

import { Globe } from "lucide-react";
import type { Language } from "@/lib/translations";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
    currentLanguage: Language;
    onChange: (language: Language) => void;
    isScrolled?: boolean;
}

export function LanguageToggle({
    currentLanguage,
    onChange,
    isScrolled = false,
}: LanguageToggleProps) {
    const languages: Array<{
        value: Language;
        short: string;
        label: string;
    }> = [
        { value: "en", short: "EN", label: "English" },
        { value: "fr", short: "FR", label: "Français" },
        { value: "ar", short: "AR", label: "العربية" },
    ];

    const selected = languages.find((lang) => lang.value === currentLanguage);

    return (
        <Select
            value={currentLanguage}
            onValueChange={(value) => onChange(value as Language)}
        >
            <SelectTrigger
                size="sm"
                className={cn(
                    "gap-2 min-w-[80px] transition-colors",
                    isScrolled
                        ? "bg-primary-dark text-primary-100 border-primary [&_svg]:text-primary-dark"
                        : "bg-primary-dark text-primary-100 border-white [&_svg]:text-primary-100",
                    "[&_.lucide-chevron-down]:opacity-100",
                )}
                aria-label="Select language"
            >
                <Globe className="w-4 h-4 text-primary-dark" />
                <span className="font-semibold">
                    {selected?.short ?? currentLanguage.toUpperCase()}
                </span>
            </SelectTrigger>
            <SelectContent align="end">
                {languages.map((lang) => (
                    <SelectItem
                        key={lang.value}
                        value={lang.value}
                        className="justify-center [&_svg]:text-primary-dark"
                    >
                        <span className="font-medium">{lang.label}</span>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
