import { GradientPalette, blue, green, mix } from "@/shared/config/map-colors"
import { useMemo } from "react"

const useTheme = (healthOutcome?: string) => {
    const blueTheme = useMemo(() => new GradientPalette(blue.colors, blue.oceanColor), [])
    const greenTheme = useMemo(() => new GradientPalette(green.colors, green.oceanColor), [])
    const mixTheme = useMemo(() => new GradientPalette(mix.colors, mix.oceanColor), [])

    const theme = useMemo(() => {
        switch (healthOutcome) {
            case undefined:
            case "":
            case "respiratory-disease-rate":
            case "heat-related-admissions":
            case "waterborne-disease-incidents":
                return blueTheme

            case "cardio-mortality-rate":
                return mixTheme

            case "vector-disease-risk-score":
                return greenTheme

            default:
                return null
        }
    }, [healthOutcome, blueTheme, greenTheme, mixTheme])

    return { theme: theme || blueTheme, isInvalid: theme === null }
}

export { useTheme }
