import { PredictionsAggregates } from "@/features/environment/prediction/prediction.types"
import { slugify, toProperCase, unslugify } from "@/lib/utils"
import {
    DEFAULT_HEALTH_OUTCOME,
    HEALTH_OUTCOMES_WITH_HYPHEN,
} from "@/shared/config/health-outcomes"
import bbox from "@turf/bbox"
import { GeoJSONFeature, LngLatBoundsLike, Map, PointLike } from "maplibre-gl"
import { GradientPalette } from "./map-colors"

const COUNTRIES_SOURCE = "countries"

type GeoJsonProperties =
    | GeoJSONFeature["properties"]
    | {
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

export type Slug = {
    country: string | null
    healthOutcome: string
}

export type ActiveSlug = {
    slug: Slug
}

const parseSlug = (slug: string[] = []): Slug => {
    let country: string | null = null
    let healthOutcome = slugify(DEFAULT_HEALTH_OUTCOME) as string

    if (slug.length === 1) {
        if (HEALTH_OUTCOMES_WITH_HYPHEN.includes(slug[0])) healthOutcome = slug[0]
        else country = slug[0]
    }

    if (slug.length === 2) {
        country = slug[0]
        healthOutcome = slug[1]
    }

    return { country, healthOutcome }
}

const getCountryBySlug = (slug: string, features: GeoJSONFeature[]) => {
    const countryName = toProperCase(unslugify(slug))

    return features.find((f) => f.properties?.name?.toLowerCase() === countryName.toLowerCase())
}

const zoomToCountry = (country: GeoJSONFeature, map: Map, centroid: [number, number]) => {
    const bounds = bbox(country)
    const [minX, minY, maxX, maxY] = bounds
    const alignedBounds: LngLatBoundsLike = [
        [minX, minY],
        [maxX, maxY],
    ]
    map.fitBounds(alignedBounds, { padding: 50, duration: 1200, maxZoom: 8, center: centroid })
}

const getClickedCountry = (map: Map, point: PointLike) => {
    const features = map.queryRenderedFeatures(point, { layers: ["land"] })

    if (!features.length) return null

    return features[0]
}

const colorEachCountry = (
    map: Map,
    features: GeoJSONFeature[],
    theme: GradientPalette,
    predictionsMap: PredictionsAggregates
) => {
    map.touchZoomRotate.disableRotation()
    map.touchPitch.disable()

    for (const feature of features) {
        const { id, isoA3 } = feature.properties as GeoJsonProperties
        const prediction = predictionsMap[isoA3]
        if (!prediction) continue

        const fillColor = theme.colorScale(prediction.sum / prediction.count)
        const existingColor = map.getFeatureState({ source: COUNTRIES_SOURCE, id })?.color

        if (existingColor !== fillColor)
            map.setFeatureState({ source: COUNTRIES_SOURCE, id }, { color: fillColor })
    }
}

export {
    colorEachCountry,
    COUNTRIES_SOURCE,
    getClickedCountry,
    getCountryBySlug,
    parseSlug,
    zoomToCountry,
}
export type { GeoJsonProperties, MapPageProps }
