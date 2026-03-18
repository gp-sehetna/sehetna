import { ForecastResponse, Forecasts } from "@/features/environment/prediction/prediction.dto"
import { api } from "@/shared/api"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { useQuery } from "@tanstack/react-query"
import { SearchParamsOption } from "ky"

type UseForecastsOptions = {
    modelId?: AiModelEnum
    iso: string
}
export const useForecasts = (options?: UseForecastsOptions) => {
    const { modelId, iso } = options || {}

    return useQuery<Forecasts>({
        queryKey: ["forecasts", modelId, iso],
        queryFn: async () => {
            const searchParams: SearchParamsOption = {
                "model-id": modelId,
                iso,
            }

            const { predictions } = await api
                .get<ForecastResponse>("api/environment/prediction", { searchParams })
                .json()

            return predictions
        },
        enabled: !!iso && !!modelId,
        staleTime: process.env.NODE_ENV == "development" ? 0 : 1000 * 60 * 60 * 6,
    })
}
