/**
 * Centralized color constants used across components for a balanced white/blue/pink theme.
 * We avoid using pure black and prefer a dark blue for dark text and overlays.
 */
export const COLORS = {
    WHITE: "#FFFFFF",
    BLUE: "#00abec", // brand blue
    PINK: "#de5a6c", // accent red
    DARK_BLUE: "#1c325d", // primary dark for text and overlays
};

/** Convert hex color to rgba string with given alpha (0-1). */
export function hexToRgba(hex: string, alpha = 1) {
    const cleaned = hex.replace("#", "");
    const bigint = parseInt(cleaned, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default COLORS;
