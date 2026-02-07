"use client"

import "maplibre-gl/dist/maplibre-gl.css"
import Map from "react-map-gl/maplibre"
import MainSidebar from "@/components/ui/GlobalComponents/SideBars/MainSidebar"
import RespiratoryLegend from "@/components/ui/legend/RespiratoryLegend"
import MapSources from "@/components/ui/map/MapSources"
import ZoomControls from "@/components/ui/map/ZoomControls"
import useMapHook from "@/components/ui/map/useMapHook"
import MapMarker from "@/components/ui/map/MapMarker"

export default function MapView({ children }: { children: React.ReactNode }) {
    const {
        activeSlug,

        onMapLoad,
        onMapClick,
        onMouseMove,
        onMouseOut,

        clickedZone,
        setClickedZone,
        markerCoords,
        setMarkerCoords,
    } = useMapHook()
    return (
        <Map
            interactiveLayerIds={["countries-hover-layer", "country-boundaries-hover-layer"]}
            reuseMaps
            onClick={onMapClick}
            onLoad={onMapLoad}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
        >
            <MapMarker coords={markerCoords} />
            <MapSources />
            {children}

            {clickedZone && (
                <MainSidebar
                    healthOutcome={activeSlug.healthOutcome}
                    clickedZone={clickedZone}
                    setClickedZone={setClickedZone}
                    setMarker={setMarkerCoords}
                />
            )}

            <RespiratoryLegend healthOutcome={activeSlug.healthOutcome} />
            <ZoomControls />
        </Map>
    )
}

// const renderPopup = (
//     popupRef: React.RefObject<Popup | null>,
//     properties: GeoJSONFeature["properties"],
//     centroid: LngLatLike,
//     map: Map,
//     markerRef:React.RefObject<Marker | null>,
//     setClickedCountryProps: React.Dispatch<React.SetStateAction<MapGeoJSONFeature | null>>
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
