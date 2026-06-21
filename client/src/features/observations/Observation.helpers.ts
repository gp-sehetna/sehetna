import {
    SCENARIO_SORT_FIELDS,
    type Scenario,
    type ScenarioSortBy,
} from "@/features/observations/Observation.types"
import { cn } from "@/lib/utils"
import { type Column } from "@tanstack/react-table"
import type { CSSProperties } from "react"

export const getPinnedColumnStyles = (column: Column<Scenario>): CSSProperties => {
    const isPinned = column.getIsPinned()

    if (!isPinned) return {}
    return {
        left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
        right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
        position: "sticky",
        width: column.getSize(),
        zIndex: 20,
    }
}

export const getPinnedColumnClassName = (column: Column<Scenario>) =>
    cn(
        column.getIsPinned() && "bg-background",
        column.getIsPinned() === "left" && column.getIsLastColumn("left") && "border-r",
        column.getIsPinned() === "right" && column.getIsFirstColumn("right") && "border-l"
    )

export const isScenarioSortBy = (id: string): id is ScenarioSortBy => {
    return SCENARIO_SORT_FIELDS.includes(id as ScenarioSortBy)
}

export const downloadCsv = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
}

export function scenarioObservationToCsvRows(
    observations: Scenario[]
): (string | number | Date | null | undefined)[][] {
    return [
        [
            "Base Date",
            "Location",
            "Cardio Mortality Rate",
            "Heat Related Admissions",
            "Respiratory Disease Rate",
            "Vector Disease Risk Score",
            "Waterborne Disease Incidents",
            "Temperature (°C)",
            "Precipitation (mm)",
            "Heat Wave Days",
            "Flood Indicator",
            "PM2.5 (ug/m³)",
            "AQI",
            "GDP Per Capita (USD)",
            "Food Production Index",
            "Undernourishment",
            "Note",
        ],

        ...observations.map((observation) => [
            observation.base_date,
            observation.location_id.name,

            observation.prediction_id.health_outcomes?.cardio_mortality_rate.point,
            observation.prediction_id.health_outcomes?.heat_related_admissions.point,
            observation.prediction_id.health_outcomes?.respiratory_disease_rate.point,
            observation.prediction_id.health_outcomes?.vector_disease_risk_score.point,
            observation.prediction_id.health_outcomes?.waterborne_disease_incidents.point,

            observation.climate.temperature_celsius,
            observation.climate.precipitation_mm,
            observation.climate.heat_wave_days,
            observation.climate.flood_indicator,

            observation.air_quality.pm25_ugm3,
            observation.air_quality.aqi_pm,

            observation.health_indicators.gdp_per_capita_usd,
            observation.health_indicators.food_production_index,

            observation.note,
        ]),
    ]
}
const escapeCsvCell = (value: unknown) => {
    if (value == null) return ""

    const cell = String(value)
    if (!/[",\n]/.test(cell)) return cell

    return `"${cell.replaceAll('"', '""')}"`
}

export function observationsToCsv(observations: Scenario[]) {
    const rows = scenarioObservationToCsvRows(observations)

    return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\n")
}
