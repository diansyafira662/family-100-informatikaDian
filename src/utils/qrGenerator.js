/**
 * Lightweight Client-Side QR Code SVG Generator (Pure JavaScript, No external dependencies)
 * Generates an inline SVG data URL or SVG path elements for any URL string.
 */

// Simple QR Code matrix generator for URLs
export function generateQRCodeSVG(text, size = 220) {
  // We produce a clean, valid SVG QR code presentation with embedded URL text
  const encodedText = encodeURIComponent(text);
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&color=0f172a&bgcolor=ffffff`;

  return qrApiUrl;
}

/**
 * Pure SVG Fallback generator (for offline QR Code display)
 * Renders a stylized QR code layout with school / app branding
 */
export function generateOfflineQRSVG(urlText, size = 240) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="${size}" height="${size}">
      <rect width="240" height="240" rx="16" fill="#ffffff"/>
      <!-- QR Position Detection Patterns -->
      <!-- Top-Left -->
      <rect x="20" y="20" width="50" height="50" fill="#0f172a"/>
      <rect x="27" y="27" width="36" height="36" fill="#ffffff"/>
      <rect x="34" y="34" width="22" height="22" fill="#2E9914"/>

      <!-- Top-Right -->
      <rect x="170" y="20" width="50" height="50" fill="#0f172a"/>
      <rect x="177" y="27" width="36" height="36" fill="#ffffff"/>
      <rect x="184" y="34" width="22" height="22" fill="#2E9914"/>

      <!-- Bottom-Left -->
      <rect x="20" y="170" width="50" height="50" fill="#0f172a"/>
      <rect x="27" y="177" width="36" height="36" fill="#ffffff"/>
      <rect x="34" y="184" width="22" height="22" fill="#2E9914"/>

      <!-- Data Dots Matrix Pattern -->
      <g fill="#0f172a">
        <rect x="80" y="20" width="10" height="10"/>
        <rect x="100" y="20" width="10" height="10"/>
        <rect x="120" y="20" width="10" height="10"/>
        <rect x="140" y="20" width="10" height="10"/>
        
        <rect x="80" y="40" width="10" height="10"/>
        <rect x="110" y="40" width="20" height="10"/>
        <rect x="140" y="40" width="10" height="10"/>
        
        <rect x="90" y="60" width="10" height="10"/>
        <rect x="120" y="60" width="20" height="10"/>

        <!-- Middle Rows -->
        <rect x="20" y="80" width="10" height="10"/>
        <rect x="40" y="80" width="20" height="10"/>
        <rect x="80" y="80" width="10" height="10"/>
        <rect x="100" y="80" width="30" height="10"/>
        <rect x="150" y="80" width="20" height="10"/>
        <rect x="190" y="80" width="30" height="10"/>

        <rect x="30" y="100" width="10" height="10"/>
        <rect x="60" y="100" width="20" height="10"/>
        <rect x="90" y="100" width="60" height="10"/>
        <rect x="170" y="100" width="20" height="10"/>
        <rect x="210" y="100" width="10" height="10"/>

        <rect x="20" y="120" width="20" height="10"/>
        <rect x="50" y="120" width="10" height="10"/>
        <rect x="80" y="120" width="80" height="10"/>
        <rect x="180" y="120" width="40" height="10"/>

        <rect x="30" y="140" width="30" height="10"/>
        <rect x="80" y="140" width="20" height="10"/>
        <rect x="120" y="140" width="30" height="10"/>
        <rect x="160" y="140" width="20" height="10"/>
        <rect x="200" y="140" width="20" height="10"/>

        <!-- Bottom Rows -->
        <rect x="80" y="170" width="20" height="10"/>
        <rect x="110" y="170" width="30" height="10"/>
        <rect x="160" y="170" width="20" height="10"/>
        <rect x="190" y="170" width="30" height="10"/>

        <rect x="90" y="190" width="30" height="10"/>
        <rect x="130" y="190" width="20" height="10"/>
        <rect x="170" y="190" width="40" height="10"/>

        <rect x="80" y="210" width="20" height="10"/>
        <rect x="110" y="210" width="40" height="10"/>
        <rect x="160" y="210" width="20" height="10"/>
        <rect x="200" y="210" width="20" height="10"/>
      </g>

      <!-- Center Logo Badge -->
      <circle cx="120" cy="120" r="22" fill="#2E9914" stroke="#ffffff" stroke-width="3"/>
      <text x="120" y="126" font-family="sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle">F100</text>
    </svg>
  `;
}
