import { UserWithoutPassword } from "@/features/auth/auth.types"
import { ForecastResponse, ForecastResult } from "@/features/environment/prediction/prediction.dto"
import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { PredictionType } from "@/shared/db/enums/prediction.enum"
import { IPrediction, PredictionMeta } from "@/shared/db/model/prediction.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"
import { LocationRepository } from "@/shared/db/repository/location.repository"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"
import { ClientSession } from "mongoose"
import { ForecastsSchema } from "./prediction.validation"

type ForecastInsertQuery = {
    modelId: string
    code: string
    userId: UserWithoutPassword["_id"]
}

export class PredictionService {
    constructor(
        private readonly predictionRepository: PredictionRepository,
        private readonly aiModelRepository: AiModelRepository,
        private readonly locationRepository: LocationRepository
    ) {}

    private static fromForecastResult = (
        { forecasts, horizon }: ForecastResponse,
        meta: PredictionMeta
    ) => {
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

    private static aggregate = (predictions: IPrediction[]) => {
        const base_date = predictions[0].base_date
        const outcomeKeys = Object.keys(
            predictions[0].health_outcomes ?? {}
        ) as HealthOutcomesKeys[]

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

        for (const prediction of predictions) {
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

    insertForecasts = async (
        { forecasts, horizon, predictions }: ForecastResponse,
        query: ForecastInsertQuery,
        session: ClientSession
    ) => {
        const model = await this.aiModelRepository.findByType(query.modelId as AiModelEnum)
        const location = await this.locationRepository.findByCode(query.code)

        await this.predictionRepository.deleteAllForecasted(
            { model_id: model._id, location_id: location._id },
            session
        )

        const predictionsToBeInserted = PredictionService.fromForecastResult(
            { forecasts, horizon, predictions },
            {
                user_id: query.userId,
                model_id: model._id,
                location_id: location._id,
            }
        )

        await this.predictionRepository.insertMany(predictionsToBeInserted, session)
    }

    getLastestPredictionDateForCountry = async (iso: string | null) => {
        if (!iso) return null
        const location = await this.locationRepository.findByCode(iso)
        const predictions = await this.predictionRepository.findPredictions({
            location_id: location._id,
            prediction_type: { $ne: PredictionType.forecasted },
        })

        return predictions.length ? predictions[0].base_date : null
    }

    getForecasts = async (model_type: AiModelEnum) => {
        const model = await this.aiModelRepository.findByType(model_type)
        const forecasts = await this.predictionRepository.findPredictions({
            model_id: model._id,
            prediction_type: PredictionType.forecasted,
        })

        return ForecastsSchema.parse({ forecasts: PredictionService.aggregate(forecasts) })
    }

    insertMany = async (predictions: IPrediction[]) => {
        return await this.predictionRepository.insertMany(predictions)
    }

    createPrediction = async (prediction: IPrediction) => {
        return await this.predictionRepository.create(prediction)
    }

    findAllPredictions = async () => {
        return await this.predictionRepository.find()
    }
}
