import { COUNTRIES_SOURCE } from "@/shared/config/map"
import { Colors, GradientPalette } from "@/shared/config/map-colors"
import {
    MAP_THEME_DEFINITIONS,
    MapThemeColors,
    MapThemeDefinition,
    MapThemeId,
} from "@/shared/config/map-theme-config"
import {
    BackgroundLayerSpecification,
    ExpressionSpecification,
    FillLayerSpecification,
    LineLayerSpecification,
} from "maplibre-gl"
import { useMemo } from "react"
import usePredictions from "./use-predictions"

const THEME_PROPERTY_BY_ID: Record<MapThemeId, string> = {
    continents: "continent",
    "land-income": "incomeGroup",
}

const STATIC_LAYERS: readonly (FillLayerSpecification | LineLayerSpecification)[] = [
    {
        id: "land-hover",
        type: "fill",
        source: COUNTRIES_SOURCE,
        paint: {
            "fill-color": "#fff",
            "fill-opacity": ["case", ["boolean", ["feature-state", "hover"], false], 0.3, 0],
        },
    },
    {
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
    },
    {
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
    },
] as const

const createMatchExpression = (
    property: string,
    colors: MapThemeColors,
    fallbackColor: string
): ExpressionSpecification => {
    const colorStops = Object.entries(colors)
        .filter(([key]) => key !== "default")
        .flatMap(([key, color]) => [key, color])

    return [
        "match",
        ["get", property],
        ...colorStops,
        colors.default ?? fallbackColor,
    ] as unknown as ExpressionSpecification
}

const createPredictionFillLayer = (theme: GradientPalette): FillLayerSpecification => ({
    id: "land",
    type: "fill",
    source: COUNTRIES_SOURCE,
    paint: {
        "fill-color": ["feature-state", "color"],
        "fill-antialias": false,
    },
})

const createThemeFillLayer = (
    mapTheme: MapThemeDefinition,
    isVisible: boolean
): FillLayerSpecification => ({
    id: mapTheme.id,
    type: "fill",
    source: COUNTRIES_SOURCE,
    layout: {
        visibility: isVisible ? "visible" : "none",
    },
    paint: {
        "fill-color": createMatchExpression(
            THEME_PROPERTY_BY_ID[mapTheme.id],
            mapTheme.colors,
            "#fff"
        ),
    },
})

const createBackgroundLayer = (theme: GradientPalette): BackgroundLayerSpecification => ({
    id: "ocean",
    type: "background",
    paint: {
        "background-color": theme.oceanColor,
        "background-opacity": 1,
    },
})

const useLayers = (theme: GradientPalette, activeThemeIds: readonly MapThemeId[]) => {
    const activeThemes = useMemo(() => new Set(activeThemeIds), [activeThemeIds])

    const backgroundLayer = useMemo<BackgroundLayerSpecification>(
        () => createBackgroundLayer(theme),
        [theme]
    )

    const countriesFillLayer = useMemo<FillLayerSpecification>(
        () => createPredictionFillLayer(theme),
        [theme]
    )

    const themeLayers = useMemo<FillLayerSpecification[]>(
        () =>
            MAP_THEME_DEFINITIONS.map((mapTheme) =>
                createThemeFillLayer(mapTheme, activeThemes.has(mapTheme.id))
            ),
        [activeThemes]
    )

    const layers = useMemo(() => [countriesFillLayer, ...STATIC_LAYERS], [countriesFillLayer])

    return {
        backgroundLayer,
        layers,
    }
}

export default useLayers
