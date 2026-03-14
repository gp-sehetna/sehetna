import { ForecastResponse } from "@/features/environment/forecast/forecast.dto"
import {
    ForecastEnvironmentParamsSchema,
    ForecastParamsSchema,
} from "@/features/environment/forecast/forecast.validation"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { externalApi } from "@/shared/api"
import { MainService } from "@/shared/db/main.service"
import { BadRequestException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"
import { SearchParamsOption } from "ky"

export const POST = globalErrorHandler(
    userProvider(async (request, user) => {
        const origin = new URL(request.url).origin

        const params = request.nextUrl.searchParams

        const { modelId, loc: location } = ForecastEnvironmentParamsSchema.parse({
            modelId: params.get("model-id"),
            date: null,
            coords: params.get("coords"),
            country_code: params.get("iso"),
        })

        const { lat, lng, iso } = location
        const coords = `${lat},${lng}`
        const searchParams: SearchParamsOption = { coords, iso }
        const environmentData = await externalApi
            .get<IEnvironmentData | null>(`${origin}/api/environment/week`, { searchParams })
            .json()

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data?.length)
            throw new BadRequestException("No data found for this location")

        const forecastOrigin =
            process.env.NODE_ENV !== "production" ? "http://127.0.0.1:8000" : origin
        const { forecasts } = await externalApi
            .post<ForecastResponse>(`${forecastOrigin}/ai/forecast`, {
                json: { model_id: modelId, ...environmentData },
            })
            .json()

        const mainService = await MainService.getInstance()
        await mainService.forecastService.insertForecasts(forecasts, {
            userId: user._id,
            code: environmentData.country_code,
            modelId,
        })
        return [
            undefined,
            `Generated forecasts for ${environmentData.country_code} via ${modelId} successfully`,
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
