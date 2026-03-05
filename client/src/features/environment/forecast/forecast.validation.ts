import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import { AiModel } from "@/shared/db/enums/ai-model.enum"
import { PredictionTypeEnum } from "@/shared/db/enums/prediction.enum"
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
})

const ForecastParamsSchema = z.object({
    modelId: z.enum(AiModel),
})

const ForecastsSchema = z.object({
    forecasts: z.object({
        prediction_type: z.enum(PredictionTypeEnum),
        health_outcomes: ForecastResultSchema,
        base_date: z.date(),
    }),
})

export {
    ForecastParamsSchema,
    ForecastResponseSchema,
    ForecastResultSchema,
    ForecastsSchema,
    TargetForecastSchema,
}
