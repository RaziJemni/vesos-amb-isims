import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Translations } from "@/lib/translations";

/**
 * Hero section component
 * Main landing area with club title, subtitle, and call-to-action
 * Features animated background patterns and smooth scroll navigation
 */
interface HeroProps {
    t: Translations;
}

export function Hero({ t }: HeroProps) {
    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-primary text-primary-foreground">
            {/* Background pattern */}
            <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
            />

            <div className="container relative z-10 px-4 py-20 md:py-32">
                {/* Decorative circles */}
                <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary-foreground/10 animate-[spin_60s_linear_infinite]"
                />
                <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary-foreground/10 animate-[spin_45s_linear_infinite_reverse]"
                />

                <div className="mx-auto max-w-4xl text-center space-y-12 animate-fade-in-up animate-in">
                    {/* Subtle label above title */}
                    <div className="text-primary-foreground/70 font-medium tracking-wider uppercase text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                        Students Organization for Success
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance text-primary-foreground drop-shadow-sm">
                        {t.hero.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty leading-relaxed">
                        {t.hero.subtitle}
                    </p>

                    <div className="flex flex-col items-center gap-6 pt-4">
                        <Button
                            asChild
                            size="lg"
                            variant="secondary"
                            className="gap-2 text-lg px-8 py-6 hover:scale-105 transition-transform shadow-xl hover:shadow-2xl"
                        >
                            <a
                                href="#join"
                                className="inline-flex items-center gap-2"
                            >
                                {t.hero.cta}
                                <ArrowRight className="h-5 w-5" />
                            </a>
                        </Button>

                        {/* Scroll indicator */}
                        <div className="text-sm text-primary-foreground/60 flex items-center gap-2 animate-bounce">
                            <div className="w-5 h-10 rounded-full border-2 border-primary-foreground/20 relative">
                                <div className="absolute top-2 left-1/2 w-1 h-1 bg-primary-foreground/60 rounded-full -translate-x-1/2" />
                            </div>
                            Scroll to explore
                        </div>
                    </div>
                </div>
            </div>

            {/* Fade to white at the bottom so the following section sits on pure white */}
            <div className="absolute left-0 right-0 bottom-0 h-[9vh] pointer-events-none bg-gradient-to-b from-transparent to-white" />
        </section>
    );
}
