"use client"

import MapControls from "@/components/ui/map/MapControls"
import MapMarker from "@/components/ui/map/MapMarker"
import MapSources from "@/components/ui/map/MapSources"
import useMapHook from "@/hooks/map/use-map"
import "maplibre-gl/dist/maplibre-gl.css"
import { Map, NavigationControl } from "react-map-gl/maplibre"

export default function MapView({ children }: { children: React.ReactNode }) {
    const {
        theme,
        activeSlug,
        date,
        setDate,
        clickedZone,
        closeCountryDetails,
        onLayerSelect,
        onMapLoad,
        onMapClick,
        onMouseMove,
        onMouseOut,
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
                clickedZone={clickedZone}
                closeCountryDetails={closeCountryDetails}
                date={date}
                setDate={setDate}
                activeSlug={activeSlug}
                onLayerSelect={onLayerSelect}
            />
            <NavigationControl position="top-right" showCompass={false} visualizePitch />
        </Map>
    )
}

// const renderPopup = (
//     popupRef: React.RefObject<Popup | null>,
//     properties: GeoJSONFeature["properties"],
//     centroid: LngLatLike,
//     map: Map,
//     markerRef:React.RefObject<Marker | null>,
//     setClickedCountryProps: React.Dispatch<React.SetStateAction<GeoJsonFeature | null>>
// ) => {
//     // Create container
//     const popupContainer = document.createElement("div")
//     // Render React component
//     const root = createRoot(popupContainer)
//     const closePopup = () => {
//         popupRef.current?.remove()
//         root.unmount()
//         markerRef.current?.remove()
//         setClickedCountryProps(null)
//         redirect("/map")
//     }

//     const { NAME, ISO_A3 } = properties
//     root.render(<CountryPopup name={NAME} iso={ISO_A3} onClose={closePopup} />)

//     // Create MapLibre popup
//     popupRef.current = new Popup({ closeButton: false, closeOnClick: false })
//         .setLngLat(centroid)
//         .setDOMContent(popupContainer)
//         .addTo(map)
// }
