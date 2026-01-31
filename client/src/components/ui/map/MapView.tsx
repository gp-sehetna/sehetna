"use client"

import { MAP_CONFIG, maplibregl, mapStyle } from "@/shared/config/map"
import bbox from "@turf/bbox"
import centroid from "@turf/centroid"
import { useEffect, useMemo, useRef, useState } from "react"

// MapLibre React wrapper
import { createRoot } from "react-dom/client"
import Map from "react-map-gl/maplibre"

import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { Alert } from "@/lib/alert"
import { slugifyCountry, toProperCase, unslugifyCountry } from "@/lib/utils"
import { api } from "@/shared/api"
import type {
    LngLatLike,
    MapGeoJSONFeature,
    MapLayerMouseEvent,
    MapLibreEvent,
    MarkerOptions,
} from "@/shared/config/map"
import "maplibre-gl/dist/maplibre-gl.css"
import { useParams, useRouter } from "next/navigation"
import CountryPopup from "./CountryPopup"
import ZoomControls from "./ZoomControls"
import { WeekClientService } from "@/features/environment/week/week.service.client"

const INITIAL_MAP_CONFIG = {
    longitude: 31.23,
    latitude: 30.04,
    zoom: 6,
}

type CountriesById = Record<string | number, MapGeoJSONFeature>

export default function MapView() {
    const [geojsonReady, setGeojsonReady] = useState(false)
    const [date, setDate] = useState<Date>()
    const [mapLoaded, setMapLoaded] = useState(false)
    const params = useParams<{ country?: string }>()
    const activeCountrySlug = params.country
    const router = useRouter()
    const markerRef = useRef<maplibregl.Marker>(null)
    const popupRef = useRef<maplibregl.Popup>(null)
    const mapRef = useRef<maplibregl.Map>(null)
    const weekService = useMemo(() => new WeekClientService(), [])

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
            const geojson = await api.get<any>(MAP_CONFIG.countriesPath).json()

            const lookup: CountriesById = {}
            geojson.features.forEach((feature: MapGeoJSONFeature, index: number) => {
                const id = feature.properties.ISO_A3 ?? index
                lookup[id] = feature
                feature.id = id
            })

            countriesByIdRef.current = lookup
            setGeojsonReady(true)
        })()
        if (!mapLoaded) return
        if (!geojsonReady) return
        if (!activeCountrySlug) return
        if (!mapRef.current) return

        zoomToCountryBySlug(activeCountrySlug)
    }, [mapLoaded, geojsonReady, activeCountrySlug])

    const onMapClick = async (e: MapLayerMouseEvent) => {
        if (!date) {
            await Alert.popup.fire({ icon: "warning", title: "Please select a date first." })
            return
        }

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

        if (!sourceCountry) {
            console.warn("Country not found in source data: ", countryIso)
            return
        }

        const slug = slugifyCountry(sourceCountry.properties.NAME)
        router.push(`/map/${slug}`)

        const countryCentroid = centroid(sourceCountry).geometry.coordinates as LngLatLike

        zoomToCountry(sourceCountry, map, countryCentroid)

        const location = { lat: e.lngLat.lat, lng: e.lngLat.lng, iso: countryIso }
        const predictions = await weekService.fetchEnvironmentAndSimulate(location, date)

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
            <DatePickerSimple date={date} setDate={setDate} className="absolute bottom-5 left-5" />
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
