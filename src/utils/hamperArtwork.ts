/**
 * Minimalist luxury studio flat-lay artwork for Corekraft Corporate Gift Hamper.
 * Clean, modern white background aesthetic matching https://mycorekraft.com/
 * Features:
 * 1. Debossed Executive Planner/Notebook
 * 2. Matte Black & Rose Gold Stylus Pen
 * 3. Stainless Steel Thermal Bottle with Wooden Lid
 * 4. Minimalist Ceramic Mug
 * 5. Engraved Brass & Leather Keychain
 * Arranged inside a premium Corekraft gift box on a clean studio white surface.
 */

export const HAMPER_IMAGE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <!-- Crisp Studio Gradients -->
    <linearGradient id="studioSurface" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>

    <linearGradient id="boxWall" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDFDFD"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>

    <linearGradient id="boxInterior" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FAF5EE"/>
      <stop offset="100%" stop-color="#EEDFC9"/>
    </linearGradient>

    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A"/>
      <stop offset="40%" stop-color="#D4AF37"/>
      <stop offset="80%" stop-color="#9A7B38"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>

    <linearGradient id="coralAccent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5353"/>
      <stop offset="100%" stop-color="#FF3366"/>
    </linearGradient>

    <linearGradient id="bottleMatte" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="40%" stop-color="#334155"/>
      <stop offset="80%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>

    <linearGradient id="notebookCover" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="60%" stop-color="#27272A"/>
      <stop offset="100%" stop-color="#09090B"/>
    </linearGradient>

    <linearGradient id="bambooLid" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#C7A779"/>
      <stop offset="50%" stop-color="#E6CDA7"/>
      <stop offset="100%" stop-color="#B39063"/>
    </linearGradient>

    <filter id="softStudioShadow" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.12"/>
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.08"/>
    </filter>

    <filter id="itemShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.22"/>
    </filter>

    <pattern id="kraftShreds" width="50" height="50" patternUnits="userSpaceOnUse">
      <path d="M 5 15 Q 25 5 45 20 M 10 35 Q 30 45 50 25 M 20 5 Q 35 25 15 45" stroke="#D7C3A8" stroke-width="2.5" fill="none" opacity="0.6"/>
    </pattern>
  </defs>

  <!-- Clean Studio Table Canvas Surface (White) -->
  <rect x="0" y="0" width="1000" height="1000" fill="url(#studioSurface)"/>

  <!-- The Luxury Corekraft Presentation Hamper Box (Minimalist Clean White & Gold Edge) -->
  <g filter="url(#softStudioShadow)">
    <rect x="40" y="40" width="920" height="920" rx="32" fill="url(#boxWall)" stroke="#E2E8F0" stroke-width="3"/>
    <!-- Subtle Inner Gold Lining Border -->
    <rect x="52" y="52" width="896" height="896" rx="24" fill="none" stroke="url(#goldAccent)" stroke-width="3" opacity="0.75"/>
    <rect x="60" y="60" width="880" height="880" rx="20" fill="url(#boxInterior)"/>
    <!-- Shredded Kraft Paper Layer -->
    <rect x="65" y="65" width="870" height="870" rx="16" fill="url(#kraftShreds)"/>
  </g>

  <!-- Decorative Natural Crinkle Straw Strips -->
  <g stroke="#CBB494" stroke-width="3.5" fill="none" opacity="0.8" stroke-linecap="round">
    <path d="M 120 120 Q 160 80 200 130 T 260 100"/>
    <path d="M 740 110 Q 790 160 840 95 T 900 140"/>
    <path d="M 110 780 Q 70 850 130 900 T 200 860"/>
    <path d="M 780 840 Q 840 780 890 850 T 930 900"/>
    <path d="M 450 75 Q 490 115 530 80"/>
  </g>

  <!-- ITEM 1: Executive Hardcover Debossed Notebook (Top-Left Quad) -->
  <g transform="translate(100, 110)" filter="url(#itemShadow)">
    <rect x="0" y="0" width="370" height="460" rx="14" fill="url(#notebookCover)" stroke="#3F3F46" stroke-width="2"/>
    <!-- Ruled Paper Edges -->
    <path d="M 365 12 L 376 18 L 376 448 L 365 442 Z" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
    <path d="M 14 454 L 20 464 L 376 464 L 365 454 Z" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    
    <!-- Spine Line & Stitching -->
    <line x1="36" y1="0" x2="36" y2="460" stroke="#09090B" stroke-width="4"/>
    <line x1="40" y1="0" x2="40" y2="460" stroke="#52525B" stroke-width="1"/>

    <!-- Coral-Pink Satin Ribbon Bookmark -->
    <path d="M 180 435 Q 185 475 195 510 L 210 500 L 220 515 Q 200 470 195 435 Z" fill="url(#coralAccent)" stroke="#E11D48" stroke-width="1"/>

    <!-- Minimalist Debossed Corekraft Brand on Cover -->
    <g transform="translate(110, 180)">
      <!-- Signature Corekraft Crown in Coral -->
      <path d="M 50 18 L 74 18 C 75 18 76 19 76 20 L 76 28 C 76 29 75 30 74 30 L 67 30 C 66 30 65 29 65 28 L 65 25 C 65 24 64 23 63 23 C 62 23 61 24 61 25 L 61 28 C 61 29 60 30 59 30 L 50 30 C 49 30 48 29 48 28 L 48 20 C 48 19 49 18 50 18 Z" fill="url(#coralAccent)"/>
      <text x="75" y="70" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="26" text-anchor="middle" letter-spacing="-0.5px">corekraft</text>
      <text x="75" y="96" fill="#A1A1AA" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="600" font-size="11" text-anchor="middle" letter-spacing="2px">EXECUTIVE PLANNER</text>
    </g>
  </g>

  <!-- ITEM 2: Stainless Steel Thermal Bottle with Bamboo Lid (Top-Right Quad) -->
  <g transform="translate(580, 90)" filter="url(#itemShadow)">
    <!-- Bamboo Cap -->
    <rect x="75" y="0" width="105" height="52" rx="12" fill="url(#bambooLid)" stroke="#8A6B3E" stroke-width="2"/>
    <!-- Stainless Loop Handle -->
    <path d="M 100 0 C 100 -22, 155 -22, 155 0" stroke="#94A3B8" stroke-width="12" fill="none" stroke-linecap="round"/>
    
    <!-- Metallic Collar -->
    <rect x="88" y="50" width="80" height="22" rx="3" fill="#CBD5E1" stroke="#94A3B8" stroke-width="1.5"/>

    <!-- Matte Dark Slate Bottle Body -->
    <rect x="50" y="70" width="155" height="460" rx="30" fill="url(#bottleMatte)" stroke="#475569" stroke-width="2.5"/>
    
    <!-- Light Reflection Highlight Strip -->
    <path d="M 70 85 L 70 500" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.18"/>
    
    <!-- Vertical Laser Engraved Corekraft Logo -->
    <g transform="translate(138, 330) rotate(-90)">
      <text x="0" y="0" fill="#E2E8F0" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="20" letter-spacing="3px" opacity="0.9">corekraft</text>
    </g>
  </g>

  <!-- ITEM 3: Minimalist Matte Ceramic Mug (Bottom-Left Quad) -->
  <g transform="translate(140, 580)" filter="url(#itemShadow)">
    <!-- Handle -->
    <path d="M 60 70 C -10 70, -20 200, 60 210" stroke="#18181B" stroke-width="34" stroke-linecap="round" fill="none"/>
    
    <!-- Mug Body -->
    <rect x="50" y="25" width="230" height="240" rx="32" fill="#18181B" stroke="#27272A" stroke-width="3"/>
    
    <!-- Electroplated Gold Rim -->
    <ellipse cx="165" cy="35" rx="115" ry="30" fill="#09090B" stroke="url(#goldAccent)" stroke-width="6"/>
    <ellipse cx="165" cy="35" rx="98" ry="22" fill="#24140A"/> <!-- Espresso interior -->
    
    <!-- Minimalist Typography on Mug -->
    <g transform="translate(165, 155)">
      <circle cx="0" cy="0" r="30" fill="none" stroke="url(#goldAccent)" stroke-width="2" opacity="0.8"/>
      <path d="M -10 -5 L 0 8 L 10 -5" stroke="url(#goldAccent)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="0" y="52" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="11" text-anchor="middle" letter-spacing="2px">COREKRAFT</text>
    </g>
  </g>

  <!-- ITEM 4: Precision Matte Black & Gold Stylus Pen (Center-Right Quad) -->
  <g transform="translate(480, 480) rotate(-35)" filter="url(#itemShadow)">
    <!-- Pen Barrel -->
    <rect x="0" y="0" width="26" height="420" rx="13" fill="#18181B" stroke="#333" stroke-width="2"/>
    <!-- Gold Tip & Center Ring -->
    <path d="M 2 400 L 13 445 L 24 400 Z" fill="url(#goldAccent)"/>
    <rect x="0" y="200" width="26" height="12" fill="url(#goldAccent)"/>
    <!-- Gold Clip with coral dot -->
    <path d="M 13 30 L 13 160 L 20 160" stroke="url(#goldAccent)" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="13" cy="24" r="5" fill="url(#coralAccent)"/>
  </g>

  <!-- ITEM 5: Engraved Solid Brass Keychain & Leather Fob (Bottom-Right Quad) -->
  <g transform="translate(500, 680) rotate(12)" filter="url(#itemShadow)">
    <circle cx="55" cy="40" r="30" fill="none" stroke="url(#goldAccent)" stroke-width="7"/>
    <!-- Leather Fob -->
    <rect x="40" y="65" width="30" height="45" rx="6" fill="#1C1917" stroke="#44403C" stroke-width="2"/>
    <circle cx="55" cy="85" r="3.5" fill="url(#goldAccent)"/>
    
    <!-- Solid Brass Tag with Corekraft Logo -->
    <rect x="10" y="105" width="90" height="150" rx="16" fill="url(#goldAccent)" stroke="#A16207" stroke-width="2.5"/>
    <text x="55" y="145" fill="#451A03" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif" font-weight="800" font-size="13" text-anchor="middle" letter-spacing="0.5px">COREKRAFT</text>
    <line x1="25" y1="156" x2="85" y2="156" stroke="#451A03" stroke-width="1.5"/>
    <text x="55" y="180" fill="#451A03" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="700" font-size="10" text-anchor="middle">HOLIDAY '26</text>
    <text x="55" y="225" fill="#451A03" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif" font-weight="800" font-size="8" text-anchor="middle" letter-spacing="1px">CALICUT · KERALA</text>
  </g>

  <!-- Festive Holiday Ribbon Accent in Corekraft Coral & Gold (Bottom-Right corner) -->
  <g transform="translate(830, 830) rotate(-15)" filter="url(#itemShadow)">
    <path d="M 0 0 C -65 -65, -65 65, 0 0 C 65 -65, 65 65, 0 0" fill="url(#coralAccent)" stroke="#BE123C" stroke-width="2.5"/>
    <circle cx="0" cy="0" r="14" fill="url(#goldAccent)" stroke="#B45309" stroke-width="2"/>
    <path d="M -5 10 Q -35 65 -55 105 L -40 110 Q -20 65 5 12 Z" fill="url(#coralAccent)"/>
    <path d="M 5 10 Q 25 60 45 105 L 60 100 Q 35 55 12 12 Z" fill="url(#coralAccent)"/>
  </g>
</svg>
`.trim();

/**
 * Returns a data URI for the hamper artwork image.
 */
export function getHamperDataUri(): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(HAMPER_IMAGE_SVG)}`;
}
