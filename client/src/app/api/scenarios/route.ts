import { EnvironmentDataSchema } from "@/features/environment/week/week.validation"
import type {
    ObservationQueryParams,
    ScenarioObservationSortBy,
} from "@/features/observations/Observation.types"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { MainService } from "@/shared/db/main.service"
import type { SortType } from "@/shared/db/types/pagination.type"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"

const sortFields = new Set<ScenarioObservationSortBy>([
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
])

const parseQuery = (request: Request): ObservationQueryParams => {
    const searchParams = new URL(request.url).searchParams
    const sortBy = searchParams.get("sortBy") as ScenarioObservationSortBy | null
    const sortDirection = searchParams.get("sortDirection") as SortType | null
    const filtersParam = searchParams.get("filters")

    return {
        page: Number(searchParams.get("page") ?? 1),
        pageSize: Number(searchParams.get("pageSize") ?? 10),
        sortBy: sortBy && sortFields.has(sortBy) ? sortBy : "base_date",
        sortDirection: sortDirection === "asc" ? "asc" : "desc",
        filters: filtersParam ? JSON.parse(filtersParam) : undefined,
    }
}

export const GET = globalErrorHandler(async (request) => {
    const mainService = await MainService.getInstance()
    const query = parseQuery(request)
    const scenarios = await mainService.observationService.getObservations(query)
    return [{ data: { data: scenarios } }, "Scenarios retrieved successfully"]
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
