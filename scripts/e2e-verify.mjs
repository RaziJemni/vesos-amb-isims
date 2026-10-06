#!/usr/bin/env node

/**
 * Master E2E Requirement & Visual Verification Runner
 * Project: SOS Children's Village Ambassadors Club of ISIMS Website Redesign
 * 
 * Usage:
 *   node scripts/e2e-verify.mjs
 *   node scripts/e2e-verify.mjs --tier=1
 *   node scripts/e2e-verify.mjs --feature=hero
 *   node scripts/e2e-verify.mjs --verbose
 *   node scripts/e2e-verify.mjs --bail
 *   node scripts/e2e-verify.mjs --json
 */

import { TestRunner } from "../tests/e2e/test-helpers.mjs";
import { registerTier1Tests } from "../tests/e2e/tier1-features.mjs";
import { registerTier2Tests } from "../tests/e2e/tier2-boundaries.mjs";
import { registerTier3Tests } from "../tests/e2e/tier3-interactions.mjs";
import { registerTier4Tests } from "../tests/e2e/tier4-scenarios.mjs";

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        tier: null,
        feature: null,
        verbose: false,
        bail: false,
        json: false,
    };

    for (const arg of args) {
        if (arg.startsWith("--tier=")) {
            const val = arg.split("=")[1];
            if (val !== "all") {
                options.tier = parseInt(val, 10);
            }
        } else if (arg.startsWith("--feature=")) {
            options.feature = arg.split("=")[1];
        } else if (arg === "--verbose" || arg === "-v") {
            options.verbose = true;
        } else if (arg === "--bail" || arg === "-b") {
            options.bail = true;
        } else if (arg === "--json") {
            options.json = true;
        }
    }

    return options;
}

async function main() {
    const options = parseArgs();
    const runner = new TestRunner(options);

    // Register all 4 tiers
    registerTier1Tests(runner);
    registerTier2Tests(runner);
    registerTier3Tests(runner);
    registerTier4Tests(runner);

    const summary = await runner.run();

    if (options.json) {
        console.log("\nJSON Output:\n" + JSON.stringify(summary, null, 2));
    }

    // Exit code: 0 if all tests pass, 1 if any fail
    process.exit(summary.failed > 0 ? 1 : 0);
}

main().catch((err) => {
    console.error("Test runner execution crashed:", err);
    process.exit(2);
});
