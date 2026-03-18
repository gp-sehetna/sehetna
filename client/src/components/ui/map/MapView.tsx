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
        onSubmitSimulationForm,
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
            interactiveLayerIds={["land-hover", "land-hover-boundaries"]}
            reuseMaps
            onClick={onMapClick}
            onLoad={onMapLoad}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            attributionControl={false}
            dragPan={{ maxSpeed: 0 }} // Disables easing effect to improve performance on exchange layer
        >
            <MapMarker coords={markerCoords} />
            <MapSources theme={theme} />

            {children}

            <MapControls
                onSubmitForm={onSubmitSimulationForm}
                closeSidebar={closeSidebar}
                slug={activeSlug}
                onLayerSelect={onLayerSelect}
            />
        </Map>
    )
}
