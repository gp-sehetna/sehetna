import { toProperCase, unslugify } from "@/lib/utils"
import bbox from "@turf/bbox"
import maplibregl from "maplibre-gl"
import { DEFAULT_HEALTH_OUTCOME, HEALTH_OUTCOMES } from "@/shared/config/health-outcomes"
import { GradientPalette } from "./map-colors"

const COUNTRIES_SOURCE = "countries"

type GeoJsonProperties = {
    id: string
    scalerRank: number
    countryName: string
    type: string
    admin: string
    geoUnit: string
    subUnit: string
    name: string
    longName: string
    abbreviation: string
    populationEstimate: number
    populationRank: number
    populationYear: number
    milDollarsGDP: number
    yearGDP: number
    economy: string
    incomeGroup: string
    isoA2: string
    isoA3: string
    isoN3: string
    WOE_ID: number
    WOE_NOTE: string
    continent: string
    regionUnit: string
    subRegion: string
    regionWB: string
    wikiDataId: string
    arabicName: string
    englishName: string
}

type MapPageProps = {
    params: {
        slug?: string[]
    }
}

const parseSlug = (slug: string[] = []) => {
    let country: string | null = null
    let healthOutcome = DEFAULT_HEALTH_OUTCOME as string

    if (slug.length === 1) {
        if (HEALTH_OUTCOMES.includes(slug[0])) healthOutcome = slug[0]
        else country = slug[0]
    }

    if (slug.length === 2) {
        country = slug[0]
        healthOutcome = slug[1]
    }

    return { country, healthOutcome }
}

const getCountryBySlug = (slug: string, features: maplibregl.MapGeoJSONFeature[]) => {
    const countryName = toProperCase(unslugify(slug))

    return features.find((f) => f.properties?.name?.toLowerCase() === countryName.toLowerCase())
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

const getClickedCountry = (map: maplibregl.Map, point: maplibregl.PointLike) => {
    const features = map.queryRenderedFeatures(point, { layers: ["countries-fill"] })

    if (!features.length) return null

    return features[0]
}

const colorEachCountry = (
    map: maplibregl.Map,
    features: maplibregl.MapGeoJSONFeature[],
    theme: GradientPalette
) => {
    // This effect colors the zones based on the co2 intensity
    map.touchZoomRotate.disableRotation()
    map.touchPitch.disable()
    for (const feature of features) {
        const { id, populationRank } = feature.properties as GeoJsonProperties
        // const zone = data.data?.zones[id]
        const healthOutcomeValue = populationRank //! FOR MOCK DATA

        const fillColor = theme.colorScale(healthOutcomeValue)

        const existingColor = map.getFeatureState({ source: COUNTRIES_SOURCE, id })?.color

        if (existingColor !== fillColor) {
            map.setFeatureState({ source: COUNTRIES_SOURCE, id }, { color: fillColor })
        }
    }
}

export {
    COUNTRIES_SOURCE,
    getClickedCountry,
    getCountryBySlug,
    zoomToCountry,
    parseSlug,
    colorEachCountry,
}
export type { GeoJsonProperties, MapPageProps }
