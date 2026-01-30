export {
    default as maplibregl,
    type LngLatLike,
    type MapGeoJSONFeature,
    type MapLayerMouseEvent,
    type MapLibreEvent,
    type MarkerOptions,
} from "maplibre-gl"

import baseMapStyle from "@/../public/geo/maptunik.style.json"

export const mapStyle: any = {
    ...baseMapStyle,
    sources: {
        ...baseMapStyle.sources,
        openmaptiles: {
            ...baseMapStyle.sources.openmaptiles,
            url: process.env.NEXT_PUBLIC_MAPTILER_OPENMAPTILES_URL,
        },
    },
}

export const MAP_CONFIG = {
    countriesPath: "geo/countries.geojson",
    promoteId: "ADM0_A3",
} as const
