import type React from "react";
import type { Metadata } from "next";
// Note: Aktiv Grotesk is a local/commercial font. To enable it, place
// WOFF2 files under `public/fonts/` and uncomment the `localFont` block
// below. Until the font files are added, fall back to Inter so the dev
// server and build remain stable.
import { Inter, Cairo } from "next/font/google";
import { cookies } from "next/headers";
import { JsonLd } from "@/components/seo/JsonLd";
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
const cairo = Cairo({
    subsets: ["arabic", "latin"],
    display: "swap",
    variable: "--font-cairo",
});

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.vesos-ambassadeurs-isims.tn";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "SOS Children's Village Ambassadors Club - ISIMS",
        template: "%s | SOS Club ISIMS",
    },
    description:
        "Join our mission to help children in difficult situations through charitable actions and solidarity events. Student organization at ISIMS committed to making a difference.",
    keywords: [
        "SOS Village",
        "SOS Children's Village",
        "SOS Village d'Enfants",
        "Club Ambassadeurs SOS",
        "Club SOS ISIMS",
        "VESOS ISIMS",
        "ISIMS",
        "Institut Supérieur d'Informatique et de Multimédia de Sfax",
        "student club",
        "volunteer",
        "charity",
        "solidarity",
        "Tunisia",
        "Tunisie",
        "Sfax",
        "نادي سفراء قرية الأطفال",
        "قرية الأطفال SOS",
        "المعهد العالي للإعلامية والملتيميديا بصفاقس",
        "تونس",
        "صفاقس",
    ],
    category: "Community & Charity",
    classification: "Non-Profit Student Organization",
    authors: [{ name: "SOS Club ISIMS" }],
    creator: "SOS Children's Village Ambassadors Club of ISIMS",
    publisher: "ISIMS",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    icons: {
        icon: "/assets/icons/logo-blue.svg",
        shortcut: "/assets/icons/logo-blue.svg",
        apple: "/assets/icons/logo-blue.svg",
    },
    openGraph: {
        title: "SOS Children's Village Ambassadors Club - ISIMS",
        description:
            "Join our mission to help children in difficult situations through charitable actions and solidarity events.",
        url: siteUrl,
        type: "website",
        locale: "en_US",
        alternateLocale: ["fr_FR", "ar_TN"],
        siteName: "SOS Club ISIMS",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "SOS Children's Village Ambassadors Club - ISIMS",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "SOS Children's Village Ambassadors Club - ISIMS",
        description:
            "Join our mission to help children in difficult situations through charitable actions and solidarity events.",
        images: ["/og-image.png"],
    },
    alternates: {
        canonical: "/",
        languages: {
            en: "/?lang=en",
            fr: "/?lang=fr",
            ar: "/?lang=ar",
            "x-default": "/",
        },
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
        other: {
            "msvalidate.01":
                process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
        },
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const language =
        (cookieStore.get("language")?.value as "en" | "fr" | "ar" | undefined) ||
        "en";
    const dir = language === "ar" ? "rtl" : "ltr";

    return (
        <html lang={language} dir={dir}>
            <head>
                <JsonLd siteUrl={siteUrl} />
            </head>
            <body
                className={`${aktiv.className} ${cairo.variable} font-sans antialiased`}
            >
                {children}
                <AnalyticsClient />
            </body>
        </html>
    );
}
