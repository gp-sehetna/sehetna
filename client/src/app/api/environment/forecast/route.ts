import { ForecastResponse } from "@/features/environment/forecast/forecast.dto"
import { api } from "@/shared/api"
import { MainService } from "@/shared/db/main.service"
import { globalErrorHandler } from "@/shared/http/handlers/error.handler"

export const POST = globalErrorHandler(async (request) => {
    const json = await request.json()
    const { forecasts: _ } = await api.post<ForecastResponse>("forecast", { json }).json()

    const _mainService = await MainService.getInstance()
    // const data = await mainService.forecastService.insertForecasts(json.model_id, json.code, forecasts)
    return []
})
