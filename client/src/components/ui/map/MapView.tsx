"use client"

import MapControls from "@/components/ui/map/MapControls"
import MapMarker from "@/components/ui/map/MapMarker"
import MapSources from "@/components/ui/map/MapSources"
import useMapHook from "@/hooks/map/use-map"
import "maplibre-gl/dist/maplibre-gl.css"
import { Map } from "react-map-gl/maplibre"

export default function MapView({ children }: { children: React.ReactNode }) {
    const {
        theme,
        activeSlug,
        onLayerSelect,
        onMapLoad,
        onMapClick,
        onMouseMove,
        onMouseOut,
        closeSidebar,
        markerCoords,
    } = useMapHook()

    return (
        <Map
            interactiveLayerIds={["countries-hover-layer", "country-boundaries-hover-layer"]}
            reuseMaps
            onClick={onMapClick}
            onLoad={onMapLoad}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            attributionControl={false}
        >
            <MapMarker coords={markerCoords} />
            <MapSources theme={theme} />

            {children}

            <MapControls
                closeSidebar={closeSidebar}
                slug={activeSlug}
                onLayerSelect={onLayerSelect}
            />
        </Map>
    )
}
