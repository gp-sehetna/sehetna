"use client"

import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import "maplibre-gl/dist/maplibre-gl.css"
import maplibregl from "maplibre-gl"
import Map from "react-map-gl/maplibre"
import MainSidebar from "../GlobalComponents/SideBars/MainSidebar"
import RespiratoryLegend from "../legend/RespiratoryLegend"
import MapSources from "./MapSources"
import ZoomControls from "./ZoomControls"
import useMapHook from "./useMapHook"

export default function MapView({ children }: { children: React.ReactNode }) {
    const {
        onMapLoad,
        onMapClick,
        onMouseMove,
        onMouseOut,
        clickedcountryProps,
        setDate,
        date,
        activeSlug
    } = useMapHook()
    return (
        <Map
            interactiveLayerIds={["countries-hover-layer", "country-boundaries-hover-layer"]}
            // onMouseOver
            // cursor={hoveredZone ? "pointer" : "grab"}
            reuseMaps
            mapLib={maplibregl}
            onClick={onMapClick}
            onLoad={onMapLoad}
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
        >
            <MapSources />
            {children}

            <div className="z-50 flex h-full w-fit min-w-1/2 lg:min-w-1/4 flex-col items-start! justify-start! gap-5 p-4">
                {clickedcountryProps != null && (
                    <MainSidebar clickedcountryProps={clickedcountryProps} />
                )}
                <DatePickerSimple
                    date={date}
                    setDate={setDate}
                    className="mt-auto w-full min-w-5!"
                />
            </div>
            <RespiratoryLegend healthOutcome={activeSlug.healthOutcome} />
            <ZoomControls />
        </Map>
    )
}

// const renderPopup = (
//     popupRef: React.RefObject<maplibregl.Popup | null>,
//     properties: maplibregl.GeoJSONFeature["properties"],
//     centroid: maplibregl.LngLatLike,
//     map: maplibregl.Map,
//     markerRef:React.RefObject<maplibregl.Marker | null>,
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
//     popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
//         .setLngLat(centroid)
//         .setDOMContent(popupContainer)
//         .addTo(map)
// }
