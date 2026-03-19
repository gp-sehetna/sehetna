import { ForecastResponse } from "@/features/environment/prediction/prediction.dto"
import { PredictionService } from "@/features/environment/prediction/prediction.service"
import { AiForecastResponse } from "@/features/environment/prediction/prediction.types"
import {
    ForecastEnvironmentParamsSchema,
    GetPredictionsParamsSchema,
} from "@/features/environment/prediction/prediction.validation"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { externalApi } from "@/shared/api"
import { MainService } from "@/shared/db/main.service"
import { BadRequestException } from "@/shared/http/errors"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"
import { userProvider } from "@/shared/http/handlers/user.handler"
import { format } from "date-fns"
import { SearchParamsOption } from "ky"

export const GET = globalErrorHandler<ForecastResponse>(async (request) => {
    const params = request.nextUrl.searchParams
    const query = GetPredictionsParamsSchema.parse({
        modelId: params.get("model-id"),
        dataStart: params.get("data-start"),
        dataEnd: params.get("data-end"),
        country_code: params.get("iso"),
    })

    const mainService = await MainService.getInstance()
    const predictions = await mainService.predictionService.getPredictions(query)
    return [{ predictions }, `Forecasts retrieved for model ${query.modelId} successfully`]
})

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

// export const POST = globalErrorHandler(async (request) => {
//     const prediction = await request.json()
//     const mainService = await MainService.getInstance()
//     const _id = await mainService.predictionService.createPrediction(prediction)
//     return [undefined, "New Prediction created successfully"]
// })

/**
 * Read CSV file and insert historical data into db
 */
// export const POST = globalErrorHandler(
//     userProvider(async (request, user) => {
//         type Pred = Omit<IPrediction, "_id" | "createdAt" | "updatedAt">
//         const origin = new URL(request.url).origin
//         const response = await fetch(`${origin}/historical.json`)
//         const predictions = await response.json()

//         // Get all locations
//         const mainService = await MainService.getInstance()
//         const locations = await mainService.locationService.findAllLocations()
//         // get location id from p.country_code
//         const locationIdMap = new Map<string, Types.ObjectId>()
//         for (const location of locations) {
//             locationIdMap.set(location.code!, location._id)
//         }

//         const predictionsToInsert = predictions.map(
//             (p: any) =>
//                 ({
//                     user_id: user._id,
//                     location_id: locationIdMap.get(p.country_code),
//                     model_id: null,
//                     prediction_type: PredictionType.historical,
//                     base_date: new Date(p.date),
//                     health_outcomes: {
//                         respiratory_disease_rate: { point: Number(p.respiratory_disease_rate) },
//                         cardio_mortality_rate: { point: Number(p.cardio_mortality_rate) },
//                         vector_disease_risk_score: { point: Number(p.vector_disease_risk_score) },
//                         waterborne_disease_incidents: {
//                             point: Number(p.waterborne_disease_incidents),
//                         },
//                         heat_related_admissions: { point: Number(p.heat_related_admissions) },
//                     },
//                 }) as unknown as Pred
//         )

//         // Insert predictions
//         const inserted = await mainService.predictionService.insertMany(predictionsToInsert)
//         return [undefined, `Created ${inserted.length} prediction(s) successfully`]
//         // return [undefined, `Created prediction(s) successfully`]
//     })
// )
