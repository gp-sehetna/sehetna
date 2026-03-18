import { ForecastResponse } from "@/features/environment/prediction/prediction.dto"
import { PredictionService } from "@/features/environment/prediction/prediction.service"
import { AiForecastResponse } from "@/features/environment/prediction/prediction.types"
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

// DON'T CHANGE THIS DATE
export const POST = globalErrorHandler(
    userProvider(async (request, user) => {
        const mainService = await MainService.getInstance()
        const origin = new URL(request.url).origin
        const params = request.nextUrl.searchParams

        const iso = params.get("iso")
        if (!iso) throw new BadRequestException("Country code is required.")

        const latestDate =
            (await mainService.predictionService.getLatestPredictionDateForCountry(iso)) ??
            PredictionService.LATEST_HISTORICAL_DATE

        const {
            modelId,
            loc,
            date: predictionsStartDate,
            weeks,
            endDate: forecastsStartDate,
        } = ForecastEnvironmentParamsSchema.parse({
            modelId: params.get("model-id"),
            date: format(latestDate, "yyyy-MM-dd"),
            coords: params.get("coords"),
            country_code: iso,
        })

        // TODO: Make sure to insert the features in observations table to avoid calling the API once again for the data that was already fetched.
        /**
         * Currently: Environment Data is fetched from LATEST_HISTORICAL_DATE to the start of today's week date.
         * What we need is only fetch environment data from the latest prediction date till today (The Gap)
         * The rest are taken from the observation collection.
         * So now we have the environment data we need to generate the forecasts.
         * Input to forecast = environment data starting from LATEST_HISTORICAL_DATE till the start of today's week where
         *  - (LATEST_HISTORICAL_DATE till the latest prediction date) = data already saved in observations collection.
         *  - (the latest prediction date till today) = data that needs to be fetched from the API.
         */
        const coords = `${loc.lat},${loc.lng}`
        const searchParams: SearchParamsOption = {
            iso,
            date: format(PredictionService.LATEST_HISTORICAL_DATE, "yyyy-MM-dd"),
            // ? Predict till the last week and the endpoint should start forecasting starting from this week even if this is the last day of the week.
            weeks: weeks - 1,
            coords,
        }
        const environmentData = await externalApi
            .get<IEnvironmentData | null>(`${origin}/api/environment/week`, { searchParams })
            .json()

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data?.length)
            throw new BadRequestException("No data found for this location")

        const forecastOrigin =
            process.env.NODE_ENV !== "production" ? "http://127.0.0.1:8000" : origin
        const forecastResponse = await externalApi
            .post<AiForecastResponse>(`${forecastOrigin}/ai/forecast`, {
                json: { model_id: modelId, ...environmentData },
            })
            .json()

        await mainService.predictionService.insertPredictions(
            forecastResponse,
            user._id,
            { predictions: predictionsStartDate, forecasts: forecastsStartDate },
            { country_code: iso, modelId }
        )

        return [undefined, `Generated forecasts for ${iso} via ${modelId} successfully`]
    })
)

export const GET = globalErrorHandler<ForecastResponse>(async (request) => {
    const params = request.nextUrl.searchParams
    const query = ForecastParamsSchema.parse({
        modelId: params.get("model-id"),
        country_code: params.get("iso"),
    })

    const mainService = await MainService.getInstance()
    const predictions = await mainService.predictionService.getPredictionsByLocation(query)
    return [{ predictions }, `Forecasts retrieved for model ${query.modelId} successfully`]
})
