/**
 * Tier 1: Feature Coverage E2E Verification
 * Covers: Hero Section (R1), Narrative About (R2), Bento Goals (R3), Fixed Navigation
 * Minimum 5 test cases per feature.
 */

import {
    assert,
    assertContains,
    assertNotContains,
    assertNotRegex,
    readProjectFile,
    loadJson,
} from "./test-helpers.mjs";

export function registerTier1Tests(runner) {
    // ------------------------------------------------------------------------
    // Feature 1: Hero Section (R1) - 6 Test Cases
    // ------------------------------------------------------------------------

    runner.registerTest({
        id: "T1-HERO-01",
        name: "Hero Section Canvas uses Primary Blue (#00abec)",
        tier: 1,
        feature: "Hero",
        requirement: "USER_REQUEST: Change background color to primary blue (#00abec)",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");
            
            // Check that hero container uses Primary Blue class or token
            const hasPrimaryBlueBg =
                heroContent.includes("#00abec") ||
                heroContent.includes("bg-primary") ||
                heroContent.includes("from-[#00abec]");

            assert(
                hasPrimaryBlueBg,
                "Hero section must use Primary Blue (#00abec) as background container.",
                "USER_REQUEST"
            );
        },
    });

    runner.registerTest({
        id: "T1-HERO-02",
        name: "Elimination of Hero AI Slop (spinning wireframes, 4rem tech grid, fade mask)",
        tier: 1,
        feature: "Hero",
        requirement: "ORIGINAL_REQUEST §R1 & §AC: Eliminates all spinning wireframe border animations, artificial grid backgrounds, and gradient masks",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");

            // Must NOT have spinning border animation
            assertNotRegex(
                heroContent,
                /animate-\[spin_\d+s/,
                "Hero section still contains spinning wireframe circle animation (animate-[spin_...]).",
                "ORIGINAL_REQUEST §R1"
            );

            // Must NOT have 4rem grid background pattern
            assertNotContains(
                heroContent,
                "bg-[size:4rem_4rem]",
                "Hero section still contains artificial 4rem grid coordinate background.",
                "ORIGINAL_REQUEST §R1"
            );

            // Must NOT have artificial bottom fade-to-white gradient mask
            assertNotRegex(
                heroContent,
                /bg-gradient-to-b\s+from-transparent\s+to-white/,
                "Hero section still contains artificial 9vh fade-to-white gradient mask.",
                "ORIGINAL_REQUEST §R1"
            );
        },
    });

    runner.registerTest({
        id: "T1-HERO-03",
        name: "Hero Asymmetric Human-Centered Layout Structure",
        tier: 1,
        feature: "Hero",
        requirement: "ORIGINAL_REQUEST §R1: Asymmetric, human-centered layout on Deep Navy",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");

            // Check for asymmetric multi-column layout classes (e.g. grid-cols-1 lg:grid-cols-12 or lg:grid-cols-2)
            const hasAsymmetricGrid =
                heroContent.includes("lg:grid-cols-") ||
                heroContent.includes("md:grid-cols-") ||
                heroContent.includes("lg:flex-row") ||
                (heroContent.includes("grid") && (heroContent.includes("col-span-") || heroContent.includes("gap-")));

            assert(
                hasAsymmetricGrid,
                "Hero section must implement an asymmetric layout (e.g. multi-column grid/flex pairing copy and photo collage).",
                "ORIGINAL_REQUEST §R1"
            );

            // Must not be a purely static centered text-only block (like mx-auto max-w-4xl text-center without media)
            const isSingleCenteredBlock =
                heroContent.includes("mx-auto max-w-4xl text-center") &&
                !heroContent.includes("lg:grid-cols-") &&
                !heroContent.includes("<img") &&
                !heroContent.includes("<Image");

            assert(!isSingleCenteredBlock, "Hero is still an isolated centered text block without asymmetric media layout.");
        },
    });

    runner.registerTest({
        id: "T1-HERO-04",
        name: "Hero Social Proof Badge presence ('✦ Students Organization for Success • ISIMS Sfax')",
        tier: 1,
        feature: "Hero",
        requirement: "ORIGINAL_REQUEST §R1: Social proof badges ('✦ Students Organization for Success • ISIMS Sfax')",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");
            const heroJson = loadJson("locales/hero.json");

            const hasSocialProofInCode =
                heroContent.includes("Students Organization for Success") ||
                heroContent.includes("ISIMS Sfax") ||
                heroContent.includes("✦");

            const hasSocialProofInJson =
                (heroJson.en?.tagline && heroJson.en.tagline.includes("Students Organization for Success")) ||
                (heroJson.fr?.tagline && heroJson.fr.tagline.includes("Organisation des Étudiants")) ||
                (heroJson.ar?.tagline && heroJson.ar.tagline.includes("منظمة طلابية"));

            assert(
                hasSocialProofInCode || hasSocialProofInJson,
                "Hero section must display the social proof badge for ISIMS Sfax.",
                "ORIGINAL_REQUEST §R1"
            );
        },
    });

    runner.registerTest({
        id: "T1-HERO-05",
        name: "Hero Dual High-Contrast Action Buttons",
        tier: 1,
        feature: "Hero",
        requirement: "ORIGINAL_REQUEST §R1: Dual high-contrast action buttons",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");

            // Must contain two distinct action targets: primary join action and secondary external donate/action
            const hasJoinAction = heroContent.includes("#join") || heroContent.includes("cta");
            const hasSecondaryAction =
                heroContent.includes("sosve.tn") ||
                heroContent.includes("donate") ||
                heroContent.includes("secondary");

            assert(hasJoinAction, "Hero must contain primary join/membership action button.");
            assert(hasSecondaryAction, "Hero must contain secondary high-contrast action button (e.g. donate / partner link).");

            // Button elements count check
            const buttonMatches = heroContent.match(/<Button/g) || [];
            const anchorButtons = heroContent.match(/<a\s+[^>]*href=["'](#[^"']+|https?:\/\/[^"']+)["']/g) || [];
            assert(
                buttonMatches.length >= 2 || anchorButtons.length >= 2,
                "Hero must provide at least two high-contrast action buttons.",
                "ORIGINAL_REQUEST §R1"
            );
        },
    });

    runner.registerTest({
        id: "T1-HERO-06",
        name: "Hero Layered Photo Collage using Authentic Event Images",
        tier: 1,
        feature: "Hero",
        requirement: "ORIGINAL_REQUEST §R1 & §AC: Layered photo collage using authentic club event images from public/assets/images/events/...",
        fn: () => {
            const heroContent = readProjectFile("components/sections/Hero.tsx");

            // Check for image elements and event asset path references
            const referencesEventAssets =
                heroContent.includes("/assets/images/events/") ||
                heroContent.includes("assets/images/events/") ||
                heroContent.includes("join-connect-season-opener-2025") ||
                heroContent.includes("3rd anniversary");

            assert(
                referencesEventAssets,
                "Hero section must integrate authentic event photos from public/assets/images/events/... in a layered collage.",
                "ORIGINAL_REQUEST §R1"
            );
        },
    });

    // ------------------------------------------------------------------------
    // Feature 2: Narrative About Section (R2) - 6 Test Cases
    // ------------------------------------------------------------------------

    runner.registerTest({
        id: "T1-ABOUT-01",
        name: "Elimination of About Glass Card & Blur Halo AI Slop",
        tier: 1,
        feature: "About",
        requirement: "ORIGINAL_REQUEST §R2: Transform the isolated single-paragraph glass card into a two-column story layout",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");

            // Must NOT have the old blurred gradient halo behind a single card
            assertNotContains(
                aboutContent,
                "bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg blur-xl",
                "About section still contains the artificial blurred gradient halo card wrapper.",
                "ORIGINAL_REQUEST §R2"
            );

            // Must NOT be just a single isolated centered glass paragraph card
            const isSingleIsolatedCard =
                aboutContent.includes("max-w-5xl text-center") &&
                aboutContent.includes("backdrop-blur-sm shadow-lg rounded-lg p-8") &&
                !aboutContent.includes("grid-cols-2");

            assert(!isSingleIsolatedCard, "About section is still an isolated single-paragraph glass card.");
        },
    });

    runner.registerTest({
        id: "T1-ABOUT-02",
        name: "About Section implements Two-Column Story Layout",
        tier: 1,
        feature: "About",
        requirement: "ORIGINAL_REQUEST §R2: Two-column story layout",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");

            const hasTwoColumnLayout =
                aboutContent.includes("grid-cols-1 lg:grid-cols-2") ||
                aboutContent.includes("grid-cols-1 md:grid-cols-2") ||
                aboutContent.includes("lg:grid-cols-2") ||
                aboutContent.includes("md:grid-cols-2");

            assert(
                hasTwoColumnLayout,
                "About section must implement a responsive two-column story layout on desktop (e.g. lg:grid-cols-2).",
                "ORIGINAL_REQUEST §R2"
            );
        },
    });

    runner.registerTest({
        id: "T1-ABOUT-03",
        name: "About Left Column presents Narrative Mission Story with Refined Typography",
        tier: 1,
        feature: "About",
        requirement: "ORIGINAL_REQUEST §R2: Left column presents the club's mission story paired with impact chips",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");
            const aboutJson = loadJson("locales/about.json");

            assert(aboutJson.en?.description?.length > 50, "English mission story must be substantive.");
            assert(aboutJson.fr?.description?.length > 50, "French mission story must be substantive.");
            assert(aboutJson.ar?.description?.length > 50, "Arabic mission story must be substantive.");

            // Component must render description / story narrative
            const rendersStory =
                aboutContent.includes("description") ||
                aboutContent.includes("story") ||
                aboutContent.includes("mission");

            assert(rendersStory, "About component must render the narrative mission story.");
        },
    });

    runner.registerTest({
        id: "T1-ABOUT-04",
        name: "About Section renders 3 Clear Impact Metrics Chips",
        tier: 1,
        feature: "About",
        requirement: "ORIGINAL_REQUEST §R2: 3 clear impact chips (2022 Foundation, ISIMS Chapter, Solidarity & Action)",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");
            const aboutJson = loadJson("locales/about.json");

            // Look for impact chips in component or about.json
            const hasFoundationChip =
                aboutContent.includes("2022") ||
                JSON.stringify(aboutJson).includes("2022");

            const hasChapterChip =
                aboutContent.includes("ISIMS") ||
                JSON.stringify(aboutJson).includes("ISIMS");

            const hasSolidarityChip =
                aboutContent.includes("Solidarity") ||
                aboutContent.includes("Solidarité") ||
                aboutContent.includes("تضامن") ||
                JSON.stringify(aboutJson).toLowerCase().includes("solidar");

            assert(hasFoundationChip, "About section must feature '2022 Foundation' impact chip.", "ORIGINAL_REQUEST §R2");
            assert(hasChapterChip, "About section must feature 'ISIMS Chapter' impact chip.", "ORIGINAL_REQUEST §R2");
            assert(hasSolidarityChip, "About section must feature 'Solidarity & Action' impact chip.", "ORIGINAL_REQUEST §R2");
        },
    });

    runner.registerTest({
        id: "T1-ABOUT-05",
        name: "About Right Column showcases Framed Photographic Feature of Active Club Members",
        tier: 1,
        feature: "About",
        requirement: "ORIGINAL_REQUEST §R2: Right column showcases a framed photographic feature of active club members",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");

            const referencesMemberPhoto =
                aboutContent.includes("/assets/images/events/") ||
                aboutContent.includes("team-building-day-2024") ||
                aboutContent.includes("assets/images/");

            assert(
                referencesMemberPhoto,
                "About section right column must feature framed photography of active club members from authentic assets.",
                "ORIGINAL_REQUEST §R2"
            );
        },
    });

    runner.registerTest({
        id: "T1-ABOUT-06",
        name: "About Photographic Feature integrates Official Partner Badge",
        tier: 1,
        feature: "About",
        requirement: "ORIGINAL_REQUEST §R2: Integrated with an official partner badge ('SOS Villages d'Enfants Tunisie')",
        fn: () => {
            const aboutContent = readProjectFile("components/sections/About.tsx");
            const aboutJson = loadJson("locales/about.json");

            const hasPartnerBadgeInCode =
                aboutContent.includes("SOS Villages d'Enfants") ||
                aboutContent.includes("SOS Village") ||
                aboutContent.includes("Partner") ||
                aboutContent.includes("Partenaire");

            const hasPartnerBadgeInJson =
                JSON.stringify(aboutJson).includes("SOS Village") ||
                JSON.stringify(aboutJson).includes("Partenaire");

            assert(
                hasPartnerBadgeInCode || hasPartnerBadgeInJson,
                "About section must feature an official partner badge ('SOS Villages d'Enfants Tunisie').",
                "ORIGINAL_REQUEST §R2"
            );
        },
    });

    // ------------------------------------------------------------------------
    // Feature 3: Modern Bento-Grid Goals Section (R3) - 5 Test Cases
    // ------------------------------------------------------------------------

    runner.registerTest({
        id: "T1-GOALS-01",
        name: "Elimination of Goals Raw Emojis and Artificial Gradient Masks",
        tier: 1,
        feature: "Goals",
        requirement: "ORIGINAL_REQUEST §R3 & §AC: Replace uniform 6-card emoji grid and artificial fade gradient masks",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Must NOT have top/bottom 8vh gradient fade masks
            assertNotRegex(
                goalsContent,
                /h-\[8vh\]\s+pointer-events-none\s+bg-gradient-to-b/,
                "Goals section still contains artificial 8vh top/bottom gradient fade masks.",
                "ORIGINAL_REQUEST §R3"
            );

            // Must NOT use raw emoji rendering directly from JSON as card header icon
            assertNotContains(
                goalsContent,
                `<div className="mb-4 text-4xl">{goal.icon}</div>`,
                "Goals section is still directly rendering raw phone emojis in a plain 4xl div.",
                "ORIGINAL_REQUEST §R3"
            );
        },
    });

    runner.registerTest({
        id: "T1-GOALS-02",
        name: "Goals Section implements Responsive Bento-Grid Layout",
        tier: 1,
        feature: "Goals",
        requirement: "ORIGINAL_REQUEST §R3: Modern, responsive Bento-Grid",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Bento grid requires grid system with asymmetrical column spans (e.g. col-span-2 or row-span-2)
            const hasBentoGridClasses =
                goalsContent.includes("grid") &&
                (goalsContent.includes("col-span-") ||
                    goalsContent.includes("row-span-") ||
                    goalsContent.includes("bento") ||
                    goalsContent.includes("grid-cols-3") ||
                    goalsContent.includes("grid-cols-4") ||
                    goalsContent.includes("lg:grid-cols-"));

            assert(
                hasBentoGridClasses,
                "Goals section must implement a modern Bento-Grid layout with responsive column spans.",
                "ORIGINAL_REQUEST §R3"
            );

            // Must not be a completely uniform grid-cols-3 without any featured weighting or asymmetric styling
            const isPlainUniformGrid =
                goalsContent.includes("grid gap-8 md:grid-cols-2 lg:grid-cols-3") &&
                !goalsContent.includes("col-span-") &&
                !goalsContent.includes("row-span-") &&
                !goalsContent.includes("featured");

            assert(!isPlainUniformGrid, "Goals section is still a plain uniform 6-card grid without Bento weighting.");
        },
    });

    runner.registerTest({
        id: "T1-GOALS-03",
        name: "Goals Key Pillars (Awareness and Fundraising) have Featured Weighting",
        tier: 1,
        feature: "Goals",
        requirement: "ORIGINAL_REQUEST §R3: Featured card weighting for key pillars (Awareness and Fundraising)",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Key pillars (01 Awareness, 03 Fundraising) must have featured or expanded column spans
            const hasFeaturedWeighting =
                goalsContent.includes("col-span-") ||
                goalsContent.includes("featured") ||
                goalsContent.includes("isPrimary") ||
                goalsContent.includes("index === 0") ||
                goalsContent.includes("index === 2") ||
                goalsContent.includes("index === 0 || index === 2");

            assert(
                hasFeaturedWeighting,
                "Awareness (Goal 1) and Fundraising (Goal 3) must receive prominent Bento card weighting.",
                "ORIGINAL_REQUEST §R3"
            );
        },
    });

    runner.registerTest({
        id: "T1-GOALS-04",
        name: "Goals Cards map to Refined Lucide Duotone Icon Badges",
        tier: 1,
        feature: "Goals",
        requirement: "ORIGINAL_REQUEST §R3: Refined Lucide icon badge (duotone primary/accent styling)",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Check for Lucide icon imports or usage
            const hasLucideIcons =
                goalsContent.includes("lucide-react") &&
                (goalsContent.includes("Megaphone") ||
                    goalsContent.includes("HeartHandshake") ||
                    goalsContent.includes("Coins") ||
                    goalsContent.includes("GraduationCap") ||
                    goalsContent.includes("Globe") ||
                    goalsContent.includes("CalendarDays") ||
                    goalsContent.includes("Icon"));

            assert(
                hasLucideIcons,
                "Goals section must import and render refined Lucide icon badges instead of raw emojis.",
                "ORIGINAL_REQUEST §R3"
            );
        },
    });

    runner.registerTest({
        id: "T1-GOALS-05",
        name: "Goals Section Clean Styling (Step Numbers, Arrows & Highlight Box Purged per User Request)",
        tier: 1,
        feature: "Goals",
        requirement: "USER_REQUEST: Remove the ones in square (step numbers 01-06, pillar counter, arrows, highlight box)",
        fn: () => {
            const goalsContent = readProjectFile("components/sections/Goals.tsx");

            // Must NOT have step numbers 01 / stepNumber in buttons
            assertNotContains(
                goalsContent,
                "{stepNumber}",
                "Goals buttons still render stepNumber prefix in square.",
                "USER_REQUEST"
            );

            // Must NOT have PILLAR counter
            assertNotContains(
                goalsContent,
                "PILLAR",
                "Goals spotlight still renders PILLAR counter in square.",
                "USER_REQUEST"
            );

            // Must NOT have action arrow button
            assertNotContains(
                goalsContent,
                "<ArrowRight",
                "Goals buttons still render ArrowRight icon in square.",
                "USER_REQUEST"
            );
        },
    });

    // ------------------------------------------------------------------------
    // Feature 4: Fixed Navigation Header - 5 Test Cases
    // ------------------------------------------------------------------------

    runner.registerTest({
        id: "T1-NAV-01",
        name: "Fixed Navigation High-Contrast Text Over Deep Navy (!isScrolled)",
        tier: 1,
        feature: "Navigation",
        requirement: "ORIGINAL_REQUEST §R1 & PROJECT §Interface Contracts: Nav links use text-white/90 over dark canvas when !isScrolled",
        fn: () => {
            const navContent = readProjectFile("components/navigation.tsx");

            // Desktop nav items mapping block must conditionally adapt styling based on isScrolled
            const navLinkBlockMatch = navContent.match(/navItems\.map\([\s\S]*?<a[\s\S]*?<\/a>/);
            assert(navLinkBlockMatch, "Could not find desktop navItems.map link block in components/navigation.tsx");
            const linkBlock = navLinkBlockMatch[0];

            const hasConditionalLinkContrast =
                linkBlock.includes("isScrolled") &&
                (linkBlock.includes("text-white") || linkBlock.includes("text-white/90"));

            assert(
                hasConditionalLinkContrast,
                "Navigation links must conditionally render high-contrast white text (e.g. text-white/90) when !isScrolled over Deep Navy.",
                "PROJECT §Interface Contracts"
            );
        },
    });

    runner.registerTest({
        id: "T1-NAV-02",
        name: "Fixed Navigation Dark Text Contrast When Scrolled (isScrolled)",
        tier: 1,
        feature: "Navigation",
        requirement: "PROJECT §Interface Contracts: Scrolled navbar transitions to white/blurred bg with text-primary-dark",
        fn: () => {
            const navContent = readProjectFile("components/navigation.tsx");

            const hasScrolledBackground =
                navContent.includes("bg-background") ||
                navContent.includes("bg-white") ||
                navContent.includes("backdrop-blur");

            assert(hasScrolledBackground, "Navigation must transition to a solid or blurred light background on scroll.");

            // Check that links transition to dark text on scroll
            const hasDarkTextOnScroll =
                navContent.includes("text-primary-dark") ||
                navContent.includes("text-gray-") ||
                navContent.includes("text-slate-");

            assert(
                hasDarkTextOnScroll,
                "Navigation links must transition to dark readable text (e.g. text-primary-dark) when scrolled.",
                "PROJECT §Interface Contracts"
            );
        },
    });

    runner.registerTest({
        id: "T1-NAV-03",
        name: "Fixed Navigation Adaptive Logo Switching (white over dark, blue when scrolled)",
        tier: 1,
        feature: "Navigation",
        requirement: "PROJECT §Interface Contracts & §11: Show white logo when over hero, blue logo when scrolled",
        fn: () => {
            const navContent = readProjectFile("components/navigation.tsx");

            assertContains(
                navContent,
                "logo-white.svg",
                "Navigation must reference logo-white.svg for dark background contrast.",
                "PROJECT §Interface Contracts"
            );

            assertContains(
                navContent,
                "logo-blue.svg",
                "Navigation must reference logo-blue.svg for scrolled background contrast.",
                "PROJECT §Interface Contracts"
            );

            assertContains(
                navContent,
                "logo-isims.svg",
                "Navigation must reference official ISIMS logo.",
                "PROJECT §Interface Contracts"
            );
        },
    });

    runner.registerTest({
        id: "T1-NAV-04",
        name: "Navigation Action Buttons maintain High Contrast in Both States",
        tier: 1,
        feature: "Navigation",
        requirement: "PROJECT §Interface Contracts: Dual states for Join and Learn More buttons",
        fn: () => {
            const navContent = readProjectFile("components/navigation.tsx");

            // Look for joinButtonClasses or button contrast condition
            const hasContrastSwitching =
                navContent.includes("isScrolled") &&
                (navContent.includes("joinButtonClasses") || navContent.includes("border-white"));

            assert(
                hasContrastSwitching,
                "Navigation action buttons must specify distinct contrast classes for scrolled and un-scrolled states.",
                "PROJECT §Interface Contracts"
            );
        },
    });

    runner.registerTest({
        id: "T1-NAV-05",
        name: "Navigation Links correctly target All Page Sections",
        tier: 1,
        feature: "Navigation",
        requirement: "PROJECT §Interface Contracts: Anchors point to #about, #goals, #team, #events, #join",
        fn: () => {
            const navContent = readProjectFile("components/navigation.tsx");

            assertContains(navContent, "#about", "Navigation must contain anchor for About section.");
            assertContains(navContent, "#goals", "Navigation must contain anchor for Goals section.");
            assertContains(navContent, "#team", "Navigation must contain anchor for Team section.");
            assertContains(navContent, "#events", "Navigation must contain anchor for Events section.");
            assertContains(navContent, "#join", "Navigation must contain anchor for Join section.");
        },
    });
}
