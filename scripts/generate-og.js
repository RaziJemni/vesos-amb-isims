const sharp = require('sharp');
const fs = require('fs');

const svgOverlay = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1c325d" />
      <stop offset="65%" stop-color="#132444" />
      <stop offset="100%" stop-color="#00abec" stop-opacity="0.9" />
    </linearGradient>
    <radialGradient id="circleGlow" cx="85%" cy="25%" r="55%">
      <stop offset="0%" stop-color="#00abec" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#00abec" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="pinkGlow" cx="12%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#de5a6c" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#de5a6c" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#circleGlow)" />
  <rect width="1200" height="630" fill="url(#pinkGlow)" />

  <!-- Accent top bar -->
  <rect x="0" y="0" width="1200" height="8" fill="#00abec" />

  <!-- Subtle grid pattern & rings -->
  <circle cx="1060" cy="180" r="280" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="2" />
  <circle cx="1060" cy="180" r="400" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1.5" />

  <!-- Content Container -->
  <g transform="translate(100, 110)">
    <!-- Pill Badge -->
    <rect x="0" y="0" width="260" height="38" rx="19" fill="#00abec" fill-opacity="0.25" stroke="#00abec" stroke-width="1.5" />
    <text x="130" y="24" font-family="Arial, Helvetica, sans-serif" font-size="14" font-weight="bold" fill="#84ccf1" text-anchor="middle" letter-spacing="2">ISIMS STUDENT CLUB</text>

    <!-- Main Title -->
    <text x="0" y="105" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="bold" fill="#ffffff" letter-spacing="-0.5">
      SOS Children&apos;s Village
    </text>
    <text x="0" y="170" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="bold" fill="#00abec" letter-spacing="-0.5">
      Ambassadors Club
    </text>

    <!-- Subtitle / Tagline -->
    <text x="0" y="235" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#e4f3fb" fill-opacity="0.95">
      Solidarity, community engagement &amp; charitable actions
    </text>
    <text x="0" y="272" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#84ccf1" fill-opacity="0.85">
      Institut Supérieur d&apos;Informatique et de Multimédia de Sfax
    </text>

    <!-- Bottom Feature Pills -->
    <g transform="translate(0, 350)">
      <rect x="0" y="0" width="160" height="42" rx="10" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.1" />
      <text x="80" y="26" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">Volunteering</text>

      <rect x="180" y="0" width="160" height="42" rx="10" fill="#ffffff" fill-opacity="0.12" stroke="#ffffff" stroke-opacity="0.1" />
      <text x="260" y="26" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">Solidarity</text>

      <rect x="360" y="0" width="180" height="42" rx="10" fill="#de5a6c" fill-opacity="0.85" />
      <text x="450" y="26" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">Join The Mission</text>
    </g>
  </g>
</svg>
`);

sharp(svgOverlay)
  .png({ quality: 90 })
  .toFile('public/og-image.png')
  .then(info => {
    console.log('Successfully generated public/og-image.png:', info);
  })
  .catch(err => {
    console.error('Error generating og-image:', err);
  });
