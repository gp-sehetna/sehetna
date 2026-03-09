import {
    ForecastResponseSchema,
    ForecastResultSchema,
    ForecastsSchema,
} from "@/features/environment/forecast/forecast.validation"
import { z } from "zod"

type ForecastResult = z.infer<typeof ForecastResultSchema>
type ForecastResponse = z.infer<typeof ForecastResponseSchema>
type Forecasts = z.infer<typeof ForecastsSchema>

export type { ForecastResponse, ForecastResult, Forecasts }
