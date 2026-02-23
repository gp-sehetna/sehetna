import { toProperCase, unslugify } from "@/lib/utils"
import { useThemeStore } from "@/stores/map/use-theme"
import HorizontalColorbar from "./ColorBar"
import { LegendItem } from "./LegendItem"

export type LegendProps = {
    healthOutcome: string
}

export default function Legend({ healthOutcome }: LegendProps) {
    const { theme } = useThemeStore()

    return (
        <LegendItem label={toProperCase(unslugify(healthOutcome))} unit="%">
            <HorizontalColorbar colorScale={theme.colorScale} ticks={6} />
        </LegendItem>
    )
}
