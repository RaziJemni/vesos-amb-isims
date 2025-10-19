"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { TranslationKey } from "@/lib/translations"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface JoinFormProps {
  t: TranslationKey
}

// UPDATE THIS: Replace with your actual Google Form endpoint URL
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse"

// UPDATE THIS: Replace with your actual Google Form field IDs
const FORM_FIELD_IDS = {
  fullname: "entry.123456789",
  email: "entry.987654321",
  phone: "entry.456789012",
  university: "entry.345678901",
  studyField: "entry.234567890",
  year: "entry.123456789",
  motivation: "entry.012345678",
}

export function JoinForm({ t }: JoinFormProps) {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    university: "",
    studyField: "",
    year: "",
    motivation: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const ref = useScrollAnimation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <section id="join" className="py-20 md:py-32 bg-gradient-to-b from-primary to-dark-blue text-white">
      <div className="container px-4">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-4 text-balance text-secondary animate-fade-in-up animate-in">
          {t.join.title}
        </h2>
        <p className="text-center text-white/90 mb-12 max-w-2xl mx-auto">{t.join.subtitle}</p>

        <div className="mx-auto max-w-2xl">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <form ref={ref} onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up animate-stagger">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-white">
                    {t.join.form.fullname}
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder={t.join.form.fullnamePlaceholder}
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                    required
                    className="h-11 bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    {t.join.form.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t.join.form.emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-11 bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    {t.join.form.phone}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t.join.form.phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-11 bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university" className="text-white">
                    {t.join.form.university}
                  </Label>
                  <Input
                    id="university"
                    type="text"
                    placeholder={t.join.form.universityPlaceholder}
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    required
                    className="h-11 bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studyField" className="text-white">
                    {t.join.form.studyField}
                  </Label>
                  <Input
                    id="studyField"
                    type="text"
                    placeholder={t.join.form.studyFieldPlaceholder}
                    value={formData.studyField}
                    onChange={(e) => setFormData({ ...formData, studyField: e.target.value })}
                    required
                    className="h-11 bg-white/90"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-white">
                    {t.join.form.year}
                  </Label>
                  <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                    <SelectTrigger className="h-11 bg-white/90">
                      <SelectValue placeholder={t.join.form.yearPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st-year">1ère année</SelectItem>
                      <SelectItem value="2nd-year">2ème année</SelectItem>
                      <SelectItem value="3rd-year">3ème année</SelectItem>
                      <SelectItem value="4th-year">4ème année</SelectItem>
                      <SelectItem value="5th-year">5ème année</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="motivation" className="text-white">
                  {t.join.form.motivation}
                </Label>
                <Textarea
                  id="motivation"
                  placeholder={t.join.form.motivationPlaceholder}
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  required
                  rows={4}
                  className="resize-none bg-white/90"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold"
                disabled={status === "loading"}
              >
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
