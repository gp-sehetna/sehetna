import baseMapStyle from "@/../public/geo/maptunik.style.json"
import { toProperCase, unslugifyCountry } from "@/lib/utils"
import maplibregl from "maplibre-gl"

const mapStyle: any = {
    ...baseMapStyle,
    sources: {
        ...baseMapStyle.sources,
        openmaptiles: {
            ...baseMapStyle.sources.openmaptiles,
            url: process.env.NEXT_PUBLIC_MAPTILER_OPENMAPTILES_URL,
        },
    },
}

const MAP_CONFIG = {
    countriesPath: "geo/countries.geojson",
    promoteId: "ADM0_A3",
} as const

type CountriesById = Record<string | number, maplibregl.MapGeoJSONFeature>

function getCountryBySlug(
    slug: string,
    countries: CountriesById
): maplibregl.MapGeoJSONFeature | undefined {
    const countryName = toProperCase(unslugifyCountry(slug))

    return Object.values(countries).find(
        (f) => f.properties?.NAME?.toLowerCase() === countryName.toLowerCase()
    )
}

function buildCountriesLookup(geojson: any): CountriesById {
    const lookup: CountriesById = {}

    geojson.features.forEach((feature: maplibregl.MapGeoJSONFeature, index: number) => {
        const id = feature.properties.ISO_A3 ?? index
        feature.id = id
        lookup[id] = feature
    })

    return lookup
}

function getClickedCountry(
    map: maplibregl.Map,
    point: maplibregl.PointLike,
    countries: CountriesById
) {
    const features = map.queryRenderedFeatures(point, {
        layers: ["countries-fill"],
    }) as maplibregl.MapGeoJSONFeature[]

    if (!features.length) return null

    const iso = features[0].properties?.ISO_A3
    if (!iso) return null

    return countries[iso] ?? null
}

export { buildCountriesLookup, getClickedCountry, getCountryBySlug, MAP_CONFIG, mapStyle }
export type { CountriesById }
