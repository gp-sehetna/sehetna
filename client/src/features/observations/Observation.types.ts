import { IObservationPopulated } from "@/shared/db/model/observation.model"
import type { PaginationResult, SortType } from "@/shared/db/types/pagination.type"

type FloodIndicator = 0 | 1

interface ScenarioObservation extends IObservationPopulated {}

type ScenarioObservationSortBy =
    | "base_date"
    | "location_id.name"
    | "climate.temperature_celsius"
    | "climate.precipitation_mm"
    | "climate.heat_wave_days"
    | "climate.flood_indicator"
    | "air_quality.pm25_ugm3"
    | "air_quality.aqi_pm"
    | "health_indicators.gdp_per_capita_usd"
    | "health_indicators.food_production_index"
    | "health_indicators.undernourishment"

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
    ObservationListResult,
    ObservationQueryParams,
    ScenarioObservation,
    ScenarioObservationFilters,
    ScenarioObservationSortBy,
}
