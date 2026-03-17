import { Coordinates } from "@/features/environment/week/week.types"
import { GeoJSONFeature } from "maplibre-gl"
import { useRef } from "react"
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

export const useMapStore = create<MapState>((set) => ({
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
        set((state) => {
            console.log("Updating tooltip position to: ", { x, y })
            if (state.tooltipRef && state.tooltipRef.current) {
                state.tooltipRef.current.style.left = `${x}px`
                state.tooltipRef.current.style.top = `${y}px`
            }
            return state
        })
    },
    setTooltipRef: (tooltipRef) => set({ tooltipRef }),
    unmountToolTip: () =>
        set((state) => {
            if (state.tooltipRef && state.tooltipRef.current) state.tooltipRef.current = null
            return state
        }),
}))
