import { Coordinates } from "@/features/environment/week/week.types"
import { GeoJSONFeature } from "maplibre-gl"
import { create } from "zustand"

type MapState = {
    clickedZone: GeoJSONFeature | null
    hoveredZone: GeoJSONFeature | null
    markerCoords: Coordinates | null
    hoveredCoords: Coordinates | null
    date?: Date

    setClickedZone: (zone: GeoJSONFeature | null) => void
    setHoveredZone: (zone: GeoJSONFeature | null) => void
    setHoveredCoords: (coords: Coordinates | null) => void
    setMarkerCoords: (coords: Coordinates | null) => void
    setDate: (date?: Date) => void
}

export const useMapStore = create<MapState>((set) => ({
    clickedZone: null,
    hoveredZone: null,
    markerCoords: null,
    hoveredCoords: null,
    date: undefined,

    setClickedZone: (clickedZone) => set({ clickedZone }),
    setHoveredZone: (hoveredZone) => set({ hoveredZone }),
    setHoveredCoords: (hoveredCoords) => set({ hoveredCoords }),
    setMarkerCoords: (markerCoords) => set({ markerCoords }),
    setDate: (date) => set({ date }),
}))
