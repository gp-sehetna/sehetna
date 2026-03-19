import { ForecastResponse } from "@/features/environment/prediction/prediction.dto"
import { Forecasts } from "@/features/environment/prediction/prediction.types"
import { api } from "@/shared/api"
import { AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { useFilterDateStore } from "@/stores/map/use-filter-date"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { SearchParamsOption } from "ky"

interface UseForecastsOptions {
    modelId?: AiModelEnum
    iso: string
}
export const useForecasts = ({ modelId, iso }: UseForecastsOptions) => {
    const rangeStart = useFilterDateStore((s) => s.rangeStart)
    const formattedDataStart = format(rangeStart, "yyyy-MM-dd")

    const { data: predictions, isLoading } = useQuery<Forecasts>({
        queryKey: ["forecasts", modelId, formattedDataStart, iso],
        queryFn: async () => {
            const searchParams: SearchParamsOption = {
                "model-id": modelId,
                iso,
                "data-start": formattedDataStart,
            }
            const { predictions } = await api
                .get<ForecastResponse>("api/environment/prediction", { searchParams })
                .json()

            return predictions
        },
        enabled: !!iso && !!modelId,
        staleTime: 1000 * 60 * 60 * 6,
    })

    return {
        predictions,
        isLoading,
    }
}
