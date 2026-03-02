import { ForecastResponse } from "@/features/environment/forecast/forecast.dto"
import { ForecastParamsSchema } from "@/features/environment/forecast/forecast.validation"
import { externalApi } from "@/shared/api"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"

export const POST = globalErrorHandler(
    userProvider(async (request, user) => {
        const data = await request.json()
        const origin = new URL(request.url).origin
        const { forecasts } = await externalApi
            .post<ForecastResponse>(`${origin}/ai/forecast`, { json: data })
            .json()

        const mainService = await MainService.getInstance()
        await mainService.forecastService.insertForecasts(forecasts, {
            userId: user._id,
            code: data.country_code,
            modelId: data.model_id,
        })
        return [
            undefined,
            `Generated forecasts for ${data.country_code} via ${data.model_id} successfully`,
        ]
    })
)

export const GET = globalErrorHandler(async (request) => {
    const params = request.nextUrl.searchParams
    const query = ForecastParamsSchema.parse({ modelId: params.get("model-id") })

    const mainService = await MainService.getInstance()
    const data = await mainService.forecastService.getForecasts(query.modelId)
    return [data, `Forecasts retrieved for model ${query.modelId} successfully`]
})
