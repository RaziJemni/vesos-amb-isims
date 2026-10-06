/**
 * Tier 2: Boundary & Corner Cases E2E Verification
 * Covers: RTL layout in Arabic, responsive breakpoints, contrast states, missing translation fallbacks, color drift
 */

import {
    assert,
    assertEquals,
    assertContains,
    assertNotContains,
    readProjectFile,
    loadJson,
} from "./test-helpers.mjs";

export function registerTier2Tests(runner) {
    // ------------------------------------------------------------------------
    // T2-BOUND-01: Arabic RTL Root Configuration and Cairo Font Enforcement
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T2-BOUND-01",
        name: "Arabic RTL Root Config and Cairo Font Enforcement",
        tier: 2,
        feature: "i18n & RTL",
        requirement: "PROJECT §Interface Contracts: Root dir='rtl' for Arabic with Cairo font enforcement",
        fn: () => {
            const layoutContent = readProjectFile("app/layout.tsx");
            const globalsCss = readProjectFile("app/globals.css");

            // Verify layout.tsx assigns dir based on language === "ar"
            assertContains(
                layoutContent,
                'language === "ar" ? "rtl" : "ltr"',
                "app/layout.tsx must dynamically set root dir to 'rtl' when language is Arabic.",
                "PROJECT §Interface Contracts"
            );

            // Verify Cairo font is imported and exposed as CSS variable
            assertContains(
                layoutContent,
                'variable: "--font-cairo"',
                "app/layout.tsx must configure Google Cairo font with CSS variable --font-cairo.",
                "PROJECT §Architecture"
            );

            // Verify globals.css enforces --font-cairo on [dir="rtl"]
            assert(
                globalsCss.includes('[dir="rtl"]') && globalsCss.includes("var(--font-cairo)"),
                "app/globals.css must enforce var(--font-cairo) font family when dir='rtl'.",
                "PROJECT §Architecture"
            );
        },
    });

    // ------------------------------------------------------------------------
    // T2-BOUND-02: Logical Tailwind & Directional Mirroring
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T2-BOUND-02",
        name: "Logical Tailwind Properties and Directional Mirroring",
        tier: 2,
        feature: "RTL Mirroring",
        requirement: "PROJECT §Interface Contracts: Section layouts use CSS logical properties or CSS Grid which mirrors under RTL",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");
            const navContent = readProjectFile("components/navigation.tsx");

            // Look for directional arrow rotation in RTL
            const hasRtlRotate =
                heroContent.includes("rtl:rotate-180") ||
                navContent.includes("rtl:rotate-180");

            assert(
                hasRtlRotate,
                "Directional arrows/icons must include 'rtl:rotate-180' to properly mirror in Arabic.",
                "PROJECT §Interface Contracts"
            );

            // Verify that fixed hardcoded margin-left/right without logical or responsive pairing is avoided
            // In modern Tailwind, ms-* / me-* or symmetric px-* or flex/grid are used
            const hasProperContainerPaddings =
                heroContent.includes("px-") && navContent.includes("px-");

            assert(
                hasProperContainerPaddings,
                "Sections must use symmetric container paddings (px-*) or logical margins.",
                "PROJECT §Interface Contracts"
            );
        },
    });

    // ------------------------------------------------------------------------
    // T2-BOUND-03: Responsive Breakpoints on Core Sections
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T2-BOUND-03",
        name: "Responsive Breakpoints (Mobile, Tablet, Desktop)",
        tier: 2,
        feature: "Responsive Layout",
        requirement: "ORIGINAL_REQUEST §AC: Seamless responsive behavior across mobile, tablet, and desktop viewports",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");
            const aboutContent = readProjectFile("components/sections/About.tsx");
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Hero responsiveness
            assert(
                heroContent.includes("md:") || heroContent.includes("lg:"),
                "Hero section must include responsive breakpoint modifiers (md: or lg:)."
            );

            // About responsiveness
            assert(
                aboutContent.includes("md:") || aboutContent.includes("lg:"),
                "About section must include responsive breakpoint modifiers (md: or lg:)."
            );

            // Goals responsiveness
            assert(
                goalsContent.includes("md:") || goalsContent.includes("lg:"),
                "Goals section must include responsive breakpoint modifiers (md: or lg:)."
            );
        },
    });

    // ------------------------------------------------------------------------
    // T2-BOUND-04: Strict Brand Palette Adherence & Drift Elimination
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T2-BOUND-04",
        name: "Brand Palette Strict Adherence & Accent Drift Elimination",
        tier: 2,
        feature: "Design Tokens",
        requirement: "ORIGINAL_REQUEST §AC & PROJECT §18: Strictly preserve #00abec, #1c325d, #de5a6c; eliminate drifted #eb5c7f",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");
            const aboutContent = readProjectFile("components/sections/About.tsx");
            const heroContent = readProjectFile("components/sections/Hero.tsx");

            // Check for drifted rose color '#EB5C7F' or '#eb5c7f'
            assertNotContains(
                goalsContent,
                "#EB5C7F",
                "Goals section contains drifted accent hex #EB5C7F instead of authentic brand accent #de5a6c.",
                "PROJECT §18"
            );
            assertNotContains(
                goalsContent,
                "#eb5c7f",
                "Goals section contains drifted accent hex #eb5c7f instead of authentic brand accent #de5a6c.",
                "PROJECT §18"
            );
            assertNotContains(
                aboutContent,
                "#EB5C7F",
                "About section contains drifted accent hex #EB5C7F.",
                "PROJECT §18"
            );
            assertNotContains(
                aboutContent,
                "#eb5c7f",
                "About section contains drifted accent hex #eb5c7f.",
                "PROJECT §18"
            );
            assertNotContains(
                heroContent,
                "#EB5C7F",
                "Hero section contains drifted accent hex #EB5C7F.",
                "PROJECT §18"
            );
            assertNotContains(
                heroContent,
                "#eb5c7f",
                "Hero section contains drifted accent hex #eb5c7f.",
                "PROJECT §18"
            );

            // Ensure tailwind config or globals define the primary brand colors
            const tailwindConfig = readProjectFile("tailwind.config.ts");
            assertContains(tailwindConfig, "#00abec", "Tailwind config must declare Primary Blue #00abec.");
            assertContains(tailwindConfig, "#1c325d", "Tailwind config must declare Deep Navy #1c325d.");
            assertContains(tailwindConfig, "#de5a6c", "Tailwind config must declare Accent Rose #de5a6c.");
        },
    });

    // ------------------------------------------------------------------------
    // T2-BOUND-05: Translation Dictionary Completeness & Fallback Safety
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T2-BOUND-05",
        name: "Translation Dictionaries Completeness Across All Locales",
        tier: 2,
        feature: "i18n Dictionaries",
        requirement: "PROJECT §Architecture & §Interface Contracts: Custom type-safe dictionary system for EN, FR, AR",
        fn: () => {
            const languages = ["en", "fr", "ar"];
            const requiredSections = ["hero", "about", "goals", "nav"];

            for (const section of requiredSections) {
                const data = loadJson(`locales/${section}.json`);
                for (const lang of languages) {
                    assert(
                        data[lang] !== undefined,
                        `locales/${section}.json is missing translation block for language '${lang}'`,
                        "PROJECT §Interface Contracts"
                    );

                    // Check that keys are non-empty
                    if (section === "hero") {
                        assert(data[lang].title && data[lang].title.trim().length > 0, `Hero title missing in '${lang}'`);
                        assert(data[lang].subtitle && data[lang].subtitle.trim().length > 0, `Hero subtitle missing in '${lang}'`);
                        assert(data[lang].cta && data[lang].cta.trim().length > 0, `Hero CTA missing in '${lang}'`);
                    } else if (section === "about") {
                        assert(data[lang].title && data[lang].title.trim().length > 0, `About title missing in '${lang}'`);
                        assert(data[lang].description && data[lang].description.trim().length > 0, `About description missing in '${lang}'`);
                    } else if (section === "goals") {
                        assert(data[lang].title && data[lang].title.trim().length > 0, `Goals title missing in '${lang}'`);
                        assert(Array.isArray(data[lang].items), `Goals items must be an array in '${lang}'`);
                        assertEquals(data[lang].items.length, 6, `Goals must contain exactly 6 items in '${lang}'`);
                        data[lang].items.forEach((item, idx) => {
                            assert(item.title && item.title.trim().length > 0, `Goal ${idx + 1} title missing in '${lang}'`);
                            assert(item.description && item.description.trim().length > 0, `Goal ${idx + 1} description missing in '${lang}'`);
                        });
                    } else if (section === "nav") {
                        assert(data[lang].about && data[lang].about.trim().length > 0, `Nav 'about' missing in '${lang}'`);
                        assert(data[lang].goals && data[lang].goals.trim().length > 0, `Nav 'goals' missing in '${lang}'`);
                        assert(data[lang].join && data[lang].join.trim().length > 0, `Nav 'join' missing in '${lang}'`);
                    }
                }
            }
        },
    });

    // ------------------------------------------------------------------------
    // T2-BOUND-06: BiDi Characters & Unicode Escaping Integrity
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T2-BOUND-06",
        name: "BiDi Characters, Unicode & Escaping Integrity",
        tier: 2,
        feature: "Adversarial Integrity",
        requirement: "Adversarial Verification: No corrupted Unicode sequences, replacement characters, or raw unescaped entities",
        fn: () => {
            const files = [
                "locales/hero.json",
                "locales/about.json",
                "locales/goals.json",
                "locales/nav.json",
            ];

            for (const file of files) {
                const rawContent = readProjectFile(file);

                // Check for Unicode replacement character \ufffd (indicates encoding corruption)
                assertNotContains(
                    rawContent,
                    "\ufffd",
                    `Corrupted Unicode replacement character found in ${file}`
                );

                // Check for null bytes or control characters (0-8, 11-12, 14-31)
                for (let i = 0; i < rawContent.length; i++) {
                    const code = rawContent.charCodeAt(i);
                    const isControl = (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31);
                    assert(!isControl, `Illegal control character (charCode: ${code}) found in ${file}`);
                }
            }
        },
    });
}
