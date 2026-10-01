const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Read logo assets
const isimsSvg = fs.readFileSync(path.join(__dirname, '../public/assets/icons/logo-isims.svg'), 'utf8');
const logoWhiteSvg = fs.readFileSync(path.join(__dirname, '../public/assets/icons/logo-white.svg'), 'utf8');

// Extract the base64 png from logoWhiteSvg
const base64Match = logoWhiteSvg.match(/href="data:image\/png;base64,([^"]+)"/);
const logoBase64 = base64Match ? base64Match[1] : '';

const width = 1200;
const height = 630;

const svgBanner = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1426" />
      <stop offset="45%" stop-color="#102242" />
      <stop offset="100%" stop-color="#183660" />
    </linearGradient>

    <radialGradient id="cyanOrb" cx="90%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#00abec" stop-opacity="0.4" />
      <stop offset="60%" stop-color="#00abec" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#00abec" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="pinkOrb" cx="8%" cy="90%" r="50%">
      <stop offset="0%" stop-color="#de5a6c" stop-opacity="0.32" />
      <stop offset="60%" stop-color="#de5a6c" stop-opacity="0.06" />
      <stop offset="100%" stop-color="#de5a6c" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00abec" />
      <stop offset="50%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#de5a6c" />
    </linearGradient>

    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
    </linearGradient>
  </defs>

  <!-- Base background -->
  <rect width="100%" height="100%" fill="url(#bgGrad)" />
  <rect width="100%" height="100%" fill="url(#cyanOrb)" />
  <rect width="100%" height="100%" fill="url(#pinkOrb)" />

  <!-- Top accent gradient line -->
  <rect x="0" y="0" width="1200" height="7" fill="url(#cyanLine)" />

  <!-- Background decorative rings & network dots -->
  <circle cx="1080" cy="180" r="260" fill="none" stroke="#00abec" stroke-opacity="0.12" stroke-width="2" />
  <circle cx="1080" cy="180" r="380" fill="none" stroke="#00abec" stroke-opacity="0.08" stroke-width="1.5" />
  <circle cx="1080" cy="180" r="500" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />

  <!-- Glassmorphic Main Card -->
  <rect x="70" y="55" width="1060" height="520" rx="24" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1.5" />

  <!-- Header Row: Logos & Badges -->
  <g transform="translate(120, 95)">
    <!-- SOS Club Logo -->
    <image href="data:image/png;base64,${logoBase64}" x="0" y="0" width="180" height="75" preserveAspectRatio="xMidYMid meet" />

    <!-- Badges on right side of card -->
    <g transform="translate(620, 10)">
      <!-- ISIMS Badge -->
      <rect x="0" y="0" width="280" height="42" rx="21" fill="#00abec" fill-opacity="0.18" stroke="#00abec" stroke-width="1.2" />
      <text x="140" y="26" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#7dd3fc" text-anchor="middle" letter-spacing="1.5">ISIMS • UNIVERSITY OF SFAX</text>
    </g>
  </g>

  <!-- Divider inside card -->
  <line x1="120" y1="195" x2="1080" y2="195" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1" />

  <!-- Main Content -->
  <g transform="translate(120, 220)">
    <!-- Category pill -->
    <rect x="0" y="0" width="190" height="30" rx="15" fill="#de5a6c" fill-opacity="0.22" stroke="#de5a6c" stroke-width="1" />
    <text x="95" y="20" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#fca5a5" text-anchor="middle" letter-spacing="1">STUDENT AMBASSADORS</text>

    <!-- Main Title Lines -->
    <text x="0" y="82" font-family="'Segoe UI', Roboto, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#ffffff" letter-spacing="-0.8">
      SOS Children&apos;s Village
    </text>
    <text x="0" y="145" font-family="'Segoe UI', Roboto, -apple-system, sans-serif" font-size="52" font-weight="800" fill="#00abec" letter-spacing="-0.8">
      Ambassadors Club
    </text>

    <!-- Subtitle / Mission -->
    <text x="0" y="202" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500" fill="#e2e8f0">
      Solidarity, community engagement &amp; charitable actions
    </text>
    <text x="0" y="235" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" fill="#94a3b8">
      Club Ambassadeurs SOS Village d&apos;Enfants • ISIMS Sfax
    </text>
  </g>

  <!-- Footer Row inside card -->
  <g transform="translate(120, 505)">
    <!-- Pill 1: Volunteering -->
    <rect x="0" y="0" width="150" height="38" rx="10" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="75" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">Volunteering</text>

    <!-- Pill 2: Solidarity -->
    <rect x="165" y="0" width="150" height="38" rx="10" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.12" />
    <text x="240" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc" text-anchor="middle">Solidarity</text>

    <!-- Pill 3: Join Our Family (Highlight) -->
    <rect x="330" y="0" width="170" height="38" rx="10" fill="#00abec" fill-opacity="0.9" />
    <text x="415" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">Join Our Family</text>

    <!-- Domain URL on bottom right -->
    <g transform="translate(610, 0)">
      <rect x="0" y="0" width="310" height="38" rx="10" fill="#000000" fill-opacity="0.3" stroke="#00abec" stroke-opacity="0.4" stroke-width="1" />
      <circle cx="22" cy="19" r="5" fill="#22c55e" />
      <text x="165" y="24" font-family="'Segoe UI', Roboto, monospace" font-size="14" font-weight="600" fill="#38bdf8" text-anchor="middle">vesos-ambassadeurs-isims.tn</text>
    </g>
  </g>
</svg>
`;

async function generate() {
  const outputFilePath = path.join(__dirname, '../public/og-image.png');
  await sharp(Buffer.from(svgBanner))
    .png({ quality: 95 })
    .toFile(outputFilePath);
  console.log('Successfully generated new og-image.png at:', outputFilePath);
}

generate().catch(console.error);
