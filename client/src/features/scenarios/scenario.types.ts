import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { IObservation } from "@/shared/db/model/observation.model"
import type { PaginationResult, SortType } from "@/shared/db/types/pagination.type"
import { ObjectId } from "mongoose"

type Scenario = Omit<IObservation, "location_id" | "prediction_id"> & {
    location_id: {
        _id: ObjectId
        name: string
    }
    prediction_id: {
        _id: ObjectId
        health_outcomes: Record<HealthOutcomesKeys, { point: number }>
    }
}

const SCENARIO_SORT_FIELDS = [
    "base_date",
    "location_id.name",
    "climate.temperature_celsius",
    "climate.precipitation_mm",
    "climate.heat_wave_days",
    "climate.flood_indicator",
    "air_quality.pm25_ugm3",
    "air_quality.aqi_pm",
    "health_indicators.gdp_per_capita_usd",
    "health_indicators.food_production_index",
    "health_indicators.undernourishment",
] as const

type ScenarioSortBy = (typeof SCENARIO_SORT_FIELDS)[number]

interface ScenarioFilters {
    dateRange?: { from?: string; to?: string }
    location?: string
    aqiThreshold?: number
}

interface ScenarioQueryParams {
    page: number
    pageSize: number
    sortBy: ScenarioSortBy
    sortDirection: SortType
    filters?: ScenarioFilters
}

type ScenarioListResult = PaginationResult<Scenario>
export { SCENARIO_SORT_FIELDS }
export type { Scenario, ScenarioListResult, ScenarioQueryParams, ScenarioFilters, ScenarioSortBy }
