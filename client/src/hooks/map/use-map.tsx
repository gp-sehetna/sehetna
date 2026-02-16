"use client"
import centroid from "@turf/centroid"
import { useEffect, useMemo, useState } from "react"

import { WeekClientService } from "@/features/environment/week/week.service.client"
import { slugify } from "@/lib/utils"

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
import { GeoJSONFeature, MapLibreEvent } from "maplibre-gl"
import { MapLayerMouseEvent } from "react-map-gl/maplibre"

import { Prediction, SimulateResponse } from "@/features/environment/week/week.types"
import { Coordinates } from "@/shared/types/map"
import { usePredictionsStore } from "@/stores/usePredictions"
import { format } from "date-fns"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const useMapHook = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams<MapPageProps["params"]>()

    const { setLoading, onOutcomeSelect, setSimulation } = usePredictionsStore()

    const activeSlug = parseSlug(params.slug)

    const { theme, isInvalid } = useTheme(activeSlug.healthOutcome)
    const [markerCoords, setMarkerCoords] = useState<Coordinates | null>(null)

    const [clickedZone, setClickedZone] = useState<GeoJSONFeature | null>(null)
    const [hoveredZone, setHoveredZone] = useState<GeoJSONFeature | null>(null)

    const weekService = useMemo(() => new WeekClientService(), [])

    const date = useMemo(() => {
        const value = searchParams.get("date")
        return value ? new Date(value) : undefined
    }, [searchParams])

    const setDate = (date?: Date) => {
        const params = new URLSearchParams(searchParams.toString())

        if (!date) params.delete("date")
        else params.set("date", format(date, "yyyy-MM-dd"))

        const basePath = activeSlug.country
            ? `/map/${activeSlug.country}/${activeSlug.healthOutcome}`
            : `/map/${activeSlug.healthOutcome}`

        router.push(`${basePath}?${params.toString()}`, { scroll: false })
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
                    ? await weekService.simulateEnvironment(location, date).unwrap()
                    : ({
                          explanations: {
                              method: "group",
                              group: {
                                  respiratory_disease_rate: [
                                      {
                                          group: "Air Quality",
                                          shap_sum: -12.92829562666441,
                                          abs_shap_sum: 13.218885800920186,
                                          percent: 49.557748704283746,
                                      },
                                      {
                                          group: "Exposure & Risk",
                                          shap_sum: 3.39532803102833,
                                          abs_shap_sum: 4.135468630620453,
                                          percent: 15.503917520527363,
                                      },
                                      {
                                          group: "Socioeconomic",
                                          shap_sum: 3.9156775802524497,
                                          abs_shap_sum: 3.9156775802524497,
                                          percent: 14.679918447864987,
                                      },
                                  ],
                                  cardio_mortality_rate: [
                                      {
                                          group: "Climate",
                                          shap_sum: -6.2529827134712095,
                                          abs_shap_sum: 7.833883679182981,
                                          percent: 57.34417415336522,
                                      },
                                      {
                                          group: "Exposure & Risk",
                                          shap_sum: 1.2417194426947025,
                                          abs_shap_sum: 1.6758630513414028,
                                          percent: 12.267348687941473,
                                      },
                                      {
                                          group: "Socioeconomic",
                                          shap_sum: 1.398218746184466,
                                          abs_shap_sum: 1.5193637478516393,
                                          percent: 11.121770877277156,
                                      },
                                  ],
                                  vector_disease_risk_score: [
                                      {
                                          group: "Climate",
                                          shap_sum: 25.27706281635237,
                                          abs_shap_sum: 31.474613269420264,
                                          percent: 77.50368273372627,
                                      },
                                      {
                                          group: "Socioeconomic",
                                          shap_sum: -0.7396956358927128,
                                          abs_shap_sum: 2.324741591572092,
                                          percent: 5.724487643702189,
                                      },
                                      {
                                          group: "Exposure & Risk",
                                          shap_sum: -0.30526520258310474,
                                          abs_shap_sum: 1.9024651991625432,
                                          percent: 4.684666272011195,
                                      },
                                  ],
                                  waterborne_disease_incidents: [
                                      {
                                          group: "Socioeconomic",
                                          shap_sum: 5.513760253619402,
                                          abs_shap_sum: 6.221129070956668,
                                          percent: 28.80129612703495,
                                      },
                                      {
                                          group: "Exposure & Risk",
                                          shap_sum: 5.7520772989727265,
                                          abs_shap_sum: 5.9828120256033435,
                                          percent: 27.69798518185862,
                                      },
                                      {
                                          group: "Healthcare",
                                          shap_sum: 3.7501931951947336,
                                          abs_shap_sum: 3.9809279218253506,
                                          percent: 18.430076378280685,
                                      },
                                  ],
                                  heat_related_admissions: [
                                      {
                                          group: "Climate",
                                          shap_sum: -1.035565712622101,
                                          abs_shap_sum: 16.548716148818475,
                                          percent: 53.92140341346592,
                                      },
                                      {
                                          group: "Exposure & Risk",
                                          shap_sum: -3.1285486404789844,
                                          abs_shap_sum: 3.4534607820943344,
                                          percent: 11.252561850073626,
                                      },
                                      {
                                          group: "Geographic & Spatial",
                                          shap_sum: -2.132491319217224,
                                          abs_shap_sum: 3.157222406407673,
                                          percent: 10.287315433475273,
                                      },
                                  ],
                              },
                          },
                          predictions: [
                              {
                                  respiratory_disease_rate: 61.560547003297565,
                                  cardio_mortality_rate: 26.24754667117697,
                                  vector_disease_risk_score: 36.601777233290086,
                                  waterborne_disease_incidents: 29,
                                  heat_related_admissions: 8,
                              },
                          ],
                      } as SimulateResponse)
            const healthOutcome = activeSlug.healthOutcome.replace(/-/g, "_") as keyof Prediction

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

        // you already got the data in memory
        const healthOutcomeKey = healthOutcome.replace(/-/g, "_") as keyof Prediction
        onOutcomeSelect(healthOutcomeKey) // change healthoutcome in state & curr predictions shown in sidebar
    }

    const closeCountryDetails = () => {
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
        closeCountryDetails,
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
