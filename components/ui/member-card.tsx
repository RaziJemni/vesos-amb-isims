"use client"

import { Mail, Instagram, Linkedin } from "lucide-react"
import type { ReactNode } from "react"
import type { Language } from "@/lib/translations"

interface Member {
  name: string
  role?: string
  roleFr?: string
  email?: string
  instagram?: string
  linkedin?: string
  image?: string
}

interface MemberCardProps {
  member: Member
  language?: Language
  className?: string
  children?: ReactNode
}

export default function MemberCard({ member, language = "en", className = "", children }: MemberCardProps) {
  const role = language === "fr" ? (member.roleFr || member.role) : member.role

  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      <div className="w-full h-40 bg-gray-100 relative">
        {member.image ? (
          // keep plain img fallback if Image isn't available in some environments
          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary text-white"> 
            <span className="text-lg font-medium">{member.name.split(" ")[0]}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{member.name}</h3>
        {role && <p className="text-sm text-muted-foreground mb-3">{role}</p>}

        <div className="flex items-center gap-2">
          {member.email && (
            <a href={`mailto:${member.email}`} className="text-sm text-primary flex items-center gap-1 hover:underline">
              <Mail className="w-4 h-4" />
              <span className="sr-only">Email</span>
              <span className="truncate max-w-[8rem]">{member.email}</span>
            </a>
          )}

          {member.instagram && (
            <a href={member.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
              <Instagram className="w-5 h-5" />
            </a>
          )}

          {member.linkedin && (
            <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
        </div>

        {children}
      </div>
    </div>
  )
}
