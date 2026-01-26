"use client"

import { useEffect, useRef } from "react"
import maplibregl, { MapGeoJSONFeature } from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import bbox from "@turf/bbox"
import centroid from "@turf/centroid"
import { createRoot } from "react-dom/client"
import CountryPopup from "./CountryPopup"
import { MapService } from "@/services/map.service"

// style: "https://demotiles.maplibre.org/style.json",
// style: "https://tiles.openfreemap.org/styles/liberty",
// style: "https://tiles.openfreemap.org/styles/dark",
// style: "https://tiles.openfreemap.org/styles/bright",
// style: "/geo/toner.json",

const INIT_MAP = {
    LNG: 31.2357,
    LAT: 30.0444,
    ZOOM: 5,
}

export default function MapView() {
    const mapContainer = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const markerRef = useRef<maplibregl.Marker | null>(null)
    const popupRef = useRef<maplibregl.Popup | null>(null)

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "/geo/demotiles.maplibre.json",

            center: [INIT_MAP.LNG, INIT_MAP.LAT],
            zoom: INIT_MAP.ZOOM,
        })

        mapRef.current = map

        map.on("load", () => {
            map.addSource("countries", {
                type: "geojson",
                data: "/geo/countries.geojson",
                promoteId: "ADM0_A3",
            })
        })

        map.on("click", async (e) => {
            // await MapService.getMapPredictions({
            //     data: {
            //         aqi_pm: 142.25,
            //         country_code: "EGY",
            //         date: "2023-04-01",
            //         flood_indicator: 0,
            //         food_security_index: 36,
            //         gdp_per_capita_usd: 120000,
            //         healthcare_access_index: 32.1,
            //         heat_wave_days: 0,
            //         latitude: 26.82,
            //         longitude: 30.8,
            //         pm25_ugm3: 32.21,
            //         precipitation_mm: 3.1,
            //         temperature_celsius: 25.5,
            //     },
            // })
            const features: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
                layers: ["countries-fill"],
            })

            if (!features.length) return

            const country = features[0]
            const center = centroid(country).geometry.coordinates as [number, number]

            // Add / move marker
            if (!markerRef.current) {
                markerRef.current = new maplibregl.Marker({ color: "#ef4444" })
                    .setLngLat(e.lngLat)
                    .addTo(map)
            } else {
                markerRef.current.setLngLat(e.lngLat)
            }

            // Zoom to country bounds
            if (country.geometry) {
                const bounds = bbox(country) // [minX, minY, maxX, maxY]

                map.fitBounds(
                    [
                        [bounds[0], bounds[1]],
                        [bounds[2], bounds[3]],
                    ],
                    {
                        padding: 100,
                        duration: 1200,
                        maxZoom: 6,
                    }
                )
            }

            // Remove previous popup
            popupRef.current?.remove()

            // Create container
            const popupContainer = document.createElement("div")

            // Render React component
            const { NAME, ADM0_A3 } = country.properties ?? {}
            const root = createRoot(popupContainer)
            const closePopup = () => {
                popupRef.current?.remove()
                root.unmount()
            }

            root.render(
                <CountryPopup
                    name={country.properties?.NAME}
                    iso={country.properties?.ADM0_A3}
                    onClose={closePopup}
                />
            )
            root.render(<CountryPopup name={NAME} iso={ADM0_A3} onClose={closePopup} />)

            // Create MapLibre popup
            popupRef.current = new maplibregl.Popup({
                closeButton: false,
                closeOnClick: false,
            })
                .setLngLat(center)
                .setDOMContent(popupContainer)
                .addTo(map)

            console.log(features)
            console.log("Country:", country.properties?.NAME)
            console.log("ISO:", country.properties?.ADM0_A3)
            popupRef.current?.on("close", () => {
                root.unmount()
            })
        })

        return () => {
            map.remove()
            mapRef.current = null
        }
    }, [])

    return <div ref={mapContainer} style={{ width: "100%", height: "100vh" }} />
}
