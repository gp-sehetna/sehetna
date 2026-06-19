import type {
    ScenarioObservation,
    ScenarioObservationSortBy
} from "@/features/observations/Observation.types"
import { cn } from "@/lib/utils"
import {
    type Column
} from "@tanstack/react-table"
import type { CSSProperties } from "react"

export const getPinnedColumnStyles = (column: Column<ScenarioObservation>): CSSProperties => {
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

export const getPinnedColumnClassName = (column: Column<ScenarioObservation>) =>
    cn(
        column.getIsPinned() && "bg-background",
        column.getIsPinned() === "left" && column.getIsLastColumn("left") && "border-r",
        column.getIsPinned() === "right" && column.getIsFirstColumn("right") && "border-l"
    )

export const isScenarioSortBy = (id: string): id is ScenarioObservationSortBy =>
    [
        "baseDate",
        "locationName",
        "temperatureCelsius",
        "precipitationMm",
        "heatWaveDays",
        "floodIndicator",
        "pm25_ugm3",
        "aqi",
        "healthcareAccessIndex",
        "foodSecurityIndex",
        "gdpPerCapitaUsd",
    ].includes(id)

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
    observations: ScenarioObservation[]
): (string | number | null | undefined)[][] {
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
            observation.baseDate,
            observation.locationName,

            observation.healthOutcomes?.cardio_mortality_rate,
            observation.healthOutcomes?.heat_related_admissions,
            observation.healthOutcomes?.respiratory_disease_rate,
            observation.healthOutcomes?.vector_disease_risk_score,
            observation.healthOutcomes?.waterborne_disease_incidents,

            observation.climate.temperatureCelsius,
            observation.climate.precipitationMm,
            observation.climate.heatWaveDays,
            observation.climate.floodIndicator,

            observation.airQuality.pm25Ugm3,
            observation.airQuality.aqiPm,

            observation.healthIndicators.gdpPerCapitaUsd,
            observation.healthIndicators.foodProductionIndex,
            observation.healthIndicators.undernourishment,

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

export function observationsToCsv(
    observations: ScenarioObservation[]
) {
    const rows = scenarioObservationToCsvRows(observations)

    return rows
        .map((row) => row.map(escapeCsvCell).join(","))
        .join("\n")
}