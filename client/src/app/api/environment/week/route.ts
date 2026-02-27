import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { WeekEnvironmentParamsSchema } from "@/features/environment/week/week.validation"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const GET = globalErrorHandler<IEnvironmentData>(async (request) => {
    const params = request.nextUrl.searchParams

    const query = WeekEnvironmentParamsSchema.parse({
        coords: params.get("coords"),
        iso: params.get("iso"),
        date: params.get("date"),
        weeks: params.get("weeks"),
    })

    const mainService = await MainService.getInstance()
    const data = await mainService.weekService.getWeeklyEnvironmentData(query)

    return [data, "Weekly environment data fetched successfully"]
})
