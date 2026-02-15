import { GradientPalette, blue, green, mix, red, darkBlue } from "@/shared/config/map-colors"
import { useMemo } from "react"

const useTheme = (healthOutcome?: string) => {
    const darkBlueTheme = useMemo(() => new GradientPalette(darkBlue.colors, blue.oceanColor), [])
    const blueTheme = useMemo(() => new GradientPalette(blue.colors, blue.oceanColor), [])
    const greenTheme = useMemo(() => new GradientPalette(green.colors, green.oceanColor), [])
    const redTheme = useMemo(() => new GradientPalette(red.colors, mix.oceanColor), [])
    const mixTheme = useMemo(() => new GradientPalette(mix.colors, mix.oceanColor), [])

    const theme = useMemo(() => {
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
    }, [healthOutcome, darkBlueTheme, redTheme, blueTheme, mixTheme, greenTheme])

    return { theme: theme || blueTheme, isInvalid: theme === null }
}

export { useTheme }
