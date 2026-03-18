import { WeekParams } from "@/features/environment/week/week.types"
import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"

type ForecastParams = {
    modelId: AiModelEnum
} & WeekParams

type IntervalSeries<T = number> = {
    point: T[]
    lower: (T | null)[]
    upper: (T | null)[]
}

interface AiForecastResponse {
    horizon: number
    forecasts: Record<HealthOutcomesKeys, IntervalSeries>
    environment: Record<string, any>[]
}

export type { AiForecastResponse, ForecastParams }
