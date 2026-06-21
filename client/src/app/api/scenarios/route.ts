import { EnvironmentDataSchema } from "@/features/environment/week/week.validation"
import type { ScenarioQueryParams, ScenarioSortBy } from "@/features/observations/Observation.types"
import { SCENARIO_SORT_FIELDS } from "@/features/observations/Observation.types"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { MainService } from "@/shared/db/main.service"
import type { SortType } from "@/shared/db/types/pagination.type"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"

const sortFields = new Set<ScenarioSortBy>(SCENARIO_SORT_FIELDS)

const parseQuery = (request: Request): ScenarioQueryParams => {
    const searchParams = new URL(request.url).searchParams
    const sortBy = searchParams.get("sortBy") as ScenarioSortBy | null
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
