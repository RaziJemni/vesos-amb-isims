# Test Infrastructure Documentation (TEST_INFRA.md)

**Project**: SOS Children's Village Ambassadors Club of ISIMS Website Redesign  
**Test Suite**: 4-Tier Opaque-Box E2E Requirement & Visual Verification Engine  
**Runner Path**: `scripts/e2e-verify.mjs`  
**Author**: Test Writer (E2E Track)  
**Date**: 2026-10-05  

---

## 1. Overview & Architectural Principles

The E2E verification test suite is designed as an **opaque-box, requirement-driven verification engine** that validates the redesign of the SOS Children's Village Ambassadors Club website against authoritative specifications (`ORIGINAL_REQUEST.md` and `PROJECT.md`).

### Core Design Principles
1. **Opaque-Box Independence**: Tests evaluate whether requirements and user outcomes are met rather than assuming any single fragile syntax.
2. **Progressive Testability**: The test suite can run at any milestone (M1 through M4) to give clear pass/fail feedback, showing exactly what is implemented and what remains to be completed.
3. **Zero-Dependency Portability**: Built using native Node.js ESM (`node:fs`, `node:path`, `node:assert`), requiring no additional heavy test runner packages (such as Jest, Playwright, or Cypress), while delivering sub-100ms execution across all 36 test cases.
4. **Adversarial Verification**: Includes edge cases for BiDi text handling, Unicode escaping integrity, color token drift detection, and missing translation fallbacks.

---

## 2. Directory Layout & Module Structure

```
v0-college-club-website/
├── scripts/
│   └── e2e-verify.mjs             # Master CLI test runner executable
├── tests/
│   └── e2e/
│       ├── test-helpers.mjs       # Assertions, ANSI colors, TestRunner registry, file loaders
│       ├── tier1-features.mjs     # Tier 1: Feature Coverage (Hero, About, Goals, Navigation)
│       ├── tier2-boundaries.mjs   # Tier 2: Boundary & Corner Cases (RTL, tokens, breakpoints)
│       ├── tier3-interactions.mjs # Tier 3: Cross-Feature Interactions & Asset resolution
│       └── tier4-scenarios.mjs    # Tier 4: Real-World Scenarios (i18n journey, media audit)
├── TEST_INFRA.md                  # This test infrastructure document
└── TEST_READY.md                  # Test suite readiness declaration & execution manual
```

---

## 3. The 4-Tier Verification Methodology

### Tier 1: Feature Coverage (>=5 Test Cases per Feature)
Validates core feature implementations against specific requirement clauses:
- **Hero Section (R1)** (6 tests):
  - `T1-HERO-01`: Deep Navy Canvas Background (`#1c325d`)
  - `T1-HERO-02`: Elimination of AI Slop (spinning wireframes, 4rem tech grid, fade mask)
  - `T1-HERO-03`: Asymmetric Human-Centered Layout Structure
  - `T1-HERO-04`: Social Proof Badge ("✦ Students Organization for Success • ISIMS Sfax")
  - `T1-HERO-05`: Dual High-Contrast Action Buttons (Join & Donate)
  - `T1-HERO-06`: Layered Photo Collage using Authentic Event Images
- **Narrative About Section (R2)** (6 tests):
  - `T1-ABOUT-01`: Elimination of About Glass Card & Blur Halo AI Slop
  - `T1-ABOUT-02`: Two-Column Story Layout
  - `T1-ABOUT-03`: Left Column Narrative Mission Story with Refined Typography
  - `T1-ABOUT-04`: 3 Impact Metrics Chips (2022 Foundation, ISIMS Chapter, Solidarity & Action)
  - `T1-ABOUT-05`: Right Column Framed Photographic Feature of Active Club Members
  - `T1-ABOUT-06`: Official Partner Badge ("SOS Villages d'Enfants Tunisie")
