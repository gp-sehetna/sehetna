import {
    ForecastResponseSchema,
    ForecastResultSchema,
    TargetForecastSchema,
} from "@/features/environment/forecast/forecast.validation"
import { z } from "zod"

type TargetForecast = z.infer<typeof TargetForecastSchema>
type ForecastResult = z.infer<typeof ForecastResultSchema>
type ForecastResponse = z.infer<typeof ForecastResponseSchema>

export type { ForecastResponse, ForecastResult, TargetForecast }
