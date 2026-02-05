import {
    BackgroundLayerSpecification,
    FillLayerSpecification,
    LineLayerSpecification,
    SymbolLayerSpecification,
} from "maplibre-gl"
import { useMemo } from "react"

const useLayers = () => {
    const backgroundLayer = useMemo<BackgroundLayerSpecification>(
        () => ({
            id: "ocean",
            type: "background",
            paint: {
                "background-color": "rgba(248, 250, 255, 1)",
                "background-opacity": 1,
            },
        }),
        []
    )

    const countryBondariesHoverableLayer = useMemo<LineLayerSpecification>(
        () => ({
            id: "country-boundaries-hover-layer",
            type: "line",
            source: "countries",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#fff",
                "line-translate-anchor": "map",
                "line-width": 2,
                "line-blur": 0.4,
                "line-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 1, 0],
            },
        }),
        []
    )

    const countriesHoverLayer = useMemo<FillLayerSpecification>(
        () => ({
            id: "countries-hover-layer",
            type: "fill",
            source: "countries",
            paint: {
                "fill-color": "#FFFFFF",
                "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.3, 0],
            },
        }),
        []
    )

    const countriesLayer = useMemo<FillLayerSpecification>(
        () => ({
            id: "countries-fill",
            type: "fill",
            source: "countries",
            filter: ["all"],
            paint: { "fill-color": "rgba(255, 168, 70, 1)", "fill-antialias": false },
        }),
        []
    )

    const boundariesLayer = useMemo<LineLayerSpecification>(
        () => ({
            id: "country_boundries",
            type: "line",
            source: "countries",
            layout: {
                "line-cap": "round",
                "line-join": "round",
            },
            paint: {
                "line-color": "#fff",
                "line-translate-anchor": "map",
                "line-opacity": 1,
                "line-width": 0.3,
                "line-blur": 0.2,
            },
        }),
        []
    )

    return {
        backgroundLayer,
        countriesHoverLayer,
        countryBondariesHoverableLayer,
        countriesLayer,
        boundariesLayer,
    }
}

export default useLayers
