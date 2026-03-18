import { ForecastParams } from "@/features/environment/prediction/prediction.types"
import {
    mapWeekEnvironmentParams,
    WeekEnvironmentQuerySchema,
} from "@/features/environment/week/week.validation"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import { AiModel } from "@/shared/db/enums/ai-model.enum"
import { PredictionType } from "@/shared/db/enums/prediction.enum"
import { z } from "zod"

const PredictionViewSchema = z.object({
    point: z.number(),
    lower: z.number().nullable().optional(),
    upper: z.number().nullable().optional(),
})

const ForecastsOutcomesViewSchema = z.record(z.enum(HEALTH_OUTCOMES_KEYS), PredictionViewSchema)
const ForecastsSchema = z.array(
    z.object({
        prediction_type: z.enum(PredictionType),
        health_outcomes: ForecastsOutcomesViewSchema,
        base_date: z.date(),
    })
)

const ForecastParamsSchema = z.object({
    modelId: z.enum(AiModel),
    country_code: z.string().length(3),
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
    ForecastsOutcomesViewSchema,
    ForecastsSchema,
}
