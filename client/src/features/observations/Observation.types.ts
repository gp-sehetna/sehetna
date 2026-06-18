import type { HealthOutcomePoints, IHealthOutcomes } from "@/shared/config/health-outcomes"
import type { PaginationResult, SortType } from "@/shared/db/types/pagination.type"

type FloodIndicator = 0 | 1

interface ScenarioObservation {
    id: string
    baseDate: string,
    locationName: string | null
    healthOutcomes: HealthOutcomePoints | null

    climate: {
        temperatureCelsius: number | null
        precipitationMm: number | null
        heatWaveDays: number | null
        floodIndicator: FloodIndicator | null
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

interface ObservationQueryParams {
    page: number
    pageSize: number
    sortBy: ScenarioObservationSortBy
    sortDirection: SortType
    filters?: ScenarioObservationFilters
}

type ObservationListResult = PaginationResult<ScenarioObservation>

export type {
    FloodIndicator,
    ScenarioObservation,
    ScenarioObservationFilters,
    ObservationListResult,
    ObservationQueryParams,
    ScenarioObservationSortBy,
}
