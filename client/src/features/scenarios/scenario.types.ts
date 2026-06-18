import type { IHealthOutcomes } from "@/shared/config/health-outcomes"
import type { PaginationResult, SortType } from "@/shared/db/types/pagination.type"

type FloodIndicator = "low" | "moderate" | "high"

interface ScenarioObservation {
    id: string
    baseDate: string,
    locationName: string | null   // 👈 ADD THIS
    healthOutcomes: any // (or proper type)

    climate: {
        temperatureCelsius: number | null
        precipitationMm: number | null
        heatWaveDays: number | null
        floodIndicator: FloodIndicator | number | null
    }
    airQuality: {
        pm25Ugm3: number | null
        aqiPm: number
    }
    healthIndicators: {
        undernourishment: number | null | undefined
        foodProductionIndex: number | null | undefined
        gdpPerCapitaUsd: number | null
    }
    note?: string | null
}

type ScenarioObservationSortBy =
    | "baseDate"
    | "locationName"
    | "temperatureCelsius"
    | "precipitationMm"
    | "heatWaveDays"
    | "floodIndicator"
    | "pm25Ugm3"
    | "aqi"
    | "healthcareAccessIndex"
    | "foodSecurityIndex"
    | "gdpPerCapitaUsd"

interface ScenarioObservationFilters {
    dateRange?: { from?: string; to?: string }
    location?: string
    aqiThreshold?: number
}

interface ScenarioObservationQueryParams {
    page: number
    pageSize: number
    sortBy: ScenarioObservationSortBy
    sortDirection: SortType
    filters?: ScenarioObservationFilters
}

type ScenarioObservationListResult = PaginationResult<ScenarioObservation>

export type {
    FloodIndicator,
    ScenarioObservation,
    ScenarioObservationFilters,
    ScenarioObservationListResult,
    ScenarioObservationQueryParams,
    ScenarioObservationSortBy,
}
