import HorizontalColorbar from "./ColorBar"
import { LegendItem } from "./LegendItem"
import { blueTheme } from "@/shared/config/map-colors"

export default function RespiratoryLegend() {
    return (
        <LegendItem label="Respiratory Disease Rate" unit="%">
            <HorizontalColorbar colorScale={blueTheme.colorScale} id="respiratory" ticks={6} />
        </LegendItem>
    )
}
