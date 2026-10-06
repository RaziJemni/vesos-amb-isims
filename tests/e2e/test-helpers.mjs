/**
 * E2E Test Suite Helpers & Assertion Framework
 * Project: SOS Children's Village Ambassadors Club of ISIMS Website Redesign
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const PROJECT_ROOT = path.resolve(__dirname, "../..");

// ANSI formatting helpers
export const colors = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
};

export class AssertionError extends Error {
    constructor(message, expected, actual, requirement) {
        super(message);
        this.name = "AssertionError";
        this.expected = expected;
        this.actual = actual;
        this.requirement = requirement;
    }
}

export function assert(condition, message, requirement) {
    if (!condition) {
        throw new AssertionError(message || "Assertion failed", true, false, requirement);
    }
}

export function assertEquals(actual, expected, message, requirement) {
    if (actual !== expected) {
        throw new AssertionError(
            message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
            expected,
            actual,
            requirement
        );
    }
}

export function assertContains(haystack, needle, message, requirement) {
    if (typeof haystack !== "string") {
        throw new AssertionError("Haystack must be a string", "string", typeof haystack, requirement);
    }
    if (!haystack.includes(needle)) {
        throw new AssertionError(
            message || `Expected string to contain: ${JSON.stringify(needle)}`,
            needle,
            `Not found in string of length ${haystack.length}`,
            requirement
        );
    }
}

export function assertNotContains(haystack, needle, message, requirement) {
    if (typeof haystack !== "string") {
        throw new AssertionError("Haystack must be a string", "string", typeof haystack, requirement);
    }
    if (haystack.includes(needle)) {
        throw new AssertionError(
            message || `Expected string NOT to contain: ${JSON.stringify(needle)}`,
            "Not to be present",
            `Found substring: ${JSON.stringify(needle)}`,
            requirement
        );
    }
}

export function assertRegex(haystack, regex, message, requirement) {
    if (!regex.test(haystack)) {
        throw new AssertionError(
            message || `Expected string to match regex: ${regex}`,
            regex.toString(),
            `Pattern not matched in string`,
            requirement
        );
    }
}

export function assertNotRegex(haystack, regex, message, requirement) {
    if (regex.test(haystack)) {
        throw new AssertionError(
            message || `Expected string NOT to match regex: ${regex}`,
            `Not matching ${regex}`,
            `Matched pattern in string`,
            requirement
        );
    }
}

/**
 * Read file contents from project relative path
 */
export function readProjectFile(relPath) {
    const fullPath = path.resolve(PROJECT_ROOT, relPath);
    if (!fs.existsSync(fullPath)) {
        throw new Error(`File does not exist: ${relPath} (resolved: ${fullPath})`);
    }
    return fs.readFileSync(fullPath, "utf-8");
}

/**
 * Check if file exists relative to project root
 */
export function projectFileExists(relPath) {
    const fullPath = path.resolve(PROJECT_ROOT, relPath);
    return fs.existsSync(fullPath);
}

/**
 * Load and parse JSON file relative to project root
 */
export function loadJson(relPath) {
    const content = readProjectFile(relPath);
    try {
        return JSON.parse(content);
    } catch (err) {
        throw new Error(`Failed to parse JSON file at ${relPath}: ${err.message}`);
    }
}

/**
 * Simple test registry and runner
 */
export class TestRunner {
    constructor(options = {}) {
        this.options = {
            verbose: false,
            bail: false,
            tier: null,
            feature: null,
            ...options,
        };
        this.tests = [];
        this.results = [];
    }

    registerTest({ id, name, tier, feature, requirement, fn }) {
        this.tests.push({
            id,
            name,
            tier,
            feature,
            requirement,
            fn,
        });
    }

