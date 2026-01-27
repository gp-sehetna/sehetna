"use client"

import { useEffect, useRef } from "react"
import { Map, maplibregl, MAP_CONFIG } from "./config"
import type {
    LngLatLike,
    MapGeoJSONFeature,
    MapLayerMouseEvent,
    MapLibreEvent,
    MarkerOptions,
} from "./config"
import bbox from "@turf/bbox"
import centroid from "@turf/centroid"
import { createRoot } from "react-dom/client"
import CountryPopup from "./CountryPopup"
import "maplibre-gl/dist/maplibre-gl.css"
import { MapService } from "@/services/map.service"
import ZoomControls from "./ZoomControls"

const INITIAL_MAP_CONFIG = {
    longitude: 31.23,
    latitude: 30.04,
    zoom: 3,
}

type CountriesById = Record<string | number, MapGeoJSONFeature>

export default function MapView() {
    const markerRef = useRef<maplibregl.Marker>(null)
    const popupRef = useRef<maplibregl.Popup>(null)
    const mapRef = useRef<maplibregl.Map>(null)

    const countriesByIdRef = useRef<CountriesById>({})

    useEffect(() => {
        ;(async () => {
            const geojson = await MapService.getCountriesPolygons()

            const lookup: CountriesById = {}
            geojson.features.forEach((feature: MapGeoJSONFeature, index: number) => {
                const id = feature.properties.ADM0_A3 ?? index
                lookup[id] = feature
                feature.id = id
            })

            countriesByIdRef.current = lookup
            // console.log("Countries indexed:", lookup)
        })()
    }, [])
    const onMapClick = (e: MapLayerMouseEvent) => {
        const map = e.target

        popupRef.current?.remove()

        const renderedFeatures: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
            layers: ["countries-fill"],
        })

        if (!renderedFeatures.length) return

        const renderedCountry = renderedFeatures[0]
        const id = renderedCountry.properties.ADM0_A3

        if (id == null) {
            console.warn("Clicked country has no id")
            return
        }

        const sourceCountry = countriesByIdRef.current[id]
        console.log(countriesByIdRef.current)

        if (!sourceCountry) {
            console.warn("Country not found in source data:", id)
            return
        }

        // ✅ Stable geometry
        const countryCentroid = centroid(sourceCountry).geometry.coordinates as LngLatLike

        zoomToCountry(sourceCountry, map, countryCentroid)

        addMarker(markerRef, e.lngLat, map)
        renderPopup(popupRef, sourceCountry.properties, countryCentroid, map)
    }

    const onMapLoad = (e: MapLibreEvent) => {
        const map = e.target
        mapRef.current = map
        map.addSource("countries", {
            type: "geojson",
            data: MAP_CONFIG.countriesPath,
            promoteId: MAP_CONFIG.promoteId,
        })
    }
    const handleZoomIn = () => mapRef.current?.zoomIn()
    const handleZoomOut = () => mapRef.current?.zoomOut()

    return (
        <>
            <Map
                initialViewState={INITIAL_MAP_CONFIG}
                style={{ height: "100%", width: "100%" }}
                mapStyle={MAP_CONFIG.stylePath}
                onClick={onMapClick}
                onLoad={onMapLoad}
            />
            <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
        </>
    )
}

const addMarker = (markerRef: any, lngLat: LngLatLike, map: maplibregl.Map) => {
    if (!markerRef.current) {
        const markerOpts: MarkerOptions = { color: "var(--color-danger-100)", scale: 0.7 }
        markerRef.current = new maplibregl.Marker(markerOpts).setLngLat(lngLat).addTo(map)
    } else {
        markerRef.current.setLngLat(lngLat)
    }
}

const zoomToCountry = (country: MapGeoJSONFeature, map: maplibregl.Map, centroid: LngLatLike) => {
    const bounds = bbox(country)
    const [minX, minY, maxX, maxY] = bounds

    // For dubugging
    // console.log("Country: ", country)
    // console.log("BBox: ", bounds)
    // drawBBox(map, bounds)

    map.fitBounds(
        [
            [minX, minY],
            [maxX, maxY],
        ],
        { padding: 50, duration: 1200, maxZoom: 8, center: centroid }
    )
}

const renderPopup = (popupRef: any, properties: any, centroid: LngLatLike, map: maplibregl.Map) => {
    // Create container
    const popupContainer = document.createElement("div")
    // Render React component
    const root = createRoot(popupContainer)

    const closePopup = () => {
        popupRef.current?.remove()
        root.unmount()
    }

    const { NAME, ADM0_A3 } = properties
    root.render(<CountryPopup name={NAME} iso={ADM0_A3} onClose={closePopup} />)

    // Create MapLibre popup
    popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false })
        .setLngLat(centroid)
        .setDOMContent(popupContainer)
        .addTo(map)

    // console.log(features)
}

//? Debugging bbox boundries
// type BBox = [number, number, number, number] | [number, number, number, number, number, number]
// const bboxToPolygon = (
//     minX: number,
//     minY: number,
//     maxX: number,
//     maxY: number
// ): GeoJSON.GeoJSON => ({
//     type: "Feature",
//     geometry: {
//         type: "Polygon",
//         coordinates: [
//             [
//                 [minX, minY],
//                 [maxX, minY],
//                 [maxX, maxY],
//                 [minX, maxY],
//                 [minX, minY], // close ring
//             ],
//         ],
//     },
//     properties: {},
// })

// const drawBBox = (map: maplibregl.Map, bbox: BBox) => {
//     const [minX, minY, maxX, maxY] = bbox
//     const feature = bboxToPolygon(minX, minY, maxX, maxY)

//     const sourceId = "debug-bbox-source"
//     const lineLayerId = "debug-bbox-line"
//     const fillLayerId = "debug-bbox-fill"

//     if (map.getSource(sourceId)) {
//         ;(map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(feature)
//         return
//     }

//     map.addSource(sourceId, {
//         type: "geojson",
//         data: feature,
//     })

//     map.addLayer({
//         id: fillLayerId,
//         type: "fill",
//         source: sourceId,
//         paint: {
//             "fill-color": "#ff0000",
//             "fill-opacity": 0.15,
//         },
//     })

//     map.addLayer({
//         id: lineLayerId,
//         type: "line",
//         source: sourceId,
//         paint: {
//             "line-color": "#ff0000",
//             "line-width": 2,
//         },
//     })
// }
