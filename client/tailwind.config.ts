import type { Config } from "tailwindcss"

const config: Config = {
    content: ["./src/app/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
                "xs": "475px",
            },
            fontSize: {},
            fontFamily: {
                heading: ["var(--font-heading)"],
                body: ["var(--font-body)"],
            },
        },
    },
    plugins: [],
}

export default config
