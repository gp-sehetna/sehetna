import { getMockScenarioObservations } from "@/features/scenarios/scenario.mock"
import type {
    ScenarioObservationQueryParams,
    ScenarioObservationSortBy,
} from "@/features/scenarios/scenario.types"
import type { SortType } from "@/shared/db/types/pagination.type"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

const sortFields = new Set<ScenarioObservationSortBy>([
    "baseDate",
    "locationName",
    "temperatureCelsius",
    "precipitationMm",
    "heatWaveDays",
    "floodIndicator",
    "pm25Ugm3",
    "aqi",
    "healthcareAccessIndex",
    "foodSecurityIndex",
    "gdpPerCapitaUsd",
])

const parseQuery = (request: Request): ScenarioObservationQueryParams => {
    const searchParams = new URL(request.url).searchParams
    const sortBy = searchParams.get("sortBy") as ScenarioObservationSortBy | null
    const sortDirection = searchParams.get("sortDirection") as SortType | null
    const filtersParam = searchParams.get("filters")

    return {
        page: Number(searchParams.get("page") ?? 1),
        pageSize: Number(searchParams.get("pageSize") ?? 10),
        sortBy: sortBy && sortFields.has(sortBy) ? sortBy : "baseDate",
        sortDirection: sortDirection === "asc" ? "asc" : "desc",
        filters: filtersParam ? JSON.parse(filtersParam) : undefined,
    }
}

export const GET = globalErrorHandler(async (request) => {
    const observations = getMockScenarioObservations(parseQuery(request))

    return [{ data: observations }, "Scenario observations retrieved successfully"]
})
