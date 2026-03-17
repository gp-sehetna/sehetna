"use client"
import { toProperCase } from "@/lib/utils"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useEffect, useMemo, useRef } from "react"

const MapTooltip = () => {
    const hoveredZone = useMapStore((s) => s.hoveredZone)

    const predictionMap = usePredictionsStore((s) => s.predictionMap)

    const healthOutcome = usePredictionsStore((s) => s.healthOutcome)

    const tooltipRef = useMapStore((s) => s.tooltipRef)
    const setTooltipRef = useMapStore((s) => s.setTooltipRef)
    // console.log('re-rendered - ', tooltipRef?.current)

    const refInstance = useRef(null)

    useEffect(() => {
        setTooltipRef(refInstance)
    }, [setTooltipRef])

    const layer = useMemo(() => toProperCase(healthOutcome), [healthOutcome])

    if (!hoveredZone) return null

    const hoveredPrediction = predictionMap[hoveredZone.properties.isoA3]

    return (
        <div
            ref={tooltipRef}
            style={{
                position: "fixed", // 🔥 better for tooltips (viewport-based)
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
                <>
                    <div className="flex items-center gap-1">
                        <span className="text-xs">{layer}</span>:
                        <span className="text-foreground font-bold">
                            {hoveredPrediction.toFixed(2)}%
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default MapTooltip
