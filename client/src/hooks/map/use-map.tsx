"use client"
import centroid from "@turf/centroid"
import { useEffect, useMemo } from "react"

import { WeekClientService } from "@/features/environment/week/week.service.client"
import { slugify, unslugify } from "@/lib/utils"

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

import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { SimulateResponse } from "@/features/environment/week/week.types"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useSettingsStore } from "@/stores/use-settings"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useDateUrlSync } from "./use-date"

const useMapHook = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<MapPageProps["params"]>()

    const {
        hoveredZone,
        markerCoords,
        setClickedZone,
        setHoveredZone,
        setMarkerCoords,
        setHoveredCoords,
    } = useMapStore()
    const explanationMethod = useSettingsStore((s) => s.explanationMethod)
    const { setLoading, onOutcomeSelect, setSimulation, setEnvironment, setModifying } =
        usePredictionsStore()

    const activeSlug = parseSlug(params.slug)

    const { theme, isInvalid, setHealthOutcome } = useThemeStore()

    const weekService = useMemo(
        () => new WeekClientService(setEnvironment, setModifying),
        [setEnvironment, setModifying]
    )

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
        setHoveredCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng })

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
        setHoveredCoords(null)

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
                    ? await weekService.fetchEnvironmentAndSimulate(location, date, 1, {
                          top_k_contributions: 25,
                          explainer_method: explanationMethod,
                      })
                    : await fetch(`/simulation/examples/${explanationMethod}.json`).then(
                          (res) => res.json() as Promise<SimulateResponse>
                      )

            const healthOutcome = unslugify(activeSlug.healthOutcome, "_") as keyof IHealthOutcomes
            if (simulation) setSimulation(simulation, healthOutcome)

            // ? Use this for local debugging of /api/environment/week
            /**
             * @todo Remove this for production
             *  ```
             *  if (process.env.NODE_ENV != "development") return
             *  const environment = await fetch(
             *      `/environment/examples/egypt_2026-02-09.json`
             *  ).then<IEnvironmentData>((res) => res.json())
             *
             *  if (environment) setEnvironment(environment)
             *  ```
             **/
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

        const healthOutcomeKey = unslugify(healthOutcome, "_") as keyof IHealthOutcomes
        onOutcomeSelect(healthOutcomeKey)
    }

    const closeSidebar = () => {
        setClickedZone(null)
        setMarkerCoords(null)
        router.push(`/map/${activeSlug.healthOutcome}`, { scroll: false })
    }

    const onSubmitSimulationForm = async (data: IEnvironmentData) => {
        const simulation = await weekService.simulateEnvironment(data, {
            explainer_method: explanationMethod,
            top_k_contributions: 25,
        })

        const healthOutcome = unslugify(activeSlug.healthOutcome, "_") as keyof IHealthOutcomes
        if (simulation) setSimulation(simulation, healthOutcome)
    }

    return {
        onMapLoad,
        onMapClick,
        onSubmitSimulationForm,
        onMouseMove,
        onMouseOut,
        onLayerSelect,
        weekService,
        closeSidebar,
        markerCoords,
        hoveredZone,
        theme,
        activeSlug,
    }
}

export default useMapHook
