import centroid from "@turf/centroid"
import { useEffect, useMemo, useState } from "react"

import { WeekClientService } from "@/features/environment/week/week.service.client"
import { slugify } from "@/lib/utils"
import "maplibre-gl/dist/maplibre-gl.css"

import { useTheme } from "@/hooks/map/use-theme"
import {
    colorEachCountry,
    COUNTRIES_SOURCE,
    getClickedCountry,
    getCountryBySlug,
    MapPageProps,
    parseSlug,
    zoomToCountry,
} from "@/shared/config/map"
import { MapLibreEvent } from "maplibre-gl"
import { MapGeoJSONFeature, MapLayerMouseEvent } from "react-map-gl/maplibre"

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Coordinates } from "@/shared/types/map"
import { formatDate } from "@/lib/utils/date"

const useMapHook = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const params = useParams<MapPageProps["params"]>()

    const activeSlug = parseSlug(params.slug)
    const { theme, isInvalid } = useTheme(activeSlug.healthOutcome)
    const [markerCoords, setMarkerCoords] = useState<Coordinates | null>(null)

    const [clickedZone, setClickedZone] = useState<MapGeoJSONFeature | null>(null)
    const [hoveredZone, setHoveredZone] = useState<MapGeoJSONFeature | null>(null)

    const weekService = useMemo(() => new WeekClientService(), [])

    const date = useMemo(() => {
        const value = searchParams.get("date")
        return value ? new Date(value) : undefined
    }, [searchParams])

    const setDate = (date?: Date) => {
        const params = new URLSearchParams(searchParams.toString())

        if (!date) params.delete("date")
        else params.set("date", formatDate(date))

        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    useEffect(() => {
        if (!isInvalid) return
        router.back()
        toast.error(
            `Unable to identify theme, health outcome (${activeSlug}) is of an unknown type. Redirecting back...`
        )
    }, [isInvalid, activeSlug, router])

    const onMouseMove = (e: MapLayerMouseEvent) => {
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

    const onMouseOut = (e: MapLayerMouseEvent) => {
        const map = e.target

        if (!hoveredZone?.id) return

        // Reset hovered state when mouse leaves map (e.g. cursor moving into panel)
        map.setFeatureState({ source: COUNTRIES_SOURCE, id: hoveredZone.id }, { hover: false })
        setHoveredZone(null)
    }

    const onMapClick = (e: MapLayerMouseEvent) => {
        const map = e.target

        const country = getClickedCountry(map, e.point)

        if (!country) return
        const countrySlug = slugify(country.properties.name)
        router.push(`/map/${countrySlug}/${activeSlug.healthOutcome}?${searchParams.toString()}`)

        const center = centroid(country).geometry.coordinates as [number, number]
        setMarkerCoords({ lng: e.lngLat.lng, lat: e.lngLat.lat })
        zoomToCountry(country, map, center)
        setClickedZone(country)

        if (!date) {
            toast.warning("Please select a date first.", {
                description: "Use the date picker at the bottom left corner.",
            })
            return
        }

        if (process.env.NODE_ENV == "development") return

        const location = { lng: e.lngLat.lng, lat: e.lngLat.lat, iso: country.properties.isoA3 }
        weekService.simulateEnvironment(location, date)
    }

    const onMapLoad = (e: MapLibreEvent) => {
        const map = e.target,
            features = map.queryRenderedFeatures({ layers: ["countries-fill"] })

        colorEachCountry(map, features, theme)
        if (!activeSlug.country) return

        const country = getCountryBySlug(activeSlug.country, features)

        if (!country) return

        const center = centroid(country).geometry.coordinates as [number, number]
        setMarkerCoords({ lng: center[0], lat: center[1] })
        zoomToCountry(country, map, center)
        setClickedZone(country)
    }

    return {
        onMapLoad,
        onMapClick,
        onMouseMove,
        onMouseOut,
        markerCoords,
        setMarkerCoords,
        clickedZone,
        setClickedZone,
        setDate,
        date,
        hoveredZone,
        theme,
        activeSlug,
    }
}

export default useMapHook
