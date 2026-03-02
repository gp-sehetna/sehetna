import useLayers from "@/hooks/map/use-layers"
import { COUNTRIES_SOURCE } from "@/shared/config/map"
import { GradientPalette } from "@/shared/config/map-colors"
import { useThemeStore } from "@/stores/map/use-theme"
import { Layer, Source } from "react-map-gl/maplibre"

type Props = {
    theme: GradientPalette
}

const MapSources = ({ theme }: Props) => {
    const activeThemeIds = useThemeStore((state) => state.activeThemeIds)
    const { backgroundLayer, layers } = useLayers(theme, activeThemeIds)

    return (
        <>
            <Layer {...backgroundLayer} />
            <Source
                id={COUNTRIES_SOURCE}
                type="geojson"
                promoteId="id"
                data="/geo/countries.geojson"
            >
                {layers.map((layer) => (
                    <Layer key={layer.id} {...layer} />
                ))}
            </Source>
        </>
    )
}

export default MapSources
