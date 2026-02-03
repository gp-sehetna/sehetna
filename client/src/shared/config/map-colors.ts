import * as d3 from "d3"

const baseColors = [
    "#FCFEA4",
    "#F2E45E",
    "#FABF26",
    "#FB9B06",
    "#F47A18",
    "#E55C2F",
    "#D04544",
    "#B73556",
    "#9C2963",
    "#801F6B",
    "#64146E",
    "#470B69",
    "#290B54",
    "#0D0829",
    "#000003",
]

const steps = d3.range(0, 101, 5)

// Expand colors from 15 → 20 using interpolation
const interpolatedColors = d3
    .range(steps.length)
    .map((i) =>
        d3.interpolateRgb(baseColors[0], baseColors[baseColors.length - 1])(i / (steps.length - 1))
    )

// Linear scale
const colorScale = d3
    .scaleLinear<string>()
    .domain(steps)
    .range(interpolatedColors)
    .interpolate(d3.interpolateRgb)

export const colorScheme = { steps, colors: interpolatedColors, scale: colorScale }
