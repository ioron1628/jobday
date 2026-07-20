import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        panel: "var(--color-panel)",
        ink: "var(--color-ink)",
        muted: "var(--color-muted)",
        soft: "var(--color-soft)",
        field: "var(--color-field)",
        line: "var(--color-line)",
        "line-strong": "var(--color-line-strong)",
        accent: "var(--color-accent)",
        "accent-strong": "var(--color-accent-strong)",
        "accent-soft": "var(--color-accent-soft)",
        "brand-charcoal": "#111827",
        "primary-amber": "#d97706",
        "deep-amber": "#b45309",
        "action-orange": "#ea580c",
        safety: "var(--color-warn)",
        "safety-soft": "var(--color-warn-soft)",
        "pinned-yellow": "#facc15",
        danger: "var(--color-danger)",
        "danger-soft": "var(--color-danger-soft)",
        success: "var(--color-success)",
        "success-soft": "var(--color-success-soft)",
        closed: "#737373",
        steel: "#316b83",
        moss: "#4f6f52",
        signal: "#ea580c"
      },
      boxShadow: {
        board: "0 1px 0 rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
