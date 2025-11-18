/**
 * Theme configuration for the SOS Club website
 * Centralized color scheme and design tokens
 */

export const theme = {
    colors: {
        primary: {
            DEFAULT: "#1e40af", // Blue-700
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
        },
        secondary: {
            DEFAULT: "#059669", // Emerald-600
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
        },
        accent: {
            DEFAULT: "#dc2626", // Red-600
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
        },
        neutral: {
            DEFAULT: "#6b7280", // Gray-500
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
        },
    },
    fonts: {
        sans: ["Aktiv Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
    },
    spacing: {
        container: "1200px",
        section: "5rem", // 80px
        sectionMobile: "3rem", // 48px
    },
    borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
    },
    shadows: {
        DEFAULT:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    },
} as const;

export type Theme = typeof theme;
