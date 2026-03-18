import { ForecastParams } from "@/features/environment/prediction/prediction.types"
import {
    mapWeekEnvironmentParams,
    WeekEnvironmentQuerySchema,
} from "@/features/environment/week/week.validation"
import { AiModel } from "@/shared/db/enums/ai-model.enum"
import { z } from "zod"

const AiModelEnumSchema = z.enum(AiModel)
const CountryCodeSchema = z.string().length(3)

const GetPredictionsParamsSchema = z.object({
    modelId: AiModelEnumSchema.nullable(),
    country_code: CountryCodeSchema.nullable(),
})

const ForecastParamsSchema = z.object({
    modelId: AiModelEnumSchema,
    country_code: CountryCodeSchema,
})

const ForecastEnvironmentParamsSchema = ForecastParamsSchema.extend(
    WeekEnvironmentQuerySchema.shape
).transform<ForecastParams>(({ modelId, ...data }) => ({
    modelId,
    ...mapWeekEnvironmentParams(data),
}))

export { ForecastEnvironmentParamsSchema, ForecastParamsSchema, GetPredictionsParamsSchema }
