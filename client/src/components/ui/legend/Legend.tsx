import { useTheme } from "@/hooks/map/use-theme"
import HorizontalColorbar from "./ColorBar"
import { LegendItem } from "./LegendItem"
import { toProperCase, unslugify } from "@/lib/utils"

export type LegendProps = {
    healthOutcome: string
}

export default function Legend({ healthOutcome }: LegendProps) {
    const { theme } = useTheme(healthOutcome)

    return (
        <LegendItem label={toProperCase(unslugify(healthOutcome))} unit="%">
            <HorizontalColorbar colorScale={theme.colorScale} id={healthOutcome} ticks={6} />
        </LegendItem>
    )
}
