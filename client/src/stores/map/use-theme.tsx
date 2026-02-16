import { create } from "zustand"
import { GradientPalette, blue, green, mix, red, darkBlue } from "@/shared/config/map-colors"

export interface ThemeState {
    healthOutcome?: string
    theme: GradientPalette
    isInvalid: boolean
    setHealthOutcome: (healthOutcome?: string) => void
    getSampledColors: (numberOfItems: number) => string[]
}

const darkBlueTheme = new GradientPalette(darkBlue.colors, blue.oceanColor)
const blueTheme = new GradientPalette(blue.colors, blue.oceanColor)
const greenTheme = new GradientPalette(green.colors, green.oceanColor)
const redTheme = new GradientPalette(red.colors, mix.oceanColor)
const mixTheme = new GradientPalette(mix.colors, mix.oceanColor)

const getTheme = (healthOutcome?: string) => {
    switch (healthOutcome) {
        case undefined:
        case "":
        case "respiratory-disease-rate":
            return darkBlueTheme
        case "heat-related-admissions":
            return redTheme
        case "waterborne-disease-incidents":
            return blueTheme
        case "cardio-mortality-rate":
            return mixTheme
        case "vector-disease-risk-score":
            return greenTheme
        default:
            return null
    }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    healthOutcome: undefined,
    theme: darkBlueTheme,
    isInvalid: false,
    setHealthOutcome: (healthOutcome) => {
        const theme = getTheme(healthOutcome) || blueTheme
        set({ healthOutcome, theme, isInvalid: theme === null })
    },
    getSampledColors: (numberOfItems) => {
        const { theme } = get()

        const n = theme.colors.length // full palette length (20)
        const m = numberOfItems // number of items in this chart (2–6)

        // compute evenly spaced indices across the original palette
        const indices = Array.from({ length: m }, (_, i) => Math.floor((i * n) / m))

        // pick colors at those indices (most saturated first)
        return indices.map((i) => theme.colors[n - 1 - i])
    },
}))