- **Modern Bento-Grid Goals Section (R3)** (5 tests):
  - `T1-GOALS-01`: Elimination of Raw Emojis and Artificial Gradient Masks
  - `T1-GOALS-02`: Responsive Bento-Grid Layout
  - `T1-GOALS-03`: Featured Card Weighting for Key Pillars (Awareness and Fundraising)
  - `T1-GOALS-04`: Refined Lucide Duotone Icon Badges (`Megaphone`, `Coins`, etc.)
  - `T1-GOALS-05`: Step Numbering (`01` to `06`)
- **Fixed Navigation Header** (5 tests):
  - `T1-NAV-01`: High-Contrast Text Over Deep Navy Canvas (`!isScrolled`)
  - `T1-NAV-02`: Dark Text Contrast When Scrolled (`isScrolled`)
  - `T1-NAV-03`: Adaptive Brand Logo Switching (White over dark, Blue when scrolled)
  - `T1-NAV-04`: Action Button Contrast States (Join / Learn More)
  - `T1-NAV-05`: Section Anchor Targets (`#about`, `#goals`, `#team`, `#events`, `#join`)

### Tier 2: Boundary & Corner Cases
Evaluates extreme and edge conditions across locales and display environments:
- `T2-BOUND-01`: Arabic RTL Root Configuration and Cairo Font Enforcement
- `T2-BOUND-02`: Logical Tailwind Properties & Directional Mirroring
- `T2-BOUND-03`: Responsive Breakpoint Adaptability (Mobile, Tablet, Desktop)
- `T2-BOUND-04`: Brand Palette Strict Adherence & Accent Drift Elimination (`#eb5c7f` vs `#de5a6c`)
- `T2-BOUND-05`: Translation Dictionaries Completeness Across All Locales
- `T2-BOUND-06`: BiDi Characters, Unicode & Escaping Integrity

### Tier 3: Cross-Feature Interactions
Validates cross-module contracts and subsystem interactions:
- `T3-INT-01`: Navbar Seamless Transition Over Deep Navy Hero Canvas
- `T3-INT-02`: Goals Bento Grid Flow and Directional Symmetry Under RTL
- `T3-INT-03`: About Section Impact Chips Multi-Column Responsive Integration
- `T3-INT-04`: Authentic Image Asset References Validation on Filesystem

### Tier 4: Real-World Scenarios
Simulates realistic end-user flows and environment health:
- `T4-SCEN-01`: Full Trilingual Visitor Journey (EN -> FR -> AR Semantic Parity)
- `T4-SCEN-02`: Authentic Event Photography & Media Ecosystem Audit (50+ assets across 4 seasons)
- `T4-SCEN-03`: DOM Semantics, Landmarks & Accessibility (`<main>`, `<nav>`, `<section>`, headings, `aria-hidden`)
- `T4-SCEN-04`: TypeScript and Build Configuration Integrity

---

## 4. Execution Commands

```bash
# Run entire test suite (all 4 tiers, 36 tests)
node scripts/e2e-verify.mjs

# Run specific tier
node scripts/e2e-verify.mjs --tier=1
node scripts/e2e-verify.mjs --tier=2
node scripts/e2e-verify.mjs --tier=3
node scripts/e2e-verify.mjs --tier=4

# Run specific feature tests
node scripts/e2e-verify.mjs --feature=hero
node scripts/e2e-verify.mjs --feature=about
node scripts/e2e-verify.mjs --feature=goals
node scripts/e2e-verify.mjs --feature=navigation

# Verbose failure output with stack traces
node scripts/e2e-verify.mjs --verbose

# Stop on first failure
node scripts/e2e-verify.mjs --bail

# Machine-readable JSON output
node scripts/e2e-verify.mjs --json
```

---

## 5. Escalation & Quality Gate Protocol

When running the suite during milestone implementation:
- **Exit Code 0**: All registered tests passed; quality gate satisfied.
- **Exit Code 1**: One or more criteria failed; runner outputs an **Escalation List for Implementing Agents** pinpointing the exact requirement and reason.
- Implementing agents should run `node scripts/e2e-verify.mjs --feature=<feature>` as their acceptance test before submitting completion.
