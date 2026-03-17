"use client"
import centroid from "@turf/centroid"
import { useCallback, useEffect, useMemo, useRef } from "react"

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
import { useDateUrlSync } from "@/hooks/map/use-date"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { useMapStore } from "@/stores/map/use-map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useSettingsStore } from "@/stores/use-settings"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const useMapHook = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<MapPageProps["params"]>()
    const centroidCache = useRef(new Map())

    // more focused states to prevent unnecessary re-renders...
    const {
        hoveredZone,
        markerCoords,
        hoveredCoords,
        setClickedZone,
        setHoveredZone,
        setHoveredCoords,
        setMarkerCoords,
        updateTooltipPosition,
        unmountToolTip,
    } = useMapStore()

    const explanationMethod = useSettingsStore((s) => s.explanationMethod)

    const { setLoading, setModifying, onOutcomeSelect, setSimulation, setEnvironment } =
        usePredictionsStore()

    const activeSlug = parseSlug(params.slug)

    const { theme, isInvalid, setTheme } = useThemeStore()

    const { date } = useDateUrlSync(activeSlug)

    const weekService = useMemo(
        () => new WeekClientService(setEnvironment, setModifying),
        [setEnvironment, setModifying]
    )

    useEffect(() => {
        if (!isInvalid) return
        toast.error(
            `Unable to identify theme, health outcome (${activeSlug.healthOutcome}) is of an unknown type. Redirecting back...`
        )
    }, [isInvalid, activeSlug])

    const predictionMap = useMemo(() => {
        return usePredictionsStore.getState().predictionMap
    }, [])

    const onMouseMove = useCallback(
        (e: MapLayerMouseEvent) => {
            const map = e.target

            if (!e.features || !e.features.length) {
                if (hoveredZone) {
                    map.setFeatureState(
                        { source: COUNTRIES_SOURCE, id: hoveredZone.id },
                        { hover: false }
                    )
                    setHoveredZone(null)
                    setHoveredCoords(null)
                }
                return
            }

            const feature = e.features[0]

            const isNewZone = hoveredZone?.id !== feature.id

            requestAnimationFrame(() => {
                updateTooltipPosition(e.point.x, e.point.y)
            })

            if (!isNewZone) return

            // remove old hover
            if (hoveredZone) {
                map.setFeatureState(
                    { source: COUNTRIES_SOURCE, id: hoveredZone.id },
                    { hover: false }
                )
            }

            // set new hover
            setHoveredZone(feature)
            const isHoverable = !!predictionMap[feature.properties.isoA3]
            map.setFeatureState(
                { source: COUNTRIES_SOURCE, id: feature.id },
                { hover: isHoverable }
            )

            let coords = centroidCache.current.get(feature.id)

            if (!coords) {
                coords = centroid(feature).geometry.coordinates
                centroidCache.current.set(feature.id, coords)
            }

            const [lng, lat] = coords

            setHoveredCoords({
                lng,
                lat,
            })
        },
        [hoveredZone, setHoveredZone, setHoveredCoords]
    )

    const onMouseOut = useCallback(
        (e: MapLayerMouseEvent) => {
            const map = e.target

            if (!hoveredZone?.id) return

            map.setFeatureState({ source: COUNTRIES_SOURCE, id: hoveredZone.id }, { hover: false })

            setHoveredZone(null)
            setHoveredCoords(null)
            unmountToolTip()
        },
        [hoveredZone, setHoveredZone, setHoveredCoords, unmountToolTip]
    )

    const onMapClick = useCallback(
        async (e: MapLayerMouseEvent) => {
            const map = e.target
            const country = getClickedCountry(map, e.point)

            if (!country) return
            const countrySlug = slugify(country.properties.name)
            router.push(
                `/map/${countrySlug}/${activeSlug.healthOutcome}?${searchParams.toString()}`
            )

            let center = centroidCache.current.get(country.id)

            if (!center) {
                center = centroid(country).geometry.coordinates
                centroidCache.current.set(country.id, center)
            }

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

                const healthOutcome = unslugify(
                    activeSlug.healthOutcome,
                    "_"
                ) as keyof IHealthOutcomes
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
        },
        [date, activeSlug, explanationMethod]
    )

    const onMapLoad = useCallback(
        (e: MapLibreEvent) => {
            const map = e.target,
                features = map.querySourceFeatures("countries")

            colorEachCountry(map, features, theme)
            if (!activeSlug.country) return

            const country = getCountryBySlug(activeSlug.country, features)

            if (!country) return

            let center = centroidCache.current.get(country.id)

            if (!center) {
                center = centroid(country).geometry.coordinates
                centroidCache.current.set(country.id, center)
            }

            setMarkerCoords({ lng: center[0], lat: center[1] })
            zoomToCountry(country, map, center)
            setClickedZone(country)
        },
        [theme, activeSlug.country, setMarkerCoords, setClickedZone]
    )

    const onLayerSelect = useCallback(
        (healthOutcome: string) => {
            const params = new URLSearchParams(searchParams.toString())
            const healthOutcomeKey = unslugify(healthOutcome, "_") as keyof IHealthOutcomes

            setTheme(healthOutcomeKey)
            onOutcomeSelect(healthOutcomeKey)

            router.push(
                activeSlug.country
                    ? `/map/${activeSlug.country}/${healthOutcome}?${params}`
                    : `/map/${healthOutcome}?${params}`
            )
        },
        [searchParams, setTheme, onOutcomeSelect, router, activeSlug.country]
    )

    const closeSidebar = useCallback(() => {
        setClickedZone(null)
        setMarkerCoords(null)
        router.push(`/map/${activeSlug.healthOutcome}`, { scroll: false })
    }, [router, activeSlug.healthOutcome, setClickedZone, setMarkerCoords])

    const onSubmitSimulationForm = useCallback(
        async (data: IEnvironmentData) => {
            const simulation = await weekService.simulateEnvironment(data, {
                explainer_method: explanationMethod,
                top_k_contributions: 25,
            })

            const healthOutcome = unslugify(activeSlug.healthOutcome, "_") as keyof IHealthOutcomes
            if (simulation) setSimulation(simulation, healthOutcome)
        },
        [weekService, explanationMethod, activeSlug.healthOutcome, setSimulation]
    )

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
        hoveredCoords,
    }
}

export default useMapHook
