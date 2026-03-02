import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import { z } from "zod"

const TargetForecastSchema = z.object({
    point: z.array(z.number()),
    lower: z.array(z.number()),
    upper: z.array(z.number()),
})

const ForecastResultSchema = z.record(z.enum(HEALTH_OUTCOMES_KEYS), TargetForecastSchema)
const ForecastResponseSchema = z.object({
    horizon: z.number().int(),
    forecasts: ForecastResultSchema,
})

export { ForecastResponseSchema, ForecastResultSchema, TargetForecastSchema }
