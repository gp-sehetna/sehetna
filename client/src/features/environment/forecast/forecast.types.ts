import { WeekParams } from "@/features/environment/week/week.types"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"

type ForecastParams = {
    modelId: AiModelEnum
} & WeekParams

export type { ForecastParams }
