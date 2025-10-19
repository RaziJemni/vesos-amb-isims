/**
 * Translation system for the SOS Club website
 * Supports English and French languages with JSON-based content
 */

import enTranslations from '@/locales/en.json'
import frTranslations from '@/locales/fr.json'
import teamData from '@/data/team.json'
import eventsData from '@/data/events.json'
import type { TeamMember, Event } from './types'

// Supported languages
export type Language = 'en' | 'fr'

// Translation data structure
export interface Translations {
        nav: {
    about: string
    bureau: string
    goals: string
    events: string
    join: string
  }
        hero: {
    title: string
    subtitle: string
    cta: string
  }
        about: {
    title: string
    description: string
  }
        goals: {
    title: string
    items: Array<{
      icon: string
      title: string
      description: string
    }>
  }
        team: {
    title: string
    viewPreviousBureaus: string
    previousBureausTitle: string
    noPreviousBureaus: string
    prevButton: string
    nextButton: string
  }
        events: {
    title: string
    recent: string
    upcoming: string
  }
        join: {
    title: string
    subtitle: string
            form: {
      fullname: string
      fullnamePlaceholder: string
      email: string
      emailPlaceholder: string
      phone: string
      phonePlaceholder: string
      university: string
      universityPlaceholder: string
      studyField: string
      studyFieldPlaceholder: string
      year: string
      yearPlaceholder: string
      motivation: string
      motivationPlaceholder: string
      submit: string
      success: string
      error: string
    }
  }
        footer: {
    about: string
    location: string
    email: string
    quickLinks: string
    followUs: string
    rights: string
  }
}

// Translation data
const translations: Record<Language, Translations> = {
  en: enTranslations as Translations,
  fr: frTranslations as Translations,
}

// Data that doesn't need translation but is language-aware
export const getLocalizedData = (language: Language) => {
  return {
    team: teamData,
    events: eventsData,
  }
}

// Get translation for a specific language
export const getTranslations = (language: Language): Translations => {
  return translations[language] || translations.en
}

// Get localized text with fallback
export const t = (language: Language, key: string, fallback?: string): string => {
  const keys = key.split('.')
  let value: any = translations[language] || translations.en
  
  for (const k of keys) {
    value = value?.[k]
    if (value === undefined) {
      return fallback || key
    }
  }
  
  return typeof value === 'string' ? value : fallback || key
}

// Get localized team member role
export const getLocalizedRole = (member: TeamMember, language: Language): string => {
  return language === 'fr' ? member.roleFr || member.role : member.role
}

// Get localized event data
export const getLocalizedEvent = (event: Event, language: Language): Event => {
  return {
    ...event,
    title: language === 'fr' ? event.titleFr || event.title : event.title,
    description: language === 'fr' ? event.descriptionFr || event.description : event.description,
    location: language === 'fr' ? event.locationFr || event.location : event.location,
    details: language === 'fr' ? event.detailsFr || event.details : event.details,
  }
}

export default translations