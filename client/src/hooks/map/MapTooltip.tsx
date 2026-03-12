"use client"
import { toProperCase } from "@/lib/utils"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useThemeStore } from "@/stores/map/use-theme"
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
    }, [])

    const theme = useThemeStore((s) => s.theme)
    const color = theme.colors.at(10)
    const layer = useMemo(() => toProperCase(healthOutcome), [healthOutcome])

    if (!hoveredZone) return null

    const hoveredPrediction = predictionMap[hoveredZone.properties.isoA3]


    return (
        <div
            ref={tooltipRef}
            style={{
                position: "absolute",
                transform: "translate(-50%, -120%)",
                pointerEvents: "none",
                background: "white",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "12px",
            }}
            className={`flex flex-col gap-1 shadow-lg transition-all duration-200`}
        >
            <h6 style={{ color }}>{hoveredZone.properties.name}</h6>
            {!hoveredPrediction ? (
                <p className=" text-sm">No data</p>
            ) : (
                <>

                    <div className="flex items-center gap-1">
                        <span className="text-xs">{layer}</span>:
                        <span style={{ color }} className="font-bold">
                            {hoveredPrediction.toFixed(2)}%
                        </span>
                    </div>
                </>
            )}
        </div>
    )
}

export default MapTooltip
