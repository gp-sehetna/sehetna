import { toProperCase, unslugifyCountry } from "@/lib/utils"
import bbox from "@turf/bbox"
import maplibregl from "maplibre-gl"

const COUNTRIES_SOURCE = "countries"

type GeoJsonProperties = {
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

const getCountryBySlug = (slug: string, features: maplibregl.MapGeoJSONFeature[]) => {
    const countryName = toProperCase(unslugifyCountry(slug))

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

export { COUNTRIES_SOURCE, getClickedCountry, getCountryBySlug, zoomToCountry }
export type { GeoJsonProperties }
