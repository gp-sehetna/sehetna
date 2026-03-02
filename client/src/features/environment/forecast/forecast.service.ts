import { IPrediction, PredictionMeta } from "@/shared/db/model/prediction.model"
import { IUser } from "@/shared/db/model/user.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"
import { LocationRepository } from "@/shared/db/repository/location.repository"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"
import { ForecastResult } from "./forecast.dto"

export class ForecastService {
    constructor(
        private readonly predictionRepository: PredictionRepository,
        private readonly aiModelRepository: AiModelRepository,
        private readonly locationRepository: LocationRepository
    ) {}

    static fromForecastResult(forecasts: ForecastResult, meta: PredictionMeta) {
        const firstOutcome = Object.values(forecasts)[0]
        const horizon = firstOutcome.point.length

        return Array.from(
            { length: horizon },
            (_, index): IPrediction => ({
                user_id: meta.user_id,
                model_id: meta.model_id,
                location_id: meta.location_id,
                health_outcomes: Object.fromEntries(
                    Object.entries(forecasts).map(([key, value]) => [
                        key,
                        {
                            point: value.point[index],
                            lower: value.lower?.[index] ?? null,
                            upper: value.upper?.[index] ?? null,
                        },
                    ])
                ) as IPrediction["health_outcomes"],
            })
        )
    }

    async insertForecasts(modelId: string, code: string, forecasts: ForecastResult, user: IUser) {
        const model = await this.aiModelRepository.findById(modelId)
        const location = await this.locationRepository.findByCode(code)

        const predictions = ForecastService.fromForecastResult(forecasts, {
            user_id: user._id,
            model_id: model._id,
            location_id: location._id,
        })

        return await this.predictionRepository.insertPredictions(predictions)
    }
}
