interface JsonLdProps {
    siteUrl: string;
}

export function JsonLd({ siteUrl }: JsonLdProps) {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": ["NGO", "EducationalOrganization"],
        name: "SOS Children's Village Ambassadors Club - ISIMS",
        alternateName: [
            "Club Ambassadeurs SOS Village d'Enfants - ISIMS",
            "نادي سفراء قرية الأطفال SOS في ISIMS",
            "SOS Club ISIMS",
            "VESOS ISIMS",
        ],
        url: siteUrl,
        logo: `${siteUrl}/assets/icons/logo-blue.svg`,
        image: `${siteUrl}/og-image.png`,
        description:
            "Official student club of SOS Children's Villages at the Higher Institute of Computer Science and Multimedia of Sfax (ISIMS). Dedicated to supporting children in vulnerable situations through charitable and solidarity events.",
        email: "club.ambassadeurs.vesostn.isims@gmail.com",
        foundingLocation: {
            "@type": "Place",
            name: "Sfax, Tunisia",
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: "Sfax",
            addressRegion: "Sfax",
            addressCountry: "TN",
            streetAddress:
                "ISIMS, Pôle Technologique de Sfax, Route de Tunis Km 10",
        },
        parentOrganization: {
            "@type": "CollegeOrUniversity",
            name: "Institut Supérieur d'Informatique et de Multimédia de Sfax (ISIMS)",
            url: "http://www.isimsf.rnu.tn",
        },
        sameAs: [
            "https://github.com/RaziJemni/vesos-amb-isims",
            "https://facebook.com/sos.isims",
            "https://instagram.com/sos_isims",
        ],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "SOS Club ISIMS",
        alternateName: "Club Ambassadeurs SOS Village d'Enfants ISIMS",
        url: siteUrl,
        inLanguage: ["en", "fr", "ar"],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(websiteSchema),
                }}
            />
        </>
    );
}
