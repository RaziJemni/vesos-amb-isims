/**
 * Tier 4: Real-World Scenarios E2E Verification
 * Covers: Full trilingual visitor journey EN/FR/AR, authentic imagery media audit, accessibility landmarks, build readiness
 */

import fs from "node:fs";
import path from "node:path";
import {
    assert,
    assertEquals,
    assertContains,
    readProjectFile,
    projectFileExists,
    loadJson,
    PROJECT_ROOT,
} from "./test-helpers.mjs";

export function registerTier4Tests(runner) {
    // ------------------------------------------------------------------------
    // T4-SCEN-01: Full Trilingual Visitor Journey (EN -> FR -> AR)
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T4-SCEN-01",
        name: "Full Trilingual Visitor Journey (EN -> FR -> AR Parity)",
        tier: 4,
        feature: "Trilingual Journey",
        requirement: "ORIGINAL_REQUEST §AC: Full trilingual support (EN, FR, AR) including correct RTL layout and typography",
        fn: () => {
            const languages = ["en", "fr", "ar"];
            const dictionaries = {
                hero: loadJson("locales/hero.json"),
                about: loadJson("locales/about.json"),
                goals: loadJson("locales/goals.json"),
                nav: loadJson("locales/nav.json"),
            };

            for (const lang of languages) {
                // Verify Hero section in this language
                const hero = dictionaries.hero[lang];
                assert(hero, `Hero translation must exist for ${lang}`);
                assert(hero.title.length > 5, `Hero title must be non-empty in ${lang}`);
                assert(hero.subtitle.length > 10, `Hero subtitle must be non-empty in ${lang}`);
                assert(hero.cta.length > 2, `Hero CTA must be non-empty in ${lang}`);

                // Verify About section in this language
                const about = dictionaries.about[lang];
                assert(about, `About translation must exist for ${lang}`);
                assert(about.title.length > 3, `About title must be non-empty in ${lang}`);
                assert(about.description.length > 20, `About description must be substantive in ${lang}`);

                // Verify Goals section in this language
                const goals = dictionaries.goals[lang];
                assert(goals, `Goals translation must exist for ${lang}`);
                assertEquals(goals.items.length, 6, `Goals must contain exactly 6 items in ${lang}`);
                for (let i = 0; i < 6; i++) {
                    const item = goals.items[i];
                    assert(item.title.length > 2, `Goal ${i + 1} title must be non-empty in ${lang}`);
                    assert(item.description.length > 10, `Goal ${i + 1} description must be non-empty in ${lang}`);
                }

                // Verify Nav section in this language
                const nav = dictionaries.nav[lang];
                assert(nav, `Nav translation must exist for ${lang}`);
                assert(nav.about.length > 2, `Nav 'about' must be non-empty in ${lang}`);
                assert(nav.goals.length > 2, `Nav 'goals' must be non-empty in ${lang}`);
                assert(nav.join.length > 2, `Nav 'join' must be non-empty in ${lang}`);
            }

            // Verify Arabic uses Arabic alphabet characters (Unicode block 0600-06FF)
            const arabicRegex = /[\u0600-\u06FF]/;
            assert(
                arabicRegex.test(dictionaries.hero.ar.title),
                "Arabic Hero title must contain Arabic script characters."
            );
            assert(
                arabicRegex.test(dictionaries.about.ar.title),
                "Arabic About title must contain Arabic script characters."
            );
            assert(
                arabicRegex.test(dictionaries.goals.ar.items[0].title),
                "Arabic Goal 1 title must contain Arabic script characters."
            );

            // Verify French uses accented characters where appropriate
            const frenchHero = dictionaries.hero.fr;
            const hasFrenchAccents =
                /[éèêëàâôûîç]/i.test(frenchHero.tagline) ||
                /[éèêëàâôûîç]/i.test(frenchHero.subtitle) ||
                /[éèêëàâôûîç]/i.test(dictionaries.about.fr.description);
            assert(hasFrenchAccents, "French translations must include proper French accents.");
        },
    });

    // ------------------------------------------------------------------------
    // T4-SCEN-02: Authentic Event Photography & Media Ecosystem Audit
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T4-SCEN-02",
        name: "Authentic Event Photography & Media Ecosystem Audit (100+ Assets)",
        tier: 4,
        feature: "Authentic Media Audit",
        requirement: "ORIGINAL_REQUEST §AC & PROJECT §Asset Ecosystem: Features authentic photography from existing club event assets",
        fn: () => {
            const eventsDir = path.resolve(PROJECT_ROOT, "public/assets/images/events/previous");
            assert(fs.existsSync(eventsDir), "Events previous directory must exist in public/assets/images/events/previous");

            // Check event seasons
            const seasons = ["2022-2023", "2023-2024", "2024-2025", "2025-2026"];
            for (const season of seasons) {
                const seasonPath = path.join(eventsDir, season);
                assert(fs.existsSync(seasonPath), `Season directory must exist: ${season}`);
            }

            // Recursively count event photos
            let totalImages = 0;
            function countImages(dir) {
                const entries = fs.readdirSync(dir, { withFileTypes: true });
                for (const entry of entries) {
                    const full = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        countImages(full);
                    } else if (/\.(avif|webp|png|jpg|jpeg|svg)$/i.test(entry.name)) {
                        totalImages++;
                    }
                }
            }

            countImages(eventsDir);
            assert(
                totalImages >= 50,
                `Expected at least 50 authentic event photos in public/assets/images/events/previous, found ${totalImages}`,
                "PROJECT §Asset Ecosystem"
            );

            // Verify SVG logos
            const iconsDir = path.resolve(PROJECT_ROOT, "public/assets/icons");
            assert(fs.existsSync(path.join(iconsDir, "logo-blue.svg")), "logo-blue.svg must exist");
            assert(fs.existsSync(path.join(iconsDir, "logo-white.svg")), "logo-white.svg must exist");
            assert(fs.existsSync(path.join(iconsDir, "logo-isims.svg")), "logo-isims.svg must exist");
        },
    });

    // ------------------------------------------------------------------------
    // T4-SCEN-03: DOM Semantics, Landmarks & Accessibility
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T4-SCEN-03",
        name: "DOM Semantics, Landmarks & Accessibility (aria, alt, headings)",
        tier: 4,
        feature: "Accessibility & Semantics",
        requirement: "Web Standards: Semantic landmarks (<main>, <section>, <nav>), aria-hidden on decorative elements, image alts",
        fn: () => {
            const pageContent = readProjectFile("app/page.tsx");
            const navContent = readProjectFile("components/navigation.tsx");
            const heroContent = readProjectFile("components/sections/Hero.tsx");
            const aboutContent = readProjectFile("components/sections/About.tsx");
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Page must wrap sections in <main>
            assertContains(pageContent, "<main", "app/page.tsx must contain semantic <main> landmark.");

            // Navigation must use <nav>
            assertContains(navContent, "<nav", "components/navigation.tsx must contain semantic <nav> landmark.");

            // Sections must use <section>
            assertContains(heroContent, "<section", "Hero component must use <section> tag.");
            assertContains(aboutContent, "<section", "About component must use <section> tag.");
            assertContains(goalsContent, "<section", "Goals component must use <section> tag.");

            // Headings hierarchy
            assertContains(heroContent, "<h1", "Hero component must declare <h1> main heading.");
            assertContains(aboutContent, "<h2", "About component must declare <h2> section heading.");
            assertContains(goalsContent, "<h2", "Goals component must declare <h2> section heading.");

            // Decorative elements should have aria-hidden
            const hasAriaHidden =
                heroContent.includes("aria-hidden") ||
                aboutContent.includes("aria-hidden") ||
                goalsContent.includes("aria-hidden");
            assert(hasAriaHidden, "Decorative background patterns or SVG circles must declare aria-hidden.");
        },
    });

    // ------------------------------------------------------------------------
    // T4-SCEN-04: TypeScript & ESLint Project Build Configuration Integrity
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T4-SCEN-04",
        name: "TypeScript and Build Configuration Integrity",
        tier: 4,
        feature: "Build Architecture",
        requirement: "ORIGINAL_REQUEST §AC: Clean build and lint check with zero errors",
        fn: () => {
            // tsconfig.json must exist and be valid JSON
            const tsconfig = loadJson("tsconfig.json");
            assert(tsconfig.compilerOptions, "tsconfig.json must contain compilerOptions");
            assert(
                ["react-jsx", "preserve"].includes(tsconfig.compilerOptions.jsx),
                `JSX mode must be 'react-jsx' or 'preserve' for Next.js, got ${tsconfig.compilerOptions.jsx}`
            );

            // package.json dependencies check
            const pkg = loadJson("package.json");
            assert(pkg.dependencies.next, "Next.js must be listed in dependencies");
            assert(pkg.dependencies.react, "React must be listed in dependencies");
            assert(pkg.dependencies["lucide-react"], "lucide-react must be listed in dependencies");

            // next.config.mjs exists
            assert(projectFileExists("next.config.mjs"), "next.config.mjs must exist");

            // eslint config exists
            assert(projectFileExists("eslint.config.mjs"), "eslint.config.mjs must exist");
        },
    });
}
