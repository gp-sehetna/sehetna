"use client"

import centroid from "@turf/centroid"
import { useEffect, useMemo, useRef, useState } from "react"

import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { WeekClientService } from "@/features/environment/week/week.service.client"
import { slugify } from "@/lib/utils"

import {
    colorEachCountry,
    COUNTRIES_SOURCE,
    GeoJsonProperties,
    getClickedCountry,
    getCountryBySlug,
    MapPageProps,
    parseSlug,
    zoomToCountry,
} from "@/shared/config/map"

import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useParams, useRouter } from "next/navigation"
import Map, { MapRef } from "react-map-gl/maplibre"
import { toast } from "sonner"
import ZoomControls from "./ZoomControls"
import RespiratoryLegend from "../legend/RespiratoryLegend"
import MapSources from "./MapSources"
import { useTheme } from "@/hooks/map/use-theme"

export default function MapView({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [popupInfo, setPopupInfo] = useState(null)
    const [hoveredZone, setHoveredZone] = useState<maplibregl.MapGeoJSONFeature | null>(null)
    const params = useParams<MapPageProps["params"]>()

    const popupRef = useRef<maplibregl.Popup>(null)

    const weekService = useMemo(() => new WeekClientService(), [])
    const activeSlug = parseSlug(params.slug)

    const markerRef = useRef<maplibregl.Marker>(null)
    const theme = useTheme(activeSlug.healthOutcome)

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

    const onMouseMove = (e: maplibregl.MapLayerMouseEvent) => {
        const map = e.target
        if (!e.features) return

        const feature = e.features[0]

        if (!feature?.id) return

        const isHoveringAZone = !!feature.id
        const isHoveringANewZone = isHoveringAZone && hoveredZone?.id !== feature.id

        // Reset currently hovered zone if we are no longer hovering anything
        if (!isHoveringAZone && hoveredZone) {
            setHoveredZone(null)
            map.setFeatureState({ source: COUNTRIES_SOURCE, id: hoveredZone.id }, { hover: false })
        }

        // Do no more if we are not hovering a zone
        if (!isHoveringAZone) return

        // Update mouse position to help position the tooltip
        // setMousePosition({ x: e.point.x, y: e.point.y })

        // Update hovered zone if we are hovering a new zone
        // Reset the old one first
        if (isHoveringANewZone && hoveredZone)
            map.setFeatureState({ source: COUNTRIES_SOURCE, id: hoveredZone.id }, { hover: false })

        if (isHoveringANewZone) {
            setHoveredZone(feature)
            map.setFeatureState({ source: COUNTRIES_SOURCE, id: feature.id }, { hover: true })
        }
    }

    const onMouseOut = (e: maplibregl.MapLayerMouseEvent) => {
        const map = e.target

        if (!hoveredZone?.id) return

        // Reset hovered state when mouse leaves map (e.g. cursor moving into panel)
        map.setFeatureState({ source: COUNTRIES_SOURCE, id: hoveredZone.id }, { hover: false })
        setHoveredZone(null)
    }

    const onMapClick = (e: maplibregl.MapLayerMouseEvent) => {
        const map = e.target

        popupRef.current?.remove()

        const country = getClickedCountry(map, e.point)

        if (!country) return
        const slug = slugify(country.properties.name)
        router.push(`/map/${slug}`)

        const center = centroid(country).geometry.coordinates as [number, number]

        markerRef.current?.remove()
        markerRef.current?.setLngLat(e.lngLat).addTo(map)
        zoomToCountry(country, map, center)

        if (!date) {
            toast.warning("Please select a date first.", {
                description: "Use the date picker at the bottom left corner.",
            })
            return
        }

        if (process.env.NODE_ENV == "development") return

        const location = { lat: e.lngLat.lat, lng: e.lngLat.lng, iso: country.properties.isoA3 }
        weekService.simulateEnvironment(location, date)
    }

    const onMapLoad = (e: maplibregl.MapLibreEvent) => {
        const map = e.target,
            features = map.queryRenderedFeatures({ layers: ["countries-fill"] })

        colorEachCountry(map, features, theme)
        if (!activeSlug.country) return

        const country = getCountryBySlug(activeSlug.country, features)

        if (!country) return

        const center = centroid(country).geometry.coordinates as [number, number]
        zoomToCountry(country, map, center)
    }

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
            {/* <Flex className="absolute inset-0 h-full w-fit flex-col gap-2">
                <MainSidebar />
                </Flex> */}

            {/* {popupInfo && (
                <Popup
                    anchor="top"
                    longitude={Number(popupInfo.longitude)}
                    latitude={Number(popupInfo.latitude)}
                    onClose={() => setPopupInfo(null)}
                >
                </Popup>
            )} */}
            <DatePickerSimple date={date} setDate={setDate} className="p-5" />
            <RespiratoryLegend healthOutcome={activeSlug.healthOutcome} />
            <ZoomControls />
        </Map>
    )
}
