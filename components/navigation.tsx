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
        element?.scrollIntoView({ behavior: "smooth" });
    };

    const joinButtonClasses = cn(
        "transition-colors",
        isScrolled
            ? "bg-primary hover:bg-primary/90 text-white"
            : "bg-white hover:bg-white/90 text-primary",
    );

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-fade-in-down ${
                    isScrolled
                        ? "bg-background/50 backdrop-blur-sm shadow-md"
                        : "bg-transparent"
                }`}
            >
                <div className="container px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <button
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                            className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity"
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

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            {navItems.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => handleNavClick(item.href)}
                                    className="text-sm font-medium hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="w-px h-6 bg-gray-300"></div>
                            <Button
                                onClick={() => handleNavClick("#join")}
                                className={joinButtonClasses}
                            >
                                {t.nav.join}
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
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
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
                <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm md:hidden pt-16">
                    <div className="container px-4 py-8">
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.href}
                                    onClick={() => handleNavClick(item.href)}
                                    className="text-lg font-medium hover:text-primary transition-colors text-left py-2"
                                >
                                    {item.label}
                                </button>
                            ))}
                            <Button
                                onClick={() => handleNavClick("#join")}
                                className={cn(joinButtonClasses, "w-full mt-4")}
                            >
                                {t.nav.join}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
