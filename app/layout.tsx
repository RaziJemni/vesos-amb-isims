import type React from "react";
import type { Metadata } from "next";
// Note: Aktiv Grotesk is a local/commercial font. To enable it, place
// WOFF2 files under `public/fonts/` and uncomment the `localFont` block
// below. Until the font files are added, fall back to Inter so the dev
// server and build remain stable.
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import AnalyticsClient from "./AnalyticsClient";
import "./globals.css";

// Load Aktiv Grotesk from local files. Place your WOFF2 files under public/fonts/
// Example filenames expected (you can replace these or drop files there):
//  - public/fonts/AktivGrotesk-Regular.woff2
//  - public/fonts/AktivGrotesk-Medium.woff2
//  - public/fonts/AktivGrotesk-Bold.woff2
// Prefer local Aktiv Grotesk if font files are present; otherwise fall back to Inter

// Fallback font while Aktiv Grotesk files are not present
const aktiv = Inter({ subsets: ["latin"], display: "swap" });

/*
// To enable Aktiv Grotesk when you have the font files, copy them to
// public/fonts/ and use a const localFont call like this (example):

const aktivLocal = localFont({
  src: [
    { path: "/fonts/AktivGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "/fonts/AktivGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "/fonts/AktivGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-aktiv",
})

// then use aktivLocal.className on body instead of aktiv.className
*/

export const metadata: Metadata = {
    title: "SOS Children's Village Ambassadors Club - ISIMS",
    description:
        "Join our mission to help children in difficult situations through charitable actions and solidarity events. Student organization at ISIMS committed to making a difference.",
    keywords: [
        "SOS Village",
        "children",
        "charity",
        "ISIMS",
        "student club",
        "volunteer",
        "Tunisia",
        "Sfax",
    ],
    authors: [{ name: "SOS Club ISIMS" }],
    creator: "SOS Children's Village Ambassadors Club of ISIMS",
    publisher: "ISIMS",
    robots: "index, follow",
    icons: {
        icon: "/assets/icons/logo-isims.svg",
    },
    openGraph: {
        title: "SOS Children's Village Ambassadors Club - ISIMS",
        description:
            "Join our mission to help children in difficult situations through charitable actions and solidarity events.",
        type: "website",
        locale: "en_US",
        siteName: "SOS Club ISIMS",
    },
    twitter: {
        card: "summary_large_image",
        title: "SOS Children's Village Ambassadors Club - ISIMS",
        description:
            "Join our mission to help children in difficult situations through charitable actions and solidarity events.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${aktiv.className} font-sans antialiased`}>
                {children}
                <AnalyticsClient />
            </body>
        </html>
    );
}
