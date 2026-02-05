import useLayers from "@/hooks/map/use-layers"
import { Source, Layer } from "react-map-gl/maplibre"

const MapSources = () => {
    const {
        backgroundLayer,
        countriesHoverLayer,
        countryBondariesHoverableLayer,
        countriesLayer,
        boundariesLayer,
    } = useLayers()

    return (
        <>
            <Layer {...backgroundLayer} />
            <Source
                id="countries"
                type="geojson"
                promoteId="wikiDataId"
                data="/geo/countries.geojson"
            >
                <Layer {...countriesLayer} />
                <Layer {...countriesHoverLayer} />
                <Layer {...countryBondariesHoverableLayer} />
                <Layer {...boundariesLayer} />
            </Source>
        </>
    )
}

export default MapSources
