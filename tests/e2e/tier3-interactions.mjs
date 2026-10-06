/**
 * Tier 3: Cross-Feature Interactions E2E Verification
 * Covers: Navbar transition over Deep Navy, Bento grid under RTL, impact chips in multi-column, asset filesystem integrity
 */

import path from "node:path";
import fs from "node:fs";
import {
    assert,
    assertNotContains,
    assertNotRegex,
    readProjectFile,
    PROJECT_ROOT,
} from "./test-helpers.mjs";

export function registerTier3Tests(runner) {
    // ------------------------------------------------------------------------
    // T3-INT-01: Navbar Seamless Transition Over Deep Navy Canvas
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T3-INT-01",
        name: "Navbar Seamless Transition Over Deep Navy Hero Canvas",
        tier: 3,
        feature: "Cross-Feature Transition",
        requirement: "PROJECT §Interface Contracts: Hero ↔ Navigation contract",
        fn: () => {
            const navContent = readProjectFile("components/navigation.tsx");
            const heroContent = readProjectFile("components/sections/Hero.tsx");

            // Hero canvas must be Primary Blue
            const hasHeroCanvas =
                heroContent.includes("#00abec") ||
                heroContent.includes("bg-primary") ||
                heroContent.includes("from-[#00abec]");

            assert(
                hasHeroCanvas,
                "Hero canvas must use Primary Blue for navigation contrast contract to hold.",
                "USER_REQUEST"
            );

            // Un-scrolled Navbar must be bg-transparent (so it overlays Hero smoothly without white seam)
            const hasTransparentNav =
                navContent.includes('!isScrolled') ||
                navContent.includes('isScrolled ?') ||
                navContent.includes('bg-transparent');

            assert(
                hasTransparentNav,
                "Navbar must maintain transparent background over Hero when !isScrolled.",
                "PROJECT §Interface Contracts"
            );

            // Navbar must not have a hardcoded white background when !isScrolled
            assertNotRegex(
                navContent,
                /className=["'][^"']*bg-white[^"']*["']\s+.*isScrolled/,
                "Navbar must not have static opaque white background when over Hero."
            );
        },
    });

    // ------------------------------------------------------------------------
    // T3-INT-02: Goals Bento Grid Logical Flow Under RTL
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T3-INT-02",
        name: "Goals Bento Grid Flow and Directional Symmetry Under RTL",
        tier: 3,
        feature: "Bento × RTL",
        requirement: "ORIGINAL_REQUEST §R3: Ensure seamless RTL mirroring for Arabic",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Check that the container uses CSS Grid which automatically mirrors columns under dir="rtl"
            assert(
                goalsContent.includes("grid"),
                "Goals section must use CSS Grid for natural RTL column reversal.",
                "ORIGINAL_REQUEST §R3"
            );

            // Check that if directional icons exist, they mirror under RTL
            if (goalsContent.includes("ArrowRight") || goalsContent.includes("ChevronRight")) {
                assert(
                    goalsContent.includes("rtl:rotate-180"),
                    "Directional chevron or arrow icons in Goals must specify rtl:rotate-180.",
                    "ORIGINAL_REQUEST §R3"
                );
            }

            // Ensure text alignment does not force fixed text-left on cards
            assertNotContains(
                goalsContent,
                "text-left",
                "Goals cards should use logical text alignment or inherited alignment instead of hardcoded 'text-left'."
            );
        },
    });

    // ------------------------------------------------------------------------
    // T3-INT-03: About Section Impact Chips in Multi-Column Grid
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T3-INT-03",
        name: "About Section Impact Chips Multi-Column Responsive Integration",
        tier: 3,
        feature: "Story × Impact Chips",
        requirement: "ORIGINAL_REQUEST §R2: Left column presents mission story paired with 3 clear impact chips",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");

            // Look for impact chips in About section
            const hasImpactChips =
                aboutContent.includes("2022") ||
                aboutContent.includes("ISIMS") ||
                aboutContent.includes("Solidarity") ||
                aboutContent.includes("chips") ||
                aboutContent.includes("metrics") ||
                aboutContent.includes("impact");

            assert(
                hasImpactChips,
                "About section must contain impact metrics chips alongside the narrative story.",
                "ORIGINAL_REQUEST §R2"
            );

            // Container for chips should use flex or grid to ensure wrapping
            const hasFlexibleContainer =
                aboutContent.includes("flex-wrap") ||
                aboutContent.includes("grid-cols-") ||
                aboutContent.includes("flex") ||
                aboutContent.includes("gap-");

            assert(
                hasFlexibleContainer,
                "Impact chips must be arranged in a responsive flex-wrap or grid container to prevent overflow.",
                "ORIGINAL_REQUEST §R2"
            );
        },
    });

    // ------------------------------------------------------------------------
    // T3-INT-04: Authentic Image Asset Path Resolution on Disk
    // ------------------------------------------------------------------------
    runner.registerTest({
        id: "T3-INT-04",
        name: "Authentic Image Asset References Validation on Filesystem",
        tier: 3,
        feature: "Asset Integrity",
        requirement: "ORIGINAL_REQUEST §AC: Features authentic photography from existing club event assets",
        fn: () => {
            const filesToCheck = [
                "components/sections/Hero.tsx",
                "components/sections/About.tsx",
                "components/navigation.tsx",
            ];

            const assetPattern = /\/(?:assets\/[a-zA-Z0-9_\-./]+)/g;
            let totalChecked = 0;

            for (const file of filesToCheck) {
                const content = readProjectFile(file);
                const matches = content.match(assetPattern) || [];

                for (const assetPath of matches) {
                    // Ignore code comments or non-file tokens
                    if (assetPath.endsWith(".tsx") || assetPath.endsWith(".ts")) continue;

                    const relPath = path.join("public", assetPath.replace(/^\//, ""));
                    const fullPath = path.resolve(PROJECT_ROOT, relPath);

                    assert(
                        fs.existsSync(fullPath),
                        `Asset referenced in ${file} does not exist on disk: ${assetPath} (looked at ${fullPath})`,
                        "ORIGINAL_REQUEST §AC"
                    );

                    const stats = fs.statSync(fullPath);
                    assert(
                        stats.size > 0,
                        `Asset referenced in ${file} is 0 bytes: ${assetPath}`,
                        "ORIGINAL_REQUEST §AC"
                    );
                    totalChecked++;
                }
            }

            assert(totalChecked > 0, "At least one asset reference must be validated across checked components.");
        },
    });
}
