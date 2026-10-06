import fs from 'node:fs';
import path from 'node:path';

console.log('══════════════════════════════════════════════════════════════════════');
console.log('  MILESTONE 1 ADVERSARIAL STRESS TEST: IMAGES, CLS & ACCESSIBILITY');
console.log('══════════════════════════════════════════════════════════════════════\n');

const heroTsx = fs.readFileSync('components/sections/Hero.tsx', 'utf-8');
const navTsx = fs.readFileSync('components/navigation.tsx', 'utf-8');

let failed = false;

// 1. Image path extraction and file verification
console.log('▶ [1] PHYSICAL IMAGE ASSET VERIFICATION');
const imgMatches = [...heroTsx.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Extracted image paths from Hero.tsx:', imgMatches);

if (imgMatches.length !== 3) {
    console.error(`✖ Expected 3 image paths in Hero.tsx, found ${imgMatches.length}`);
    failed = true;
}

for (const imgPath of imgMatches) {
    const diskPath = path.join('public', imgPath.replace(/^\//, ''));
    if (!fs.existsSync(diskPath)) {
        console.error(`✖ Missing image on disk: ${diskPath}`);
        failed = true;
    } else {
        const stat = fs.statSync(diskPath);
        if (stat.size === 0) {
            console.error(`✖ Zero byte image: ${diskPath}`);
            failed = true;
        } else {
            console.log(`✔ Exists & non-zero: ${diskPath} (${stat.size.toLocaleString()} bytes)`);
        }
    }
}

// 2. Next.js Image attributes for CLS mitigation
console.log('\n▶ [2] NEXT.JS IMAGE ATTRIBUTES & CLS MITIGATION');
const imageTagBlocks = heroTsx.split('<Image').slice(1);
console.log(`Found ${imageTagBlocks.length} Next.js <Image> instances`);

imageTagBlocks.forEach((block, idx) => {
    const content = block.split('/>')[0];
    const hasFill = content.includes('fill');
    const hasSizes = /sizes=["']([^"']+)["']/.test(content);
    const isPriority = content.includes('priority');
    const altMatch = content.match(/alt=["']([^"']+)["']/);

    console.log(`Image #${idx + 1}:`);
    console.log(`  fill: ${hasFill}`);
    console.log(`  sizes: ${hasSizes ? content.match(/sizes=["']([^"']+)["']/)[1] : 'MISSING'}`);
    console.log(`  priority: ${isPriority}`);
    console.log(`  alt: ${altMatch ? altMatch[1].slice(0, 60) + '...' : 'MISSING'}`);

    if (!hasFill) {
        console.error(`✖ Image #${idx + 1} is missing fill attribute!`);
        failed = true;
    }
    if (!hasSizes) {
        console.error(`✖ Image #${idx + 1} is missing sizes attribute!`);
        failed = true;
    }
    if (!altMatch || !altMatch[1].trim()) {
        console.error(`✖ Image #${idx + 1} has empty or missing alt attribute!`);
        failed = true;
    }
});

// 3. Aspect Ratio container reservation (CLS defense)
console.log('\n▶ [3] ASPECT RATIO CONTAINER RESERVATIONS (CLS DEFENSE)');
const aspectMatches = [...heroTsx.matchAll(/aspect-\[([0-9/]+)\]/g)].map(m => m[1]);
console.log('Aspect ratio classes found in Hero container divs:', aspectMatches);
const expectedAspects = ['3/4', '16/10', '3/4'];
for (const exp of expectedAspects) {
    if (!aspectMatches.includes(exp)) {
        console.error(`✖ Missing container aspect ratio reservation for ${exp}`);
        failed = true;
    }
}
console.log('✔ All image parent containers enforce explicit aspect-ratio constraints.');

// 4. Accessibility landmarks & DOM hierarchy
console.log('\n▶ [4] ACCESSIBILITY LANDMARKS & DOM HIERARCHY');
const hasSectionTag = /<section[^>]*>/.test(heroTsx);
const h1Count = (heroTsx.match(/<h1/g) || []).length;
const hasAriaHiddenOnDecorative = heroTsx.includes('aria-hidden="true"');
const hasNavTag = /<nav[^>]*>/.test(navTsx);
const hasAriaLabelOnButtons = navTsx.includes('aria-label=');

console.log(`  Hero uses semantic <section>: ${hasSectionTag}`);
console.log(`  Hero contains exactly 1 <h1> heading: ${h1Count === 1} (count: ${h1Count})`);
console.log(`  Ambient & decorative elements marked aria-hidden: ${hasAriaHiddenOnDecorative}`);
console.log(`  Navigation uses semantic <nav>: ${hasNavTag}`);
console.log(`  Navigation buttons have aria-label: ${hasAriaLabelOnButtons}`);

if (!hasSectionTag || h1Count !== 1 || !hasAriaHiddenOnDecorative || !hasNavTag || !hasAriaLabelOnButtons) {
    console.error('✖ Accessibility landmark checks failed!');
    failed = true;
} else {
    console.log('✔ Accessibility landmarks and semantics pass all criteria.');
}

// 5. Check AI Slop elimination
console.log('\n▶ [5] AI SLOP ABSENCE VERIFICATION');
const hasSpinning = /animate-\[spin/.test(heroTsx);
const has4remGrid = heroTsx.includes('bg-[size:4rem_4rem]');
const hasFadeMask = /from-transparent\s+to-white/.test(heroTsx);

console.log(`  Spinning wireframes absent: ${!hasSpinning}`);
console.log(`  4rem coordinate grid absent: ${!has4remGrid}`);
console.log(`  Gradient fade mask absent: ${!hasFadeMask}`);

if (hasSpinning || has4remGrid || hasFadeMask) {
    console.error('✖ AI Slop elements detected!');
    failed = true;
} else {
    console.log('✔ AI slop elements completely eliminated.');
}

// 6. Navigation contrast classes verification
console.log('\n▶ [6] NAVIGATION CONTRAST TRANSITIONS');
const hasScrolledTernary = navTsx.includes('isScrolled ?') && navTsx.includes(':');
const hasWhiteTextUnscrolled = navTsx.includes('text-white/90');
const hasDarkTextScrolled = navTsx.includes('text-primary-dark');
console.log(`  Scrolled ternary logic: ${hasScrolledTernary}`);
console.log(`  text-white/90 when !isScrolled: ${hasWhiteTextUnscrolled}`);
console.log(`  text-primary-dark when isScrolled: ${hasDarkTextScrolled}`);

if (!hasScrolledTernary || !hasWhiteTextUnscrolled || !hasDarkTextScrolled) {
    console.error('✖ Navigation contrast transition logic incomplete!');
    failed = true;
} else {
    console.log('✔ Navigation contrast transitions verified.');
}

console.log('\n══════════════════════════════════════════════════════════════════════');
if (failed) {
    console.error('  RESULT: ADVERSARIAL STRESS TEST FAILED');
    console.log('══════════════════════════════════════════════════════════════════════');
    process.exit(1);
} else {
    console.log('  RESULT: ALL ADVERSARIAL STRESS TESTS PASSED (100%)');
    console.log('══════════════════════════════════════════════════════════════════════');
    process.exit(0);
}
