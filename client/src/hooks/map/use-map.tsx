"use client"
import centroid from "@turf/centroid"
import { useEffect, useMemo } from "react"

import { SimulateClientService } from "@/features/environment/simulate/simulate.service.client"
import { slugify } from "@/lib/utils"

import {
    colorEachCountry,
    COUNTRIES_SOURCE,
    getClickedCountry,
    getCountryBySlug,
    MapPageProps,
    parseSlug,
    zoomToCountry,
} from "@/shared/config/map"
import { useThemeStore } from "@/stores/map/use-theme"
import { MapLibreEvent } from "maplibre-gl"
import { MapLayerMouseEvent } from "react-map-gl/maplibre"

import { SimulateResponse } from "@/features/environment/week/week.types"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useSettingsStore } from "@/stores/use-settings"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useDateUrlSync } from "./use-date"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { WeekClientService } from "@/features/environment/week/week.service.client"

const useMapHook = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<MapPageProps["params"]>()

    const { hoveredZone, markerCoords, setClickedZone, setHoveredZone, setMarkerCoords } =
        useMapStore()
    const { explanationMethod } = useSettingsStore()
    const { setLoading, onOutcomeSelect, setSimulation } = usePredictionsStore()

    const activeSlug = parseSlug(params.slug)

    const { theme, isInvalid, setHealthOutcome } = useThemeStore()

    const simulateService = useMemo(() => new SimulateClientService(new WeekClientService()), [])

    const { date } = useDateUrlSync(activeSlug)

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

    const onMapClick = async (e: MapLayerMouseEvent) => {
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

        const location = { lng: e.lngLat.lng, lat: e.lngLat.lat, iso: country.properties.isoA3 }
        try {
            setLoading(true)

            const simulation =
                process.env.NODE_ENV != "development"
                    ? await simulateService.simulateEnvironment(location, date, 1, {
                          top_k_contributions: 25,
                          explainer_method: explanationMethod,
                      })
                    : await fetch(`/simulation/examples/${explanationMethod}.json`).then(
                          (res) => res.json() as Promise<SimulateResponse>
                      )
            const healthOutcome = activeSlug.healthOutcome.replace(
                /-/g,
                "_"
            ) as keyof IHealthOutcomes

            if (simulation) setSimulation(simulation, healthOutcome)
        } finally {
            setLoading(false)
        }
    }

    const onMapLoad = (e: MapLibreEvent) => {
        const map = e.target,
            features = map.querySourceFeatures("countries")

        colorEachCountry(map, features, theme)
        if (!activeSlug.country) return

        const country = getCountryBySlug(activeSlug.country, features)

        if (!country) return

        const center = centroid(country).geometry.coordinates as [number, number]
        setMarkerCoords({ lng: center[0], lat: center[1] })
        zoomToCountry(country, map, center)
        setClickedZone(country)
    }

    const onLayerSelect = (healthOutcome: string) => {
        const params = new URLSearchParams(searchParams.toString())

        router.push(
            activeSlug.country
                ? `/map/${activeSlug.country}/${healthOutcome}?${params}`
                : `/map/${healthOutcome}?${params}`
        )

        setHealthOutcome(healthOutcome)

        const healthOutcomeKey = healthOutcome.replace(/-/g, "_") as keyof IHealthOutcomes
        onOutcomeSelect(healthOutcomeKey)
    }

    const closeSidebar = () => {
        setClickedZone(null)
        setMarkerCoords(null)
        router.push(`/map/${activeSlug.healthOutcome}`, { scroll: false })
    }

    return {
        onMapLoad,
        onMapClick,
        onMouseMove,
        onMouseOut,
        onLayerSelect,
        closeSidebar,
        markerCoords,
        hoveredZone,
        theme,
        activeSlug,
    }
}

export default useMapHook
