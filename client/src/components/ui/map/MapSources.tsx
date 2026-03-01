import useLayers from "@/hooks/map/use-layers"
import { GradientPalette } from "@/shared/config/map-colors"
import { Layer, Source } from "react-map-gl/maplibre"

type Props = {
    theme: GradientPalette
}

const MapSources = ({ theme }: Props) => {
    const { backgroundLayer, layers } = useLayers(theme)

    return (
        <>
            <Layer {...backgroundLayer} />
            <Source id="countries" type="geojson" promoteId="id" data="/geo/countries.geojson">
                {layers.map((layer) => (
                    <Layer key={layer.id} {...layer} />
                ))}
            </Source>
        </>
    )
}

export default MapSources
