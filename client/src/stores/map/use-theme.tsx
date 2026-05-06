import { DEFAULT_HEALTH_OUTCOME, HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { GradientPalette, blue, darkBlue, green, mix, red } from "@/shared/config/map-colors"
import { DEFAULT_MAP_THEME_IDS, MapThemeId } from "@/shared/config/map-theme-config"
import logger from "@/shared/logger"
import { create } from "zustand"

export interface ThemeState {
    theme: GradientPalette
    isInvalid: boolean
    activeThemeIds: MapThemeId[]
    setTheme: (healthOutcome: HealthOutcomesKeys) => void
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
        case "respiratory_disease_rate":
            return darkBlueTheme
        case "cardio_mortality_rate":
            return mixTheme
        case "vector_disease_risk_score":
            return greenTheme
        case "waterborne_disease_incidents":
            return blueTheme
        case "heat_related_admissions":
            return redTheme
        default:
            return null
    }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    healthOutcome: DEFAULT_HEALTH_OUTCOME,
    theme: darkBlueTheme,
    isInvalid: false,
    activeThemeIds: [],
    setTheme: (healthOutcome) => {
        const nextTheme = getTheme(healthOutcome)
        logger.debug(nextTheme, `HealthOutcome (${healthOutcome}) Theme: `)
        set({ theme: nextTheme ?? blueTheme, isInvalid: nextTheme === null })
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
