import { Coordinates } from "@/features/environment/week/week.types"
import logger from "@/shared/logger"
import { GeoJSONFeature } from "maplibre-gl"
import { create } from "zustand"

type MapState = {
    clickedZone: GeoJSONFeature | null
    hoveredZone: GeoJSONFeature | null
    markerCoords: Coordinates | null
    hoveredCoords: Coordinates | null
    date?: Date
    tooltipRef: React.RefObject<HTMLDivElement | null> | null

    setClickedZone: (zone: GeoJSONFeature | null) => void
    setHoveredZone: (zone: GeoJSONFeature | null) => void
    setHoveredCoords: (coords: Coordinates | null) => void
    setMarkerCoords: (coords: Coordinates | null) => void
    setDate: (date?: Date) => void
    setTooltipRef: (tooltipRef: React.RefObject<HTMLDivElement | null>) => void
    updateTooltipPosition: (x: number, y: number) => void
    unmountToolTip: () => void
}

export const useMapStore = create<MapState>((set, get) => ({
    clickedZone: null,
    hoveredZone: null,
    markerCoords: null,
    hoveredCoords: null,
    date: undefined,
    tooltipRef: null,

    setClickedZone: (clickedZone) => set({ clickedZone }),
    setHoveredZone: (hoveredZone) => set({ hoveredZone }),
    setHoveredCoords: (hoveredCoords) => set({ hoveredCoords }),
    setMarkerCoords: (markerCoords) => set({ markerCoords }),
    setDate: (date) => set({ date }),
    updateTooltipPosition: (x, y) => {
        const { tooltipRef } = get()
        logger.debug({ x, y }, "Modifying tooltip position (x, y)")
        if (!tooltipRef || !tooltipRef.current) return
        tooltipRef.current.style.left = `${x}px`
        tooltipRef.current.style.top = `${y}px`
    },
    setTooltipRef: (tooltipRef) => set({ tooltipRef }),
    unmountToolTip: () =>
        set((state) => {
            if (state.tooltipRef && state.tooltipRef.current) state.tooltipRef.current = null
            return state
        }),
}))
