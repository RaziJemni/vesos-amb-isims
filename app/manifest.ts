import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "SOS Children's Village Ambassadors Club - ISIMS",
        short_name: "SOS Club ISIMS",
        description:
            "Official website of the SOS Children's Village Ambassadors Club of ISIMS (Higher Institute of Computer Science and Multimedia of Sfax).",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#00abec",
        icons: [
            {
                src: "/assets/icons/logo-blue.svg",
                sizes: "any",
                type: "image/svg+xml",
                purpose: "maskable",
            },
            {
                src: "/og-image.png",
                sizes: "1200x630",
                type: "image/png",
            },
        ],
    };
}
