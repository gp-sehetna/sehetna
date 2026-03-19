"use client"
import { PredictionsAggregates } from "@/features/environment/prediction/prediction.types"
import { toProperCase } from "@/lib/utils"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import ReactCountryFlag from "react-country-flag"
import { RadialChart } from "@/components/ui/charts/RadialChart"
import { useThemeStore } from "@/stores/map/use-theme"
import { Activity } from "lucide-react"

type MapTooltipProps = {
    predictionsMap: PredictionsAggregates
}

const MapTooltip = ({ predictionsMap }: MapTooltipProps) => {
    const healthOutcome = usePredictionsStore((s) => s.healthOutcome)
    const { theme } = useThemeStore()
    const hoveredZone = useMapStore((s) => s.hoveredZone)
    const setTooltip = useMapStore((s) => s.setTooltip)

    if (!hoveredZone) return null
    const hoveredPrediction = predictionsMap[hoveredZone.properties.isoA3]

    const predictionValue = hoveredPrediction
        ? +(hoveredPrediction.sum / hoveredPrediction.count).toFixed(2)
        : 0
    return (
        <div
            ref={setTooltip}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                transform: "translate(0px, 0px) translate(-50%, -120%)",
                padding: "6px 10px",
                fontSize: "12px",
                willChange: "transform",
            }}
            className="glassy pointer-events-none flex min-w-72 flex-col gap-1 rounded-xl shadow-lg"
        >
            <div className="flex items-center gap-2">
                <ReactCountryFlag
                    style={{
                        filter: "drop-shadow(0px 2px 2px #00000022)",
                        borderRadius: "4px",
                        transform: "scale(1.2)",
                    }}
                    svg
                    countryCode={hoveredZone.properties.isoA2}
                />

                <p className="text-foreground text-md font-bold">{hoveredZone.properties.name}</p>
            </div>
            {!hoveredPrediction ? (
                <p className="text-muted-foreground text-sm">No prediction values available yet.</p>
            ) : (
                <>
                    <RadialChart
                        value={predictionValue}
                        color={theme.colorScale(predictionValue)}
                        chartLabel={toProperCase(healthOutcome)}
                        Icon={Activity}
                        tooltip={"Hello"}
                        max={100}
                    />
                </>
            )}
        </div>
    )
}

export default MapTooltip
