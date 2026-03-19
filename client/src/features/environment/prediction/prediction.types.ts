import { WeekParams } from "@/features/environment/week/week.types"
import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { PredictionTypeEnum } from "@/shared/db/enums/prediction.enum"
import { SimpleLocation } from "@/shared/db/model/location.model"
import { Types } from "mongoose"

type ForecastParams = {
    modelId: AiModelEnum
} & WeekParams

type IntervalSeries<T = number> = {
    point: T[]
    lower: (T | null)[]
    upper: (T | null)[]
}

type IntervalValue = {
    point: number
    lower?: number | null
    upper?: number | null
}

interface SimplePrediction {
    _id: Types.ObjectId
    location_id: SimpleLocation
    prediction_type: PredictionTypeEnum
    health_outcomes: Record<HealthOutcomesKeys, IntervalValue>
    base_date: Date
}

type PredictionsAggregates = {
    [key: string]: { sum: number; count: number } | undefined
}

interface AiForecastResponse {
    horizon: number
    forecasts: Record<HealthOutcomesKeys, IntervalSeries>
    environment: Record<string, any>[]
}

type Forecasts = SimplePrediction[]

export type {
    AiForecastResponse,
    Forecasts,
    ForecastParams,
    PredictionsAggregates,
    SimplePrediction,
}
