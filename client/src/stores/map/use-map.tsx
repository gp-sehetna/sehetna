import { Coordinates } from "@/features/environment/week/week.types"
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
            const el = state.tooltipRef?.current
            if (!el) return state

            // Get tooltip size
            const rect = el.getBoundingClientRect()
            const tooltipWidth = rect.width
            const tooltipHeight = rect.height

            const viewportWidth = window.innerWidth

            const translateX = x
            const translateY = y

            let offsetX = "-50%"
            let offsetY = "-120%"

            // 🟡 Horizontal collision
            if (x - tooltipWidth / 2 < 0) {
                // Too close to left → stick to left
                offsetX = "0%"
            } else if (x + tooltipWidth / 2 > viewportWidth) {
                // Too close to right → stick to right
                offsetX = "-100%"
            }

            // 🔴 Vertical collision
            if (y - tooltipHeight < 0) {
                // Not enough space above → show below cursor
                offsetY = "20px"
            }

            // Apply transform
            el.style.transform = `
        translate(${translateX}px, ${translateY}px)
        translate(${offsetX}, ${offsetY})
    `
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
