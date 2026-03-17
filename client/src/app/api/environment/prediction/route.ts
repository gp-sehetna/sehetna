import { ForecastResponse } from "@/features/environment/prediction/prediction.dto"
import {
    ForecastEnvironmentParamsSchema,
    ForecastParamsSchema,
} from "@/features/environment/prediction/prediction.validation"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { externalApi } from "@/shared/api"
import { MainService } from "@/shared/db/main.service"
import { BadRequestException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"
import { format } from "date-fns"
import { SearchParamsOption } from "ky"
import { startSession } from "mongoose"

export const POST = globalErrorHandler(
    userProvider(async (request, user) => {
        const mainService = await MainService.getInstance()
        const session = await startSession()

        try {
            const origin = new URL(request.url).origin
            const params = request.nextUrl.searchParams
            const latestDate =
                await mainService.predictionService.getLastestPredictionDateForCountry(
                    params.get("iso")
                )

            if (!latestDate)
                throw new BadRequestException("No historical data found for this location")

            const { modelId, loc: location } = ForecastEnvironmentParamsSchema.parse({
                modelId: params.get("model-id"),
                date: format(latestDate, "yyyy-MM-dd"),
                coords: params.get("coords"),
                country_code: params.get("iso"),
            })

            /**
             * TODO: Make sure to insert the features in observations table
             * to avoid calling the API once again for the data that was already fetched.
             */
            const { lat, lng, iso } = location
            const coords = `${lat},${lng}`
            const searchParams: SearchParamsOption = { coords, iso, date: "2025-10-19" }
            const environmentData = await externalApi
                .get<IEnvironmentData | null>(`${origin}/api/environment/week`, { searchParams })
                .json()

            // Validate Environment Data and ensure non-null values.
            if (!environmentData || !environmentData.data?.length)
                throw new BadRequestException("No data found for this location")

            const forecastOrigin =
                process.env.NODE_ENV !== "production" ? "http://127.0.0.1:8000" : origin
            const forecastResponse = await externalApi
                .post<ForecastResponse>(`${forecastOrigin}/ai/forecast`, {
                    json: { model_id: modelId, ...environmentData },
                })
                .json()

            await mainService.predictionService.insertForecasts(
                forecastResponse,
                {
                    userId: user._id,
                    code: location.iso,
                    modelId,
                },
                session
            )

            return [
                undefined,
                `Generated forecasts for ${location.iso} via ${modelId} successfully`,
            ]
        } catch (error) {
            await session.abortTransaction()
            throw error
        } finally {
            session.endSession()
        }
    })
)

export const GET = globalErrorHandler(async (request) => {
    const params = request.nextUrl.searchParams
    const query = ForecastParamsSchema.parse({ modelId: params.get("model-id") })

    const mainService = await MainService.getInstance()
    const data = await mainService.predictionService.getForecasts(query.modelId)
    return [data, `Forecasts retrieved for model ${query.modelId} successfully`]
})
