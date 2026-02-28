import { toProperCase, unslugify } from "@/lib/utils"
import HorizontalColorbar from "./ColorBar"
import { LegendItem } from "./LegendItem"

export type LegendProps = {
    healthOutcome: string
}

export default function Legend({ healthOutcome }: LegendProps) {
    return (
        <LegendItem label={toProperCase(unslugify(healthOutcome))} unit="%">
            <HorizontalColorbar ticks={6} />
        </LegendItem>
    )
}
