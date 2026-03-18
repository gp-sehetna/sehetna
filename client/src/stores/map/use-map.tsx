import { Coordinates } from "@/features/environment/week/week.types"
import logger from "@/shared/logger"
import { GeoJSONFeature } from "maplibre-gl"
import { create } from "zustand"

type MapState = {
    date?: Date

    clickedZone: GeoJSONFeature | null
    hoveredZone: GeoJSONFeature | null

    markerCoords: Coordinates | null
    hoveredCoords: Coordinates | null

    tooltip: HTMLDivElement | null

    setDate: (date?: Date) => void

    setClickedZone: (zone: GeoJSONFeature | null) => void
    setHoveredZone: (zone: GeoJSONFeature | null) => void

    setHoveredCoords: (coords: Coordinates | null) => void
    setMarkerCoords: (coords: Coordinates | null) => void

    setTooltip: (el: HTMLDivElement | null) => void
    updateTooltipPosition: (x: number, y: number) => void
}

export const useMapStore = create<MapState>((set, get) => ({
    date: undefined,

    clickedZone: null,
    hoveredZone: null,

    markerCoords: null,
    hoveredCoords: null,

    tooltip: null,

    setDate: (date) => set({ date }),

    setClickedZone: (clickedZone) => set({ clickedZone }),
    setHoveredZone: (hoveredZone) => set({ hoveredZone }),

    setHoveredCoords: (hoveredCoords) => set({ hoveredCoords }),
    setMarkerCoords: (markerCoords) => set({ markerCoords }),

    setTooltip: (tooltip) => set({ tooltip }),
    updateTooltipPosition: (x, y) => {
        const { tooltip } = get()
        if (!tooltip) return

        const rect = tooltip.getBoundingClientRect()
        const tooltipWidth = rect.width
        const tooltipHeight = rect.height

        const viewportWidth = window.innerWidth

        const translateX = x
        const translateY = y

        let offsetX = "-50%"
        let offsetY = "-120%"

        /* Horizontal collision */
        // – Too close to left → stick to left
        if (x - tooltipWidth / 2 < 0) offsetX = "0%"
        // – Too close to right → stick to right
        else if (x + tooltipWidth / 2 > viewportWidth) offsetX = "-100%"

        /* Vertical collision */
        // – Not enough space above → show below cursor
        if (y - tooltipHeight < 0) offsetY = "20px"

        logger.info(
            {
                translateX,
                translateY,
                offsetX,
                offsetY,
            },
            "Tooltip position updated (x, y, offsetX, offsetY)"
        )
        tooltip.style.transform = `translate(${translateX}px, ${translateY}px) translate(${offsetX}, ${offsetY})`
    },
}))
