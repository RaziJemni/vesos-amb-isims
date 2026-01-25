/**
 * Translation system for the SOS Club website
 * Supports English, French, and Arabic languages with per-section JSON files
 */

import navData from "@/locales/nav.json";
import heroData from "@/locales/hero.json";
import aboutData from "@/locales/about.json";
import goalsData from "@/locales/goals.json";
import teamStringsData from "@/locales/team.json";
import eventsStringsData from "@/locales/events.json";
import joinData from "@/locales/join.json";
import footerData from "@/locales/footer.json";
import teamContentData from "@/locales/content/team.json";
import eventsContentData from "@/locales/content/events.json";
import type { TeamMember, Event } from "./types";

// Supported languages
export type Language = "en" | "fr" | "ar";

// Translation data structure
export interface Translations {
    nav: {
        about: string;
        bureau: string;
        goals: string;
        events: string;
        join: string;
        learnMore: string;
    };
    hero: {
        title: string;
        subtitle: string;
        cta: string;
        donate: string;
    };
    about: {
        title: string;
        description: string;
    };
    goals: {
        title: string;
        items: Array<{
            icon: string;
            title: string;
            description: string;
        }>;
    };
    team: {
        title: string;
        viewPreviousBureaus: string;
        previousBureausTitle: string;
        noPreviousBureaus: string;
        prevButton: string;
        nextButton: string;
    };
    events: {
        title: string;
        recent: string;
        upcoming: string;
    };
    join: {
        title: string;
        subtitle: string;
        form: {
            fullname: string;
            fullnamePlaceholder: string;
            email: string;
            emailPlaceholder: string;
            phone: string;
            phonePlaceholder: string;
            facebookLink: string;
            facebookLinkPlaceholder: string;
            region: string;
            regionPlaceholder: string;
            university: string;
            universityISIMS: string;
            universityOther: string;
            studyLevel: string;
            studyLevelFirstYear: string;
            studyLevelSecondYear: string;
            studyLevelThirdYear: string;
            studyLevelOther: string;
            specialty: string;
            specialtyPlaceholder: string;
            clubExperience: string;
            yes: string;
            no: string;
            desiredPosition: string;
            positionTreasurer: string;
            positionEventManager: string;
            positionDigitalCommunicationAssistant: string;
            positionMember: string;
            department: string;
            departmentHR: string;
            departmentEvents: string;
            departmentDigitalComm: string;
            sosVillageKnowledge: string;
            sosVillageKnowledgeOption1: string;
            sosVillageKnowledgeOption2: string;
            sosVillageKnowledgeOption3: string;
            inPersonMeeting: string;
            inPersonMeetingYes: string;
            inPersonMeetingNotSure: string;
            inPersonMeetingNo: string;
            additionalInfo: string;
            additionalInfoPlaceholder: string;
            submit: string;
            success: string;
            error: string;
        };
    };
    footer: {
        about: string;
        location: string;
        email: string;
        quickLinks: string;
        followUs: string;
        rights: string;
    };
}

// Assemble translations from per-section files
const assembleTranslations = (): Record<Language, Translations> => {
    const result: Record<Language, Translations> = {} as Record<
        Language,
        Translations
    >;
    const languages: Language[] = ["en", "fr", "ar"];

    for (const lang of languages) {
        result[lang] = {
            nav: navData[lang],
            hero: heroData[lang],
            about: aboutData[lang],
            goals: goalsData[lang],
            team: teamStringsData[lang],
            events: eventsStringsData[lang],
            join: joinData[lang],
            footer: footerData[lang],
        };
    }

    return result;
};

// Translation data
const translations: Record<Language, Translations> = assembleTranslations();

// Data that doesn't need translation but is language-aware
export const getLocalizedData = () => {
    return {
        team: teamContentData,
        events: eventsContentData,
    };
};

// Get translation for a specific language
export const getTranslations = (language: Language): Translations => {
    return translations[language] || translations.en;
};

// Get localized text with fallback
export const t = (
    language: Language,
    key: string,
    fallback?: string,
): string => {
    const keys = key.split(".");
    let value: any = translations[language] || translations.en;

    for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
            return fallback || key;
        }
    }

    return typeof value === "string" ? value : fallback || key;
};

// Get localized team member role
export const getLocalizedRole = (
    member: TeamMember,
    language: Language,
): string => {
    if (language === "fr") return member.roleFr || member.role;
    if (language === "ar")
        return (member as any).roleAr || member.roleFr || member.role;
    return member.role;
};

// Get localized event data
export const getLocalizedEvent = (event: Event, language: Language): Event => {
    return {
        ...event,
        title:
            language === "fr"
                ? event.titleFr || event.title
                : language === "ar"
                  ? (event as any).titleAr || event.titleFr || event.title
                  : event.title,
        description:
            language === "fr"
                ? event.descriptionFr || event.description
                : language === "ar"
                  ? (event as any).descriptionAr ||
                    event.descriptionFr ||
                    event.description
                  : event.description,
        location:
            language === "fr"
                ? event.locationFr || event.location
                : language === "ar"
                  ? (event as any).locationAr ||
                    event.locationFr ||
                    event.location
                  : event.location,
        details:
            language === "fr"
                ? event.detailsFr || event.details
                : language === "ar"
                  ? (event as any).detailsAr || event.detailsFr || event.details
                  : event.details,
    };
};

export default translations;
