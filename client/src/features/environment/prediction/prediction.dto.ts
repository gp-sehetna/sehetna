import {
    ForecastParamsSchema,
    ForecastsOutcomesViewSchema,
    ForecastsSchema,
} from "@/features/environment/prediction/prediction.validation"
import { z } from "zod"

type ForecastParams = z.infer<typeof ForecastParamsSchema>
type Forecasts = z.infer<typeof ForecastsSchema>
type ForecastsOutcomesView = z.infer<typeof ForecastsOutcomesViewSchema>

type ForecastResponse = {
    predictions: Forecasts
}

export type { ForecastParams, ForecastResponse, Forecasts, ForecastsOutcomesView }
