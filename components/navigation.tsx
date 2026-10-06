"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "./language-toggle";
import type { Language, Translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

/**
 * Navigation component
 * Fixed header with logo, navigation links, and language toggle
 * Features responsive mobile menu and scroll-based styling
 */
interface NavigationProps {
    t: Translations;
    currentLanguage: Language;
    onLanguageChange: (language: Language) => void;
}

export function Navigation({
    t,
    currentLanguage,
    onLanguageChange,
}: NavigationProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { label: t.nav.about, href: "#about" },
        { label: t.nav.goals, href: "#goals" },
        { label: t.nav.bureau, href: "#team" },
        { label: t.nav.events, href: "#events" },
    ];

    const handleNavClick = (href: string) => {
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (!element) return;
        element.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", href);
    };

    const joinButtonClasses = cn(
        "transition-all font-medium",
        isScrolled
            ? "bg-primary hover:bg-primary/90 text-white shadow-xs"
            : "bg-white hover:bg-white/90 text-primary-dark shadow-sm hover:shadow",
    );

    const learnMoreButtonClasses = cn(
        "transition-colors bg-transparent",
        isScrolled
            ? "border-primary-dark/30 text-primary-dark hover:bg-primary-dark/5 hover:border-primary-dark"
            : "border-white/80 text-white/90 hover:bg-white/10 hover:text-white hover:border-white",
    );

    const mobileMenuButtonClasses = cn(
        "transition-colors",
        isScrolled || isMobileMenuOpen
            ? "text-primary-dark hover:bg-gray-100 hover:text-primary-dark"
            : "text-white/90 hover:bg-white/10 hover:text-white",
    );

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in-down",
                    isScrolled
                        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/40"
                        : "bg-transparent",
                )}
            >
                <div className="container px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo Section */}
                        <div className="flex items-center gap-2 md:gap-3">
                            {/* ISIMS Logo */}
                            <button
                                onClick={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })
                                }
                                className="hover:opacity-80 transition-opacity"
                                aria-label="Scroll to top"
                            >
                                <img
                                    src="/assets/icons/logo-isims.svg"
                                    alt="ISIMS Logo"
                                    className="h-10 md:h-12"
                                />
                            </button>
                            {/* Main Logo */}
                            <button
                                onClick={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })
                                }
                                className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity"
                                aria-label="SOS Club Home"
                            >
                                {/* Show white logo when nav is over the hero (transparent), otherwise show blue logo */}
                                <img
                                    src={
                                        isScrolled
                                            ? "/assets/icons/logo-blue.svg"
                                            : "/assets/icons/logo-white.svg"
                                    }
                                    alt="SOS Club Logo"
                                    className="h-26 md:h-34"
                                />
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.href);
                                    }}
                                    className={cn(
                                        "text-sm font-medium transition-colors",
                                        isScrolled
                                            ? "text-primary-dark hover:text-primary"
                                            : "text-white/90 hover:text-white",
                                    )}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <div
                                className={cn(
                                    "w-px h-6 transition-colors",
                                    isScrolled ? "bg-gray-200" : "bg-white/20",
                                )}
                            />
                            <Button asChild className={joinButtonClasses}>
                                <a
                                    href="#join"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick("#join");
                                    }}
                                >
                                    {t.nav.join}
                                </a>
                            </Button>
                            <Button
                                onClick={() =>
                                    window.open("https://sosve.tn", "_blank")
                                }
                                variant="outline"
                                className={learnMoreButtonClasses}
                            >
                                {t.nav.learnMore}
                            </Button>
                            <LanguageToggle
                                currentLanguage={currentLanguage}
                                onChange={onLanguageChange}
                                isScrolled={isScrolled}
                            />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-2">
                            <LanguageToggle
                                currentLanguage={currentLanguage}
                                onChange={onLanguageChange}
                                isScrolled={isScrolled}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={
                                    isMobileMenuOpen
                                        ? "Close navigation menu"
                                        : "Open navigation menu"
                                }
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                                className={mobileMenuButtonClasses}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-md md:hidden pt-16 border-b border-border/40">
                    <div className="container px-4 py-8">
                        <div className="flex flex-col gap-3">
                            {navItems.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick(item.href);
                                    }}
                                    className="text-lg font-medium text-primary-dark hover:text-primary transition-colors text-start py-2.5 border-b border-border/30 last:border-b-0"
                                >
                                    {item.label}
                                </a>
                            ))}
                            <Button
                                asChild
                                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white shadow-md font-medium"
                            >
                                <a
                                    href="#join"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleNavClick("#join");
                                    }}
                                >
                                    {t.nav.join}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
