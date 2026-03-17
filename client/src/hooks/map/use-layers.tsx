import { COUNTRIES_SOURCE } from "@/shared/config/map"
import { Colors, GradientPalette } from "@/shared/config/map-colors"
import { MapThemeId } from "@/shared/config/map-theme-config"
import {
    BackgroundLayerSpecification,
    ExpressionSpecification,
    FillLayerSpecification,
    LineLayerSpecification,
} from "maplibre-gl"
import { useMemo } from "react"
import usePredictions from "./use-predictions"
import { useMapStore } from "@/stores/map/use-map"

// const countriesFillLayer: FillLayerSpecification = {
//     id: "land",
//     type: "fill",
//     source: COUNTRIES_SOURCE,
//     filter: ["all"],
//     paint: {
//         "fill-color": "rgba(255, 168, 70, 1)",
//         "fill-opacity": 0.5,
//         "fill-antialias": false,
//     },
// }

const countriesHoverFillLayer: FillLayerSpecification = {
    id: "land-hover",
    type: "fill",
    source: COUNTRIES_SOURCE,
    paint: {
        "fill-color": "#fff",
        "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.3, 0],
    },
}

const countriesHoverBoundariesLayer: LineLayerSpecification = {
    id: "land-hover-boundaries",
    type: "line",
    source: COUNTRIES_SOURCE,
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
}

const countriesBoundariesLayer: LineLayerSpecification = {
    id: "land-boundaries",
    type: "line",
    source: COUNTRIES_SOURCE,
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
}

const continentsFillColorExpression: ExpressionSpecification = [
    "match",
    ["get", "continent"],
    "Africa",
    "#f4a261",
    "Asia",
    "#e76f51",
    "Europe",
    "#457b9d",
    "North America",
    "#2a9d8f",
    "South America",
    "#8ab17d",
    "Oceania",
    "#9b5de5",
    "Antarctica",
    "#bdbdbd",
    "#cccccc",
]

const incomeFillColorExpression: ExpressionSpecification = [
    "match",
    ["get", "incomeGroup"],
    "1. High income: OECD",
    "#1b4332",
    "2. High income: nonOECD",
    "#2d6a4f",
    "3. Upper middle income",
    "#40916c",
    "4. Lower middle income",
    "#74c69d",
    "5. Low income",
    "#d8f3dc",
    "#ccc",
]

const useLayers = (theme: GradientPalette, activeThemeIds: readonly MapThemeId[]) => {
    const {predictions} = usePredictions()
    
    const countriesFillLayer: FillLayerSpecification = {
        id: "land",
        type: "fill",
        source: COUNTRIES_SOURCE,
        paint: {
            "fill-color": [
                "interpolate",
                ["linear"],
                ["feature-state", "prediction"],

                theme.domain[0],
                theme.colorScale(theme.domain[0]),
                theme.domain[1],
                theme.colorScale(theme.domain[1]),
            ],
            
            "fill-antialias": false,
        },
    }

    const backgroundLayer = useMemo<BackgroundLayerSpecification>(
        () => ({
            id: "ocean",
            type: "background",
            paint: {
                "background-color": theme.oceanColor,
                "background-opacity": 1,
            },
        }),
        [theme.oceanColor]
    )

    const activeThemes = useMemo(() => new Set(activeThemeIds), [activeThemeIds])

    const layers = useMemo(() => {
        const continentsLayer: FillLayerSpecification = {
            id: "continents",
            type: "fill",
            source: COUNTRIES_SOURCE,
            layout: {
                visibility: activeThemes.has("continents") ? "visible" : "none",
            },
            paint: {
                "fill-color": continentsFillColorExpression,
                "fill-opacity": 0.3,
            },
        }

        const incomeLayer: FillLayerSpecification = {
            id: "land-income",
            type: "fill",
            source: COUNTRIES_SOURCE,
            layout: {
                visibility: activeThemes.has("land-income") ? "visible" : "none",
            },
            paint: {
                "fill-color": incomeFillColorExpression,
                "fill-opacity": 0.3,
            },
        }

        return [
            countriesFillLayer,
            continentsLayer,
            incomeLayer,
            countriesHoverFillLayer,
            countriesHoverBoundariesLayer,
            countriesBoundariesLayer,
        ]
    }, [activeThemes])

    return {
        backgroundLayer,
        layers,
    }
}

export default useLayers
