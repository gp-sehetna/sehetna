"use client"

import bbox from "@turf/bbox"
import centroid from "@turf/centroid"
import { useEffect, useMemo, useRef, useState } from "react"

// MapLibre React wrapper
import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { WeekClientService } from "@/features/environment/week/week.service.client"
import { Prediction } from "@/features/environment/week/week.types"
import { slugifyCountry } from "@/lib/utils"
import { api } from "@/shared/api"
import { createRoot } from "react-dom/client"

import {
    buildCountriesLookup,
    CountriesById,
    getClickedCountry,
    getCountryBySlug,
    MAP_CONFIG,
    mapStyle,
} from "@/shared/config/map"
import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useParams, useRouter } from "next/navigation"
import Map from "react-map-gl/maplibre"
import { toast } from "sonner"
import CountryPopup from "./CountryPopup"
import ZoomControls from "./ZoomControls"
import CompactSidebar from "../GlobalComponents/SideBars/CompactSidebar"
import MainSidebar from "../GlobalComponents/SideBars/MainSidebar"

export default function MapView({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [geojsonReady, setGeojsonReady] = useState(false)

    const [date, setDate] = useState<Date>()
    const [mapLoaded, setMapLoaded] = useState(false)
    const params = useParams<{ country?: string }>()

    const popupRef = useRef<maplibregl.Popup | null>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const countriesByIdRef = useRef<CountriesById>({})

    const weekService = useMemo(() => new WeekClientService(), [])
    const activeCountrySlug = params.country

    const markerRef = useRef<maplibregl.Marker | null>(null)

    useEffect(() => {
        markerRef.current = new maplibregl.Marker({
            color: "var(--color-danger-100)",
            scale: 0.7,
        })

        return () => {
            markerRef.current?.remove()
            markerRef.current = null
        }
    }, [])

    useEffect(() => {
        async function loadCountries() {
            const geojson = await api.get<any>(MAP_CONFIG.countriesPath).json()
            countriesByIdRef.current = buildCountriesLookup(geojson)
            setGeojsonReady(true)
        }

        loadCountries()
    }, [])

    useEffect(() => {
        if (!mapLoaded || !geojsonReady || !activeCountrySlug) return
        if (!mapRef.current) return

        const country = getCountryBySlug(activeCountrySlug, countriesByIdRef.current)

        if (!country) return

        const center = centroid(country).geometry.coordinates as [number, number]
        zoomToCountry(country, mapRef.current, center)
    }, [mapLoaded, geojsonReady, activeCountrySlug])

    const onMapClick = (e: maplibregl.MapLayerMouseEvent) => {
        if (!date) {
            toast.warning("Please select a date first.", {
                description: "Use the date picker at the bottom left corner.",
            })
            return
        }

        const map = e.target

        popupRef.current?.remove()

        const country = getClickedCountry(map, e.point, countriesByIdRef.current)

        if (!country) return
        const slug = slugifyCountry(country.properties.NAME)
        router.push(`/map/${slug}`)

        const center = centroid(country).geometry.coordinates as [number, number]

        markerRef.current?.remove()
        markerRef.current?.setLngLat(e.lngLat).addTo(map)
        zoomToCountry(country, map, center)
        renderPopup(popupRef, country.properties, center, map)

        const location = { lat: e.lngLat.lat, lng: e.lngLat.lng, iso: country.properties.ISO_A3 }
        weekService.simulateEnvironment(location, date)
    }

    const onMapLoad = (e: maplibregl.MapLibreEvent) => {
        const map = e.target
        mapRef.current = map

        map.setStyle(mapStyle)
        setMapLoaded(true)
    }
    const handleZoomIn = () => mapRef.current?.zoomIn()
    const handleZoomOut = () => mapRef.current?.zoomOut()

    return (
        <>
            <Map reuseMaps onClick={onMapClick} onLoad={onMapLoad}>
                {children}
                <div className="absolute top-0 left-0 flex w-fit gap-4">
                    <CompactSidebar />
                    <MainSidebar />
                </div>
                <DatePickerSimple
                    date={date}
                    setDate={setDate}
                    className="absolute bottom-5 left-5"
                />
                <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
            </Map>
        </>
    )
}

const zoomToCountry = (
    country: maplibregl.MapGeoJSONFeature,
    map: maplibregl.Map,
    centroid: [number, number]
) => {
    const bounds = bbox(country)
    const [minX, minY, maxX, maxY] = bounds
    const alignedBounds: maplibregl.LngLatBoundsLike = [
        [minX, minY],
        [maxX, maxY],
    ]
    map.fitBounds(alignedBounds, { padding: 50, duration: 1200, maxZoom: 8, center: centroid })
}

const renderPopup = (
    popupRef: React.RefObject<maplibregl.Popup | null>,
    properties: maplibregl.GeoJSONFeature["properties"],
    centroid: maplibregl.LngLatLike,
    map: maplibregl.Map
) => {
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
