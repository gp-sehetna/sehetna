import { scaleLinear } from "d3"

const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

class Colors {
    static strokeColor = "#fff"
    static strokeHoverWidth = 2
    static strokeWidth = 0.15
    static clickableContentFill = "#fff"
    static nonClickableContentFill = "#333333aa"
}

class GradientPalette extends Colors {
    steps: number[] = steps
    private colors: string[]

    oceanColor: string

    constructor(colors: string[], oceanColor: string) {
        super()
        this.colors = colors
        this.oceanColor = oceanColor
    }

    get colorScale() {
        return scaleLinear<string>().domain(this.steps).range(this.colors).unknown(this.oceanColor)
    }
}

const blue = {
    oceanColor: "#FAFAFA",
    colors: [
        "#C8F7F7",
        "#BEEAED",
        "#B3DEE4",
        "#A9D1DA",
        "#9FC4D0",
        "#94B7C7",
        "#8AABBD",
        "#809EB3",
        "#7591AA",
        "#6B84A0",
        "#617896",
        "#576B8C",
        "#4C5E83",
        "#425179",
        "#38456F",
        "#2D3866",
        "#232B5C",
        "#191E52",
        "#0E1249",
        "#04053F",
    ],
}

const green = {
    oceanColor: "#F5F7F2",
    colors: [
        "#F6F899",
        "#E9EE92",
        "#DCE38B",
        "#D0D983",
        "#C3CF7C",
        "#B6C475",
        "#A9BA6E",
        "#9CB067",
        "#90A55F",
        "#839B58",
        "#769151",
        "#69874A",
        "#5D7C42",
        "#50723B",
        "#436834",
        "#365D2D",
        "#295326",
        "#1D491E",
        "#103E17",
        "#033410",
    ],
}

const mix = {
    oceanColor: "#FFFFDE",
    colors: [
        "#FCFEA4",
        "#F2E45E",
        "#F7D242",
        "#FABF26",
        "#FB9B06",
        "#F47A18",
        "#ED6B24",
        "#E55C2F",
        "#D04544",
        "#B73556",
        "#9C2963",
        "#8E2467",
        "#801F6B",
        "#64146E",
        "#470B69",
        "#380B5F",
        "#290B54",
        "#1B0941",
        "#0D0829",
        "#000003",
    ],
}

export { Colors, GradientPalette, blue, green, mix }
