import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google"

export const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--heading-font",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
    // preload: true,
})

export const plusJakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--body-font",
    weight: ["200", "300", "400", "500", "600", "700", "800"],
    display: "swap",
    // preload: true,
})
