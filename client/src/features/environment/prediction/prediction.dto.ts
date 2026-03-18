import { SimplePrediction } from "@/features/environment/prediction/prediction.types"
import {
    ForecastParamsSchema,
    GetPredictionsParamsSchema,
} from "@/features/environment/prediction/prediction.validation"
import { z } from "zod"

type GetPredictionsParams = z.infer<typeof GetPredictionsParamsSchema>
type ForecastParams = z.infer<typeof ForecastParamsSchema>

type ForecastResponse = {
    predictions: SimplePrediction[]
}

export type { ForecastParams, ForecastResponse, GetPredictionsParams }
