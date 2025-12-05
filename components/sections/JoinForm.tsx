"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Language, Translations } from "@/lib/translations"
import type { JoinFormData, FormStatus } from "@/lib/types"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface JoinFormProps {
  t: Translations
  language: Language
}

// Replace with your actual Google Form endpoint URL or set via env var
const GOOGLE_FORM_ACTION_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL || "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"

// Replace with your actual Google Form field IDs
const FORM_FIELD_IDS = {
  fullname: process.env.NEXT_PUBLIC_GOOGLE_FORM_FULLNAME_FIELD || "entry.123456789",
  email: process.env.NEXT_PUBLIC_GOOGLE_FORM_EMAIL_FIELD || "entry.987654321",
  phone: process.env.NEXT_PUBLIC_GOOGLE_FORM_PHONE_FIELD || "entry.456789012",
  university: process.env.NEXT_PUBLIC_GOOGLE_FORM_UNIVERSITY_FIELD || "entry.345678901",
  studyField: process.env.NEXT_PUBLIC_GOOGLE_FORM_STUDY_FIELD || "entry.234567890",
  year: process.env.NEXT_PUBLIC_GOOGLE_FORM_YEAR_FIELD || "entry.567890123",
  motivation: process.env.NEXT_PUBLIC_GOOGLE_FORM_MOTIVATION_FIELD || "entry.012345678",
}

export function JoinForm({ t, language }: JoinFormProps) {
  const [formData, setFormData] = useState<JoinFormData>({
    fullname: "",
    email: "",
    phone: "",
    university: "",
    studyField: "",
    year: "",
    motivation: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const ref = useScrollAnimation()
  const formConfigured = !GOOGLE_FORM_ACTION_URL.includes("YOUR_FORM_ID")
  const yearOptions: Record<Language, Array<{ value: string; label: string }>> = {
    en: [
      { value: "1st-year", label: "1st year" },
      { value: "2nd-year", label: "2nd year" },
      { value: "3rd-year", label: "3rd year" },
      { value: "4th-year", label: "4th year" },
      { value: "5th-year", label: "5th year" },
    ],
    fr: [
      { value: "1st-year", label: "1ère année" },
      { value: "2nd-year", label: "2ème année" },
      { value: "3rd-year", label: "3ème année" },
      { value: "4th-year", label: "4ème année" },
      { value: "5th-year", label: "5ème année" },
    ],
    ar: [
      { value: "1st-year", label: "السنة الأولى" },
      { value: "2nd-year", label: "السنة الثانية" },
      { value: "3rd-year", label: "السنة الثالثة" },
      { value: "4th-year", label: "السنة الرابعة" },
      { value: "5th-year", label: "السنة الخامسة" },
    ],
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!formConfigured) {
      setStatus("error")
      return
    }
    setStatus("loading")

    try {
      const googleFormData = new FormData()
      googleFormData.append(FORM_FIELD_IDS.fullname, formData.fullname)
      googleFormData.append(FORM_FIELD_IDS.email, formData.email)
      googleFormData.append(FORM_FIELD_IDS.phone, formData.phone)
      googleFormData.append(FORM_FIELD_IDS.university, formData.university)
      googleFormData.append(FORM_FIELD_IDS.studyField, formData.studyField)
      googleFormData.append(FORM_FIELD_IDS.year, formData.year)
      googleFormData.append(FORM_FIELD_IDS.motivation, formData.motivation)

      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        body: googleFormData,
        mode: "no-cors",
      })

      setStatus("success")
      setFormData({
        fullname: "",
        email: "",
        phone: "",
        university: "",
        studyField: "",
        year: "",
        motivation: "",
      })

      setTimeout(() => setStatus("idle"), 5000)
    } catch (error) {
      console.error("Form submission error:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  return (
  <section id="join" className="relative min-h-screen flex items-center justify-center py-20 md:py-32 bg-white">
    <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-3 text-balance text-primary-dark animate-fade-in-up animate-in">
          {t.join.title}
        </h2>
        {/* small subtitle under the main title */}
        <p className="text-center text-primary-dark/90 mb-8 max-w-2xl mx-auto text-base md:text-lg font-medium">
          {t.join.subtitle}
        </p>
        {!formConfigured && (
          <div className="max-w-2xl mx-auto mb-6 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 px-4 py-3 text-sm font-medium text-center">
            The join form is curreently unavailable. Please wait until its back online.
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <div ref={ref} className="bg-primary/5 shadow rounded-2xl p-8 border border-gray-100 animate-fade-in-up animate-stagger">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-primary-dark">
                    {t.join.form.fullname}
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder={t.join.form.fullnamePlaceholder}
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    required
                    className="h-11 bg-white text-primary-dark"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary-dark">
                    {t.join.form.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.join.form.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11 bg-white text-primary-dark"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary-dark">
                    {t.join.form.phone}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.join.form.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-11 bg-white text-primary-dark"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university" className="text-primary-dark">
                    {t.join.form.university}
                  </Label>
                  <Input
                    id="university"
                    type="text"
                    placeholder={t.join.form.universityPlaceholder}
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    required
                    className="h-11 bg-white text-primary-dark"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studyField" className="text-primary-dark">
                    {t.join.form.studyField}
                  </Label>
                  <Input
                    id="studyField"
                    type="text"
                    placeholder={t.join.form.studyFieldPlaceholder}
                    value={formData.studyField}
                    onChange={(e) => setFormData({ ...formData, studyField: e.target.value })}
                    required
                    className="h-11 bg-white text-primary-dark"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-primary-dark">
                    {t.join.form.year}
                  </Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                    <SelectTrigger className="h-11 bg-white text-primary-dark">
                      <SelectValue placeholder={t.join.form.yearPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {(yearOptions[language] || yearOptions.en).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation" className="text-primary-dark">
                  {t.join.form.motivation}
                </Label>
                <Textarea
                  id="motivation"
                  placeholder={t.join.form.motivationPlaceholder}
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  required
                  rows={4}
                  className="resize-none bg-white text-primary-dark"
                />
              </div>

              <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold" disabled={status === "loading" || !formConfigured}>
                {status === "loading" ? "Submitting..." : t.join.form.submit}
              </Button>

              {status === "success" && (
                <p className="text-center text-sm text-green-300 font-medium">{t.join.form.success}</p>
              )}

              {status === "error" && (
                <p className="text-center text-sm text-red-300 font-medium">{t.join.form.error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
