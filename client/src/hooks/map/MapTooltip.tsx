"use client"
import { PredictionsAggregates } from "@/features/environment/prediction/prediction.types"
import { toProperCase } from "@/lib/utils"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"

type MapTooltipProps = {
    predictionsMap: PredictionsAggregates
}

const MapTooltip = ({ predictionsMap }: MapTooltipProps) => {
    const healthOutcome = usePredictionsStore((s) => s.healthOutcome)

    const hoveredZone = useMapStore((s) => s.hoveredZone)
    const setTooltip = useMapStore((s) => s.setTooltip)

    if (!hoveredZone) return null
    const hoveredPrediction = predictionsMap[hoveredZone.properties.isoA3]

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
            className={`glassy pointer-events-none flex min-w-72 flex-col gap-1 rounded-xl shadow-lg`}
        >
            <h6 className="text-foreground">{hoveredZone.properties.name}</h6>
            {!hoveredPrediction ? (
                <p className="text-sm">No data</p>
            ) : (
                <div className="flex items-center gap-1">
                    <span className="text-xs">{toProperCase(healthOutcome)}</span>:
                    <span className="text-foreground font-bold">
                        {(hoveredPrediction.sum / hoveredPrediction.count).toFixed(2)}%
                    </span>
                </div>
            )}
        </div>
    )
}

export default MapTooltip
