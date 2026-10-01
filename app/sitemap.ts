import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? process.env.NEXT_PUBLIC_SITE_URL
        : process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "https://sos-club-isims.vercel.app";

    return [
        {
            url: siteUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
            alternates: {
                languages: {
                    en: `${siteUrl}/?lang=en`,
                    fr: `${siteUrl}/?lang=fr`,
                    ar: `${siteUrl}/?lang=ar`,
                },
            },
        },
    ];
}
