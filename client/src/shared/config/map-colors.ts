import { buildSteps, spreadOverDomain } from "@/lib/utils/array"
import { extent, scaleLinear } from "d3"

const start = 0,
    end = 100,
    step = 5

const steps = buildSteps(start, end, step)

class Colors {
    static strokeColor = "#fff"
    static strokeHoverWidth = 2
    static strokeWidth = 0.15
    static clickableContentFill = "#fff"
    static nonClickableContentFill = "#333333aa"
}

class GradientPalette extends Colors {
    steps: number[] = steps
    colors: string[]

    oceanColor: string

    constructor(colors: string[], oceanColor: string) {
        super()
        this.colors = colors
        this.oceanColor = oceanColor
    }

    get colorScale() {
        return scaleLinear<string>().domain(this.steps).range(this.colors).unknown(this.oceanColor)
    }

    get domain(): [number, number] {
        return extent(this.colorScale.domain()) as [number, number]
    }

    get gradientCSS(): string {
        const spread = spreadOverDomain(this.domain, 20)
        const gradientStops = spread.map(
            (value, index, arr) => `${this.colorScale(value)} ${(index / (arr.length - 1)) * 100}%`
        )

        return `linear-gradient(to right, ${gradientStops.join(", ")})`
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

const red = {
    oceanColor: "#fefae0",
    colors: [
        "#FFF477",
        "#FFE971",
        "#FFDE6A",
        "#FFD364",
        "#FFC85E",
        "#FFBD58",
        "#FFB251",
        "#FFA74B",
        "#FF9C45",
        "#FF913F",
        "#FF8538",
        "#FF7A32",
        "#FF6F2C",
        "#FF6426",
        "#FF591F",
        "#FF4E19",
        "#FF4313",
        "#FF380D",
        "#FF2D06",
        "#FF2200",
    ],
}

const darkBlue = {
    oceanColor: "#fefae0",
    colors: [
        "#BFCAFF",
        "#B6BFF9",
        "#ACB5F2",
        "#A3AAEC",
        "#999FE5",
        "#9095DF",
        "#868AD8",
        "#7D80D2",
        "#7375CC",
        "#6A6AC5",
        "#6060BF",
        "#5755B8",
        "#4D4AB2",
        "#4440AC",
        "#3A35A5",
        "#312B9F",
        "#272098",
        "#1E1592",
        "#140B8B",
        "#0B0085",
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

export { blue, Colors, darkBlue, GradientPalette, green, mix, red }