    async run() {
        const startTime = Date.now();
        console.log(`\n${colors.bold}${colors.blue}══════════════════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.bold}${colors.cyan}  SOS Club Website E2E Verification Suite (4-Tier Requirement Engine)${colors.reset}`);
        console.log(`${colors.bold}${colors.blue}══════════════════════════════════════════════════════════════════════${colors.reset}\n`);

        const filteredTests = this.tests.filter((t) => {
            if (this.options.tier && t.tier !== this.options.tier) return false;
            if (this.options.feature && t.feature.toLowerCase() !== this.options.feature.toLowerCase()) return false;
            return true;
        });

        console.log(`${colors.gray}Registered tests: ${this.tests.length} | Filtered to run: ${filteredTests.length}${colors.reset}\n`);

        let currentTier = null;

        for (const test of filteredTests) {
            if (test.tier !== currentTier) {
                currentTier = test.tier;
                console.log(`\n${colors.bold}${colors.magenta}▶ TIER ${currentTier}: ${this.getTierDescription(currentTier)}${colors.reset}`);
                console.log(`${colors.gray}──────────────────────────────────────────────────────────────────────${colors.reset}`);
            }

            const testStart = Date.now();
            try {
                await test.fn();
                const duration = Date.now() - testStart;
                const result = {
                    ...test,
                    status: "PASS",
                    duration,
                };
                this.results.push(result);
                console.log(`  ${colors.green}✔ PASS${colors.reset} [${test.id}] ${test.name} ${colors.gray}(${duration}ms)${colors.reset}`);
            } catch (err) {
                const duration = Date.now() - testStart;
                const result = {
                    ...test,
                    status: "FAIL",
                    duration,
                    error: err.message,
                    requirement: test.requirement,
                    expected: err.expected,
                    actual: err.actual,
                };
                this.results.push(result);
                console.log(`  ${colors.red}✖ FAIL${colors.reset} [${test.id}] ${test.name} ${colors.gray}(${duration}ms)${colors.reset}`);
                console.log(`       ${colors.yellow}Requirement:${colors.reset} ${test.requirement}`);
                console.log(`       ${colors.red}Details:${colors.reset} ${err.message}`);
                if (this.options.verbose && err.stack) {
                    console.log(`       ${colors.dim}${err.stack.split("\n").slice(1, 4).join("\n       ")}${colors.reset}`);
                }

                if (this.options.bail) {
                    console.log(`\n${colors.red}Bailing after first failure...${colors.reset}`);
                    break;
                }
            }
        }

        const totalDuration = Date.now() - startTime;
        return this.summarize(totalDuration);
    }

    getTierDescription(tier) {
        switch (tier) {
            case 1:
                return "Feature Coverage (Hero, About, Goals, Navigation)";
            case 2:
                return "Boundary & Corner Cases (RTL, Breakpoints, Color Integrity, Fallbacks)";
            case 3:
                return "Cross-Feature Interactions (Transitions, Layout Mirroring, Asset Integrity)";
            case 4:
                return "Real-World Scenarios (Trilingual Journey, Media Audit, Build Semantics)";
            default:
                return "General Verification";
        }
    }

    summarize(totalDuration) {
        const total = this.results.length;
        const passed = this.results.filter((r) => r.status === "PASS").length;
        const failed = this.results.filter((r) => r.status === "FAIL").length;
        const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

        console.log(`\n${colors.bold}${colors.blue}══════════════════════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.bold}${colors.cyan}  TEST SUITE EXECUTION SUMMARY${colors.reset}`);
        console.log(`${colors.bold}${colors.blue}══════════════════════════════════════════════════════════════════════${colors.reset}`);

        console.log(`  Total Executed : ${total}`);
        console.log(`  ${colors.green}Passed         : ${passed}${colors.reset}`);
        console.log(`  ${colors.red}Failed         : ${failed}${colors.reset}`);
        console.log(`  Pass Rate      : ${passRate >= 80 ? colors.green : colors.yellow}${passRate}%${colors.reset}`);
        console.log(`  Execution Time : ${totalDuration}ms\n`);

        if (failed > 0) {
            console.log(`${colors.bold}${colors.red}Escalation List for Implementing Agents (${failed} Pending Criteria):${colors.reset}`);
            this.results
                .filter((r) => r.status === "FAIL")
                .forEach((f, idx) => {
                    console.log(`  ${idx + 1}. [${f.id}] ${f.feature}: ${f.name}`);
                    console.log(`     → Required: ${f.requirement}`);
                    console.log(`     → Reason: ${f.error}`);
                });
            console.log("");
        }

        return {
            total,
            passed,
            failed,
            passRate,
            totalDuration,
            results: this.results,
        };
    }
}
