import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                heading: ["var(--heading-font)"],
                body: ["var(--body-font)"],
            },
            colors: {
                /* ================= Primary ================= */
                primary: {
                    DEFAULT: "var(--color-primary)",
                    100: "var(--color-primary-100)",
                    200: "var(--color-primary-200)",
                    300: "var(--color-primary-300)",
                    400: "var(--color-primary-400)",
                    500: "var(--color-primary-500)",
                    600: "var(--color-primary-600)",
                    700: "var(--color-primary-700)",
                    800: "var(--color-primary-800)",
                },

                /* ================= Secondary ================= */
                secondary: {
                    DEFAULT: "var(--color-secondary)",
                    100: "var(--color-secondary-100)",
                    200: "var(--color-secondary-200)",
                    300: "var(--color-secondary-300)",
                    400: "var(--color-secondary-400)",
                    500: "var(--color-secondary-500)",
                    600: "var(--color-secondary-600)",
                    700: "var(--color-secondary-700)",
                    800: "var(--color-secondary-800)",
                },

                /* ================= Neutral ================= */
                neutral: {
                    100: "var(--color-neutral-100)",
                    200: "var(--color-neutral-200)",
                    300: "var(--color-neutral-300)",
                    400: "var(--color-neutral-400)",
                    500: "var(--color-neutral-500)",
                    600: "var(--color-neutral-600)",
                    700: "var(--color-neutral-700)",
                    800: "var(--color-neutral-800)",
                    900: "var(--color-neutral-900)",
                    1000: "var(--color-neutral-1000)",
                },

                /* ================= Semantic ================= */
                danger: {
                    DEFAULT: "var(--color-danger)",
                    100: "var(--color-danger-100)",
                    200: "var(--color-danger-200)",
                },

                warning: {
                    DEFAULT: "var(--color-warning)",
                    100: "var(--color-warning-100)",
                    200: "var(--color-warning-200)",
                },

                success: {
                    DEFAULT: "var(--color-success)",
                    100: "var(--color-success-100)",
                    200: "var(--color-success-200)",
                    300: "var(--color-success-300)",
                },

                info: {
                    DEFAULT: "var(--color-info)",
                    100: "var(--color-info-100)",
                    200: "var(--color-info-200)",
                },

                /* ================= Base ================= */
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
}

export default config
