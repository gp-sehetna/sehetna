import { Forecasts } from "@/features/environment/forecast/forecast.dto"
import { api } from "@/shared/api"
import { AiModel, AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { useQuery } from "@tanstack/react-query"
import { SearchParamsOption } from "ky"

type UseForecastsOptions = {
    modelId?: AiModelEnum
}

export const useForecasts = (options?: UseForecastsOptions) => {
    const { modelId = AiModel.patchtst } = options || {}
    return useQuery({
        queryKey: ["forecasts", modelId],
        queryFn: async () => {
            const searchParams: SearchParamsOption = { "model-id": modelId }

            const { forecasts } = await api
                .get<Forecasts>("api/environment/forecast", { searchParams })
                .json()

            return forecasts
        },
        staleTime: 1000 * 60 * 60 * 6,
    })
}
