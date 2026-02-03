import HorizontalColorbar from "./ColorBar"
import { LegendItem } from "./LegendItem"
import { colorScheme } from "@/shared/config/map-colors"

export default function RespiratoryLegend() {
    return (
        <>
            <LegendItem label="Respiratory Disease Rate" unit="%">
                <HorizontalColorbar colorScale={colorScheme.scale} id="respiratory" />
            </LegendItem>
        </>
    )
}
