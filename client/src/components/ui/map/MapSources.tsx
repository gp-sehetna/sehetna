import useLayers from "@/hooks/map/use-layers"
import { GradientPalette } from "@/shared/config/map-colors"
import { Source, Layer } from "react-map-gl/maplibre"

type Props = {
    theme: GradientPalette
}

const MapSources = ({ theme }: Props) => {
    const {
        backgroundLayer,
        countriesHoverLayer,
        countryBondariesHoverableLayer,
        countriesLayer,
        boundariesLayer,
    } = useLayers(theme)

    return (
        <>
            <Layer {...backgroundLayer} />
            <Source id="countries" type="geojson" promoteId="id" data="/geo/countries.geojson">
                <Layer {...countriesLayer} />
                <Layer {...countriesHoverLayer} />
                <Layer {...countryBondariesHoverableLayer} />
                <Layer {...boundariesLayer} />
            </Source>
        </>
    )
}

export default MapSources
