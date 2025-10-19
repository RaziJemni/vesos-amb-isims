"use client"

import { useState } from "react"
import { getTranslations, type Language } from "@/lib/translations"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/sections/Hero"
import { About } from "@/components/sections/About"
import { Goals } from "@/components/sections/Goals"
import { Team } from "@/components/sections/Team"
import { Events } from "@/components/sections/Events"
import { JoinForm } from "@/components/sections/JoinForm"
import { Footer } from "@/components/sections/Footer"

export default function Home() {
  const [language, setLanguage] = useState<Language>("en")

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"))
  }

  const t = getTranslations(language)

  return (
    <main className="min-h-screen">
      <Navigation t={t} currentLanguage={language} onLanguageToggle={toggleLanguage} />
      <Hero t={t} />
      <About t={t} />
      <Goals t={t} />
      <Team t={t} language={language} />
      <Events t={t} language={language} />
      <JoinForm t={t} />
      <Footer t={t} />
    </main>
  )
}
