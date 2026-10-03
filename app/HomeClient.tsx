"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { getTranslations, type Language } from "@/lib/translations";

interface HomeClientProps {
    initialLanguage: Language;
}

export default function HomeClient({ initialLanguage }: HomeClientProps) {
    const [language, setLanguage] = useState<Language>(initialLanguage);
    const router = useRouter();

    const applyLanguageAttributes = (lang: Language) => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    };

    useEffect(() => {
        setLanguage(initialLanguage);
    }, [initialLanguage]);

    useEffect(() => {
        applyLanguageAttributes(language);
        document.cookie = `language=${language}; path=/; max-age=${
            60 * 60 * 24 * 365
        }`;
    }, [language]);

    const handleLanguageChange = (lang: Language) => {
        if (lang === language) return;
        document.cookie = `language=${lang}; path=/; max-age=${
            60 * 60 * 24 * 365
        }`;
        applyLanguageAttributes(lang);
        setLanguage(lang);

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.set("lang", lang);
            window.history.replaceState(null, "", url.toString());
        }

        router.refresh();
    };

    const t = getTranslations(language);

    return (
        <Navigation
            t={t}
            currentLanguage={language}
            onLanguageChange={handleLanguageChange}
        />
    );
}
