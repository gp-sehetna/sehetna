import { GradientPalette, blue, darkBlue, green, mix, red } from "@/shared/config/map-colors"
import { DEFAULT_MAP_THEME_IDS, MapThemeId } from "@/shared/config/map-theme-config"
import { create } from "zustand"

export interface ThemeState {
    healthOutcome?: string
    theme: GradientPalette
    isInvalid: boolean
    activeThemeIds: MapThemeId[]
    setHealthOutcome: (healthOutcome?: string) => void
    toggleTheme: (themeId: MapThemeId) => void
    resetMapThemes: () => void
    isThemeActive: (themeId: MapThemeId) => boolean
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
    activeThemeIds: [...DEFAULT_MAP_THEME_IDS],
    setHealthOutcome: (healthOutcome) => {
        const nextTheme = getTheme(healthOutcome)
        set({
            healthOutcome,
            theme: nextTheme ?? blueTheme,
            isInvalid: nextTheme === null,
        })
    },
    toggleTheme: (themeId) => {
        const { activeThemeIds } = get()

        if (activeThemeIds.includes(themeId))
            return set({ activeThemeIds: activeThemeIds.filter((id) => id !== themeId) })

        set({ activeThemeIds: [...activeThemeIds, themeId] })
    },
    resetMapThemes: () => set({ activeThemeIds: [...DEFAULT_MAP_THEME_IDS] }),
    isThemeActive: (themeId) => get().activeThemeIds.includes(themeId),
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
