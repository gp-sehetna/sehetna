import {
    BackgroundLayerSpecification,
    FillLayerSpecification,
    LineLayerSpecification,
} from "maplibre-gl"
import { useMemo } from "react"
import { Colors, GradientPalette } from "@/shared/config/map-colors"

const useLayers = (theme: GradientPalette) => {
    const backgroundLayer = useMemo<BackgroundLayerSpecification>(
        () => ({
            id: "ocean",
            type: "background",
            paint: {
                "background-color": "#fff",
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
                "line-color": Colors.strokeColor,
                "line-translate-anchor": "map",
                "line-width": Colors.strokeHoverWidth,
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
                "fill-color": "#fff",
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
                "line-color": Colors.strokeColor,
                "line-translate-anchor": "map",
                "line-opacity": 1,
                "line-width": Colors.strokeWidth,
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
