"use client"

import { weekService } from "@/features/environment/week/week.service"
import bbox from "@turf/bbox"
import centroid from "@turf/centroid"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useRef, useState } from "react"
import { maplibregl, mapStyle } from "./config"

// MapLibre React wrapper
import { createRoot } from "react-dom/client"
import Map from "react-map-gl/maplibre"

import { slugifyCountry, toProperCase, unslugifyCountry } from "@/lib/utils"
import "maplibre-gl/dist/maplibre-gl.css"
import { useParams, useRouter } from "next/navigation"
import { DatePickerWithRange } from "../GlobalControls/DatePicker"
import type {
    LngLatLike,
    MapGeoJSONFeature,
    MapLayerMouseEvent,
    MapLibreEvent,
    MarkerOptions,
} from "./config"
import CountryPopup from "./CountryPopup"
import ZoomControls from "./ZoomControls"

const INITIAL_MAP_CONFIG = {
    longitude: 31.23,
    latitude: 30.04,
    zoom: 6,
}

type CountriesById = Record<string | number, MapGeoJSONFeature>

export default function MapView() {
    const [geojsonReady, setGeojsonReady] = useState(false)
    const [mapLoaded, setMapLoaded] = useState(false)
    const params = useParams<{ country?: string }>()
    const activeCountrySlug = params.country
    const router = useRouter()
    const markerRef = useRef<maplibregl.Marker>(null)
    const popupRef = useRef<maplibregl.Popup>(null)
    const mapRef = useRef<maplibregl.Map>(null)

    const countriesByIdRef = useRef<CountriesById>({})

    const zoomToCountryBySlug = (slug: string) => {
        if (!mapRef.current) return

        const countryName = toProperCase(unslugifyCountry(slug))

        const countryFeature = Object.values(countriesByIdRef.current).find(
            (feature) => feature.properties?.NAME?.toLowerCase() === countryName.toLowerCase()
        )

        if (!countryFeature) return

        const centroidCoords = centroid(countryFeature).geometry.coordinates as LngLatLike

        zoomToCountry(countryFeature, mapRef.current, centroidCoords)
    }

    useEffect(() => {
        ;(async () => {
            const geojson = await weekService.getCountriesPolygons()

            const lookup: CountriesById = {}
            geojson.features.forEach((feature: MapGeoJSONFeature, index: number) => {
                const id = feature.properties.ISO_A3 ?? index
                lookup[id] = feature
                feature.id = id
            })

            countriesByIdRef.current = lookup
            setGeojsonReady(true)
            // console.log("Countries indexed:", lookup)
        })()
        if (!mapLoaded) return
        if (!geojsonReady) return
        if (!activeCountrySlug) return
        if (!mapRef.current) return

        zoomToCountryBySlug(activeCountrySlug)
    }, [mapLoaded, geojsonReady, activeCountrySlug])

    const onMapClick = async (e: MapLayerMouseEvent) => {
        const map = e.target

        popupRef.current?.remove()

        const renderedFeatures: MapGeoJSONFeature[] = map.queryRenderedFeatures(e.point, {
            layers: ["countries-fill"],
        })

        if (!renderedFeatures.length) return

        const renderedCountry = renderedFeatures[0]
        const countryIso: string = renderedCountry.properties.ISO_A3

        if (countryIso == null) {
            console.warn("Clicked country has no id")
            return
        }

        const sourceCountry = countriesByIdRef.current[countryIso]
        // console.log(countriesByIdRef.current)

        if (!sourceCountry) {
            console.warn("Country not found in source data: ", countryIso)
            return
        }

        const slug = slugifyCountry(sourceCountry.properties.NAME)
        router.push(`/map/${slug}`)

        const countryCentroid = centroid(sourceCountry).geometry.coordinates as LngLatLike

        zoomToCountry(sourceCountry, map, countryCentroid)

        const predictions = await weekService.fetchEnvironmentAndSimulate(
            e.lngLat.lat,
            e.lngLat.lng,
            countryIso,
            "2023-04-01",
            7
        )

        if (!predictions) return

        addMarker(markerRef, e.lngLat, map)
        renderPopup(popupRef, sourceCountry.properties, countryCentroid, map)
    }

    const onMapLoad = (e: MapLibreEvent) => {
        const map = e.target
        mapRef.current = map
        map.setStyle(mapStyle)
        setMapLoaded(true)
    }
    const handleZoomIn = () => mapRef.current?.zoomIn()
    const handleZoomOut = () => mapRef.current?.zoomOut()

    return (
        <>
            <Map
                reuseMaps
                initialViewState={INITIAL_MAP_CONFIG}
                style={{ height: "100%", width: "100%" }}
                onClick={onMapClick}
                onLoad={onMapLoad}
            />
            <DatePickerWithRange className="absolute bottom-5 left-5" />
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

    const { NAME, ISO_A3 } = properties
    root.render(<CountryPopup name={NAME} iso={ISO_A3} onClose={closePopup} />)

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
