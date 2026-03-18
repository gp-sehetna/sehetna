import { ForecastParams, Forecasts } from "@/features/environment/prediction/prediction.dto"
import { AiForecastResponse } from "@/features/environment/prediction/prediction.types"
import { PredictionType } from "@/shared/db/enums/prediction.enum"
import {
    IHealthOutcomesWithIntervals,
    IPrediction,
    PredictionForeignKeys,
} from "@/shared/db/model/prediction.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"
import { LocationRepository } from "@/shared/db/repository/location.repository"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"
import { addWeeks, differenceInWeeks, startOfWeek } from "date-fns"
import { startSession, Types } from "mongoose"

interface TimelineRange {
    predictions: Date
    forecasts: Date
}

export class PredictionService {
    public static LATEST_HISTORICAL_DATE = addWeeks(startOfWeek(new Date("2025-10-19")), 1)
    constructor(
        private readonly predictionRepository: PredictionRepository,
        private readonly aiModelRepository: AiModelRepository,
        private readonly locationRepository: LocationRepository
    ) {}

    getLatestPredictionDateForCountry = async (iso: string) => {
        const location = await this.locationRepository.findByCode(iso)
        return await this.getLatestPredictionDateForLocation(location._id)
    }

    private getLatestPredictionDateForLocation = async (locationId: Types.ObjectId) => {
        const predictions = await this.predictionRepository.findPredictions({
            location_id: locationId,
            prediction_type: PredictionType.predicted,
        })

        return predictions.length ? predictions[predictions.length - 1].base_date : null
    }

    private validatePredictionDateDifference = async (
        locationId: Types.ObjectId,
        horizon: number
    ) => {
        const date = await this.getLatestPredictionDateForLocation(locationId)
        return (
            differenceInWeeks(new Date(), date ?? PredictionService.LATEST_HISTORICAL_DATE) >=
            horizon
        )
    }

    private buildTimeline = async (
        response: AiForecastResponse,
        timeline: TimelineRange,
        locationId: Types.ObjectId,
        meta: PredictionForeignKeys
    ) => {
        const forecasts = PredictionService.mapForecasts(response, timeline.forecasts, meta)

        const withPredictions = await this.validatePredictionDateDifference(
            locationId,
            response.horizon
        )
        if (!withPredictions) return forecasts

        const predictions = PredictionService.mapPredictions(
            response.environment,
            timeline.predictions,
            meta
        )

        return [...predictions, ...forecasts]
    }

    insertPredictions = async (
        response: AiForecastResponse,
        userId: Types.ObjectId,
        timeline: TimelineRange,
        query: ForecastParams
    ) => {
        const session = await startSession()
        try {
            const model = await this.aiModelRepository.findByType(query.modelId)
            const location = await this.locationRepository.findByCode(query.country_code)

            const records = await this.buildTimeline(response, timeline, location._id, {
                user_id: userId,
                model_id: model._id,
                location_id: location._id,
            })

            await session.withTransaction(async () => {
                await this.predictionRepository.deleteAllForecasted(
                    { model_id: model._id, location_id: location._id },
                    session
                )
                await this.predictionRepository.insertMany(records, session)
            })
        } finally {
            await session.endSession()
        }
    }

    getPredictionsByLocation = async (query: ForecastParams): Promise<Forecasts> => {
        const model = await this.aiModelRepository.findByType(query.modelId)
        const location = await this.locationRepository.findByCode(query.country_code)

        return await this.predictionRepository.findPredictions({
            $or: [
                { model_id: model._id, prediction_type: PredictionType.forecasted },
                { prediction_type: { $ne: PredictionType.forecasted } },
            ],
            location_id: location._id,
        })
    }

    private static mapPredictions = (
        environment: AiForecastResponse["environment"],
        start: Date,
        { model_id, ...meta }: PredictionForeignKeys
    ) => {
        // Filter the environment to get only the health outcomes starting from the provided date.
        return environment
            .filter(({ date }) => new Date(date) >= start) // TODO: This should be deleted after the environment API calling is fixed for redundancy.
            .map((record) => ({
                ...meta,
                features_snapshot: null,
                prediction_type: PredictionType.predicted,
                base_date: new Date(record.date),
                health_outcomes: {
                    respiratory_disease_rate: { point: record.respiratory_disease_rate },
                    cardio_mortality_rate: { point: record.cardio_mortality_rate },
                    vector_disease_risk_score: { point: record.vector_disease_risk_score },
                    waterborne_disease_incidents: { point: record.vector_disease_risk_score },
                    heat_related_admissions: { point: record.vector_disease_risk_score },
                },
            }))
    }

    private static mapForecasts = (
        response: AiForecastResponse,
        start: Date,
        meta: PredictionForeignKeys
    ) => {
        return Array.from(
            { length: response.horizon },
            (_, index): Partial<IPrediction> => ({
                ...meta,
                features_snapshot: null,
                prediction_type: PredictionType.forecasted,
                base_date: addWeeks(start, index),
                health_outcomes: Object.fromEntries(
                    Object.entries(response.forecasts).map(([healthOutcome, outcome]) => [
                        healthOutcome,
                        {
                            point: outcome.point[index],
                            lower: outcome.lower?.[index] ?? null,
                            upper: outcome.upper?.[index] ?? null,
                        },
                    ])
                ) as IHealthOutcomesWithIntervals,
            })
        )
    }

    // insertMany = async (predictions: Partial<IPrediction>[]) => {
    //     return await this.predictionRepository.insertMany(predictions)
    // }

    // createPrediction = async (prediction: Partial<IPrediction>) => {
    //     return await this.predictionRepository.create(prediction)
    // }

    // findAllPredictions = async () => {
    //     return await this.predictionRepository.findPredictionsGroupedByLoc()
    // }
}
