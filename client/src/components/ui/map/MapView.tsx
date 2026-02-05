"use client"

import centroid from "@turf/centroid"
import { useEffect, useMemo, useRef, useState } from "react"

import { DatePickerSimple } from "@/components/ui/GlobalControls/DatePickerSimple"
import { WeekClientService } from "@/features/environment/week/week.service.client"
import { slugifyCountry } from "@/lib/utils"

import {
    COUNTRIES_SOURCE,
    getClickedCountry,
    getCountryBySlug,
    zoomToCountry,
} from "@/shared/config/map"

import maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"
import { useParams, useRouter } from "next/navigation"
import Map from "react-map-gl/maplibre"
import { toast } from "sonner"
import ZoomControls from "./ZoomControls"
import RespiratoryLegend from "../legend/RespiratoryLegend"
import MapSources from "./MapSources"

export default function MapView({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [date, setDate] = useState<Date>()
    const [popupInfo, setPopupInfo] = useState(null)
    const [hoveredZone, setHoveredZone] = useState<maplibregl.MapGeoJSONFeature | null>(null)
    const params = useParams<{ country?: string }>()

    const popupRef = useRef<maplibregl.Popup>(null)

    const weekService = useMemo(() => new WeekClientService(), [])
    const activeCountrySlug = params.country

    const markerRef = useRef<maplibregl.Marker>(null)

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
        if (!date) {
            toast.warning("Please select a date first.", {
                description: "Use the date picker at the bottom left corner.",
            })
            return
        }

        const map = e.target

        popupRef.current?.remove()

        const country = getClickedCountry(map, e.point)

        if (!country) return
        const slug = slugifyCountry(country.properties.name)
        router.push(`/map/${slug}`)

        const center = centroid(country).geometry.coordinates as [number, number]

        markerRef.current?.remove()
        markerRef.current?.setLngLat(e.lngLat).addTo(map)
        zoomToCountry(country, map, center)

        // const location = { lat: e.lngLat.lat, lng: e.lngLat.lng, iso: country.properties.isoA3 }
        // weekService.simulateEnvironment(location, date)
    }

    const onMapLoad = (e: maplibregl.MapLibreEvent) => {
        const map = e.target,
            features = map.queryRenderedFeatures({ layers: ["countries-fill"] })

        if (!activeCountrySlug) return

        const country = getCountryBySlug(activeCountrySlug, features)

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
            <RespiratoryLegend />
            <ZoomControls />
        </Map>
    )
}
