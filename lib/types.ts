/**
 * TypeScript interfaces for the SOS Club website
 * Centralized type definitions for better type safety
 */

// Team member interface
export interface TeamMember {
  name: string
  role: string
  roleFr: string
  email: string
  instagram?: string
  linkedin?: string
  image?: string
}

// Bureau interface
export interface Bureau {
  year: string
  members: TeamMember[]
}

// Event interface
export interface Event {
  id: string
  date: string
  title: string
  titleFr: string
  description: string
  descriptionFr: string
  location: string
  locationFr: string
  image?: string
  details?: string
  detailsFr?: string
  gallery?: string[]
  category?: string
  attendees?: number
  fundsRaised?: number
  itemsCollected?: number
  registrationLink?: string
  maxAttendees?: number
  registrationDeadline?: string
}

// Events data structure
export interface EventsData {
  recentEvents: Event[]
  upcomingEvents: Event[]
  previousEvents: Event[]
}

// Team data structure
export interface TeamData {
  currentBureau: Bureau
  previousBureaus: Bureau[]
}

// Carousel item interface (generic)
export interface CarouselItem {
  [key: string]: any
}

// Form data interface
export interface JoinFormData {
  fullname: string
  email: string
  phone: string
  university: string
  studyField: string
  year: string
  motivation: string
}

// Form status type
export type FormStatus = 'idle' | 'loading' | 'success' | 'error'
