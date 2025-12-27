import { cookies } from "next/headers";
import { getTranslations, type Language } from "@/lib/translations";
import HomeClient from "@/app/HomeClient";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Goals } from "@/components/sections/Goals";
import { Team } from "@/components/sections/Team";
import { Events } from "@/components/sections/Events";
import { JoinForm } from "@/components/sections/JoinForm";
import { Footer } from "@/components/sections/Footer";

export default async function Home() {
    const cookieStore = await cookies();
    const language =
        (cookieStore.get("language")?.value as Language | undefined) || "en";
    const t = getTranslations(language);

    return (
        <main className="min-h-screen">
            <HomeClient initialLanguage={language} />
            <Hero t={t} />
            <About t={t} />
            <Goals t={t} />
            <Team t={t} language={language} />
            <Events t={t} language={language} />
            <JoinForm t={t} language={language} />
            <Footer t={t} />
        </main>
    );
}
