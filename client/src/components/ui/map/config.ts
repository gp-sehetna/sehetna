export {
    default as maplibregl,
    type LngLatLike,
    type MapGeoJSONFeature,
    type MapLayerMouseEvent,
    type MapLibreEvent,
    type MarkerOptions,
} from "maplibre-gl"

// MapLibre React wrapper
export { default as Map } from "react-map-gl/maplibre"

// Styles (side-effects)
import "maplibre-gl/dist/maplibre-gl.css"

export const MAP_CONFIG = {
    stylePath: "geo/demotiles.maplibre.json",
    countriesPath: "geo/countries.geojson",
    promoteId: "ADM0_A3",
} as const
