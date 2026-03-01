import { Colors, GradientPalette } from "@/shared/config/map-colors"
import { MAP_LAYER_IDS } from "@/shared/config/map-theme-config"
import {
    BackgroundLayerSpecification,
    FillLayerSpecification,
    LineLayerSpecification,
} from "maplibre-gl"
import { useMemo } from "react"

const useLayers = (theme: GradientPalette) => {
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

    const continentsFillLayer = useMemo<FillLayerSpecification>(
        () => ({
            id: MAP_LAYER_IDS.CONTINENTS,
            type: "fill",
            source: "countries",
            paint: {
                "fill-color": [
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
                ],
                "fill-opacity": 0.3,
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
            paint: {
                "fill-color": "rgba(255, 168, 70, 1)",
                "fill-opacity": 0.5,
                "fill-antialias": false,
            },
        }),
        []
    )

    const countriesIncomeLayer = useMemo<FillLayerSpecification>(
        () => ({
            id: MAP_LAYER_IDS.INCOME,
            type: "fill",
            source: "countries",
            paint: {
                "fill-color": [
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
                ],
                "fill-opacity": 0.3,
            },
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
        continentsFillLayer,
        countriesHoverLayer,
        countriesIncomeLayer,
        countryBondariesHoverableLayer,
        countriesLayer,
        boundariesLayer,
    }
}

export default useLayers
