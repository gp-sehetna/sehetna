import { EnvironmentDataSchema } from "@/features/environment/week/week.validation"
import { getMockScenarioObservations as getMockScenarios } from "@/features/scenarios/scenario.mock"
import type {
    ScenarioObservationQueryParams,
    ScenarioObservationSortBy,
} from "@/features/scenarios/scenario.types"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { MainService } from "@/shared/db/main.service"
import type { SortType } from "@/shared/db/types/pagination.type"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"

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
    const scenarios = getMockScenarios(parseQuery(request))

    return [{ data: scenarios }, "Scenarios retrieved successfully"]
})

export const POST = globalErrorHandler(
    userProvider(async (request, user) => {
        const json = await request.json()
        const environment = EnvironmentDataSchema.parse(json.environment)
        // TODO: add validation later
        const prediction = json.prediction as IHealthOutcomes

        const mainService = await MainService.getInstance()
        await mainService.predictionService.createScenario(environment, prediction, user._id)

        return [undefined, "Scenario created successfully"]
    })
)
// post /api/scenarios {"environment": {}, "prediction": {}}
