import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SOS Children's Village Ambassadors Club - ISIMS",
  description: "Join our mission to help children in difficult situations through charitable actions and solidarity events. Student organization at ISIMS committed to making a difference.",
  keywords: ["SOS Village", "children", "charity", "ISIMS", "student club", "volunteer", "Tunisia", "Sfax"],
  authors: [{ name: "SOS Club ISIMS" }],
  creator: "SOS Children's Village Ambassadors Club of ISIMS",
  publisher: "ISIMS",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "SOS Children's Village Ambassadors Club - ISIMS",
    description: "Join our mission to help children in difficult situations through charitable actions and solidarity events.",
    type: "website",
    locale: "en_US",
    siteName: "SOS Club ISIMS",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOS Children's Village Ambassadors Club - ISIMS",
    description: "Join our mission to help children in difficult situations through charitable actions and solidarity events.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
