import { ForecastParams } from "@/features/environment/prediction/prediction.types"
import {
    mapWeekEnvironmentParams,
    WeekEnvironmentQuerySchema,
} from "@/features/environment/week/week.validation"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import { AiModel } from "@/shared/db/enums/ai-model.enum"
import { PredictionType } from "@/shared/db/enums/prediction.enum"
import { z } from "zod"

const TargetForecastSchema = z.object({
    point: z.array(z.number()),
    lower: z.array(z.number().nullable()),
    upper: z.array(z.number().nullable()),
})

const ForecastResultSchema = z.record(z.enum(HEALTH_OUTCOMES_KEYS), TargetForecastSchema)
const ForecastResponseSchema = z.object({
    horizon: z.number().int(),
    forecasts: ForecastResultSchema,
    predictions: z.array(z.record(z.enum(HEALTH_OUTCOMES_KEYS), z.number())),
})

const ForecastsSchema = z.object({
    forecasts: z.object({
        prediction_type: z.enum(PredictionType),
        health_outcomes: ForecastResultSchema,
        base_date: z.date(),
    }),
})

const ForecastParamsSchema = z.object({
    modelId: z.enum(AiModel),
})

const ForecastEnvironmentParamsSchema = ForecastParamsSchema.extend(
    WeekEnvironmentQuerySchema.shape
).transform<ForecastParams>(({ modelId, ...data }) => ({
    modelId,
    ...mapWeekEnvironmentParams(data),
}))

export {
    ForecastEnvironmentParamsSchema,
    ForecastParamsSchema,
    ForecastResponseSchema,
    ForecastResultSchema,
    ForecastsSchema,
    TargetForecastSchema,
}
