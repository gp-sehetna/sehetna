import { UserWithoutPassword } from "@/features/auth/auth.types"
import { ForecastResult } from "@/features/environment/forecast/forecast.dto"
import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { PredictionType, type PredictionTypeEnum } from "@/shared/db/enums/prediction.enum"
import { IPrediction, PredictionMeta } from "@/shared/db/model/prediction.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"
import { LocationRepository } from "@/shared/db/repository/location.repository"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"
import { ForecastsSchema } from "./forecast.validation"

type ForecastInsertQuery = {
    modelId: string
    code: string
    userId: UserWithoutPassword["_id"]
}

export class ForecastService {
    constructor(
        private readonly predictionRepository: PredictionRepository,
        private readonly aiModelRepository: AiModelRepository,
        private readonly locationRepository: LocationRepository
    ) {}

    private static fromForecastResult(forecasts: ForecastResult, meta: PredictionMeta) {
        const firstOutcome = Object.values(forecasts)[0]
        const horizon = firstOutcome.point.length
        const today = new Date()

        return Array.from(
            { length: horizon },
            (_, index): IPrediction => ({
                user_id: meta.user_id,
                model_id: meta.model_id,
                prediction_type: PredictionType.forecasted,
                createdAt: today,
                features_snapshot: null,
                base_date: today,
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

    private static aggregate(forecasts: IPrediction[]): {
        prediction_type: PredictionTypeEnum
        health_outcomes: ForecastResult
        base_date: Date
    } {
        const base_date = forecasts[0].base_date
        const outcomeKeys = Object.keys(forecasts[0].health_outcomes ?? {}) as HealthOutcomesKeys[]

        const health_outcomes = Object.fromEntries(
            outcomeKeys.map((key) => [
                key,
                {
                    point: [] as number[],
                    lower: [] as number[],
                    upper: [] as number[],
                },
            ])
        ) as ForecastResult

        for (const prediction of forecasts) {
            for (const key of outcomeKeys) {
                const value = prediction.health_outcomes[key],
                    point = Number(value.point.toFixed(2)),
                    lower = value.lower != null ? Number(value.lower.toFixed(2)) : null,
                    upper = value.upper != null ? Number(value.upper.toFixed(2)) : null

                health_outcomes[key].point.push(point)
                health_outcomes[key].lower.push(lower)
                health_outcomes[key].upper.push(upper)
            }
        }

        return {
            prediction_type: PredictionType.forecasted,
            base_date,
            health_outcomes,
        }
    }

    insertForecasts = async (forecasts: ForecastResult, query: ForecastInsertQuery) => {
        const model = await this.aiModelRepository.findByType(query.modelId as AiModelEnum)
        const location = await this.locationRepository.findByCode(query.code)

        const predictions = ForecastService.fromForecastResult(forecasts, {
            user_id: query.userId,
            model_id: model._id,
            location_id: location._id,
        })

        await this.predictionRepository.insertMany(predictions)
    }

    getForecasts = async (model_type: AiModelEnum) => {
        const model = await this.aiModelRepository.findByType(model_type)
        const forecasts = await this.predictionRepository.findPredictions({
            model_id: model._id,
            prediction_type: PredictionType.forecasted,
        })

        return ForecastsSchema.parse({ forecasts: ForecastService.aggregate(forecasts) })
    }
}
