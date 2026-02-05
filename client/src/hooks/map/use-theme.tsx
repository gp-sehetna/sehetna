import { Prediction } from "@/features/environment/week/week.types"
import { GradientPalette, blue, green, mix } from "@/shared/config/map-colors"
import { useMemo } from "react"

const useTheme = (heathOutcome: string) => {
    const blueTheme = useMemo(() => new GradientPalette(blue.colors, blue.oceanColor), [])
    const greenTheme = useMemo(() => new GradientPalette(green.colors, green.oceanColor), [])
    const mixTheme = useMemo(() => new GradientPalette(mix.colors, mix.oceanColor), [])

    if (!heathOutcome) return blueTheme

    switch (heathOutcome) {
        case "respiratory-disease-rate":
            return blueTheme
        case "cardio-mortality-rate":
            return mixTheme
        case "heat-related-admissions":
            return blueTheme
        case "waterborne-disease-incidents":
            return blueTheme
        case "vector-disease-risk-score":
            return greenTheme
    }
    throw new Error(
        `Unknown health outcome: "${String(heathOutcome)}".\n` +
            `Supported values:\n` +
            `- respiratory-disease-rate\n` +
            `- cardio-mortality-rate\n` +
            `- heat-related-admissions\n` +
            `- waterborne-disease-incidents\n` +
            `- vector-disease-risk-score`
    )
}

export { useTheme }
