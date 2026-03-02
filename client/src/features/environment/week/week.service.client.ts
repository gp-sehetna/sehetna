"use client"
import { IEnvironmentData } from "@/features/environment/week/week.dto"
import {
    Location,
    SimulateQueryParams,
    SimulateResponse,
} from "@/features/environment/week/week.types"
import { toProperCase } from "@/lib/utils"
import { confirmIncompleteEnvironment } from "@/lib/utils/toast"
import { api } from "@/shared/api"
import { format } from "date-fns"
import { SearchParamsOption } from "ky"
import { toast } from "sonner"
import { Forecasts } from "../forecast/forecast.dto"

export class WeekClientService {
    constructor(
        private setEnvironment: (_: IEnvironmentData) => void,
        private setModifying: (_: boolean) => void
    ) {}
    private getNullEnvironmentDataKeys(environmentData: IEnvironmentData): string[] {
        const nullKeys = new Set<string>()

        // Check all weekly data rows
        for (const row of environmentData.data)
            for (const [key, value] of Object.entries(row))
                if (value === null) nullKeys.add(toProperCase(key))

        // Check all indicators dynamically
        for (const [key, value] of Object.entries(environmentData.indicators))
            if (value == null) nullKeys.add(toProperCase(key))

        return Array.from(nullKeys)
    }

    private fetchEnvironment = async (location: Location, date: string | null, weeks: number) => {
        const { lat, lng, iso } = location,
            coords = `${lat},${lng}`,
            isNotSimulation = !date || weeks == 0,
            searchParams: SearchParamsOption = isNotSimulation
                ? { coords, iso }
                : { coords, iso, date, weeks },
            environmentData = await api
                .get<IEnvironmentData>("api/environment/week", { searchParams })
                .json()

        this.setEnvironment(environmentData)

        // Validate Environment Data and ensure non-null values.
        if (!environmentData || !environmentData.data.length) {
            toast.error("No data found for this location", {
                description: "Please try another location or date.",
            })
            return null
        }

        // Check if any of the data objects keys is null and retreive this key for logging.
        const nullKeys = this.getNullEnvironmentDataKeys(environmentData)
        // If any of the data objects keys is null and this is not a simulation,
        // notify the user for intermediate action.
        if (!nullKeys.length || isNotSimulation) return environmentData

        const result = await confirmIncompleteEnvironment(environmentData)
        if (result) return environmentData

        this.setModifying(true)
        return environmentData
    }

    private simulate = async (environment: IEnvironmentData, params: SimulateQueryParams) => {
        const result = await api
            .post<SimulateResponse>("ai/simulate", {
                json: environment,
                searchParams: { ...params },
            })
            .json()
        return result
    }

    simulateEnvironment = async (environment: IEnvironmentData, params: SimulateQueryParams) => {
        return await toast
            .promise<SimulateResponse>(() => this.simulate(environment, params), {
                loading: "Simulating...",
                success: () => {
                    return { message: "Predictions loaded!", type: "info" }
                },
                error: "Error occurred",
            })
            .unwrap()
    }

    fetchEnvironmentAndSimulate = async (
        loc: Location,
        date: Date,
        weeks = 1,
        params: SimulateQueryParams = { top_k_contributions: 25, explainer_method: "group" }
    ) => {
        return await toast
            .promise<SimulateResponse | null>(
                async () => {
                    const formattedDate = date ? format(date, "yyyy-MM-dd") : null
                    const environment = await this.fetchEnvironment(loc, formattedDate, weeks)
                    if (!environment) return null

                    return await this.simulate(environment, params)
                },
                {
                    loading: "Simulating...",
                    success: (predictions) => {
                        if (!predictions)
                            return {
                                message: "Modify your inputs at the side bar to get predictions.",
                                type: "warning",
                            }

                        return { message: "Predictions loaded!", type: "info" }
                    },
                    error: "Error occurred",
                }
            )
            .unwrap()
    }

    getForecasts = async () => {
        const searchParams: SearchParamsOption = { "model-id": "timesfm" }
        const { forecasts } = await api
            .get<Forecasts>("api/environment/forecast", { searchParams })
            .json()
        return forecasts
    }
}
