"use client"

import { api } from "@/shared/api"
import { format } from "date-fns"
import { toast } from "sonner"
import { WeekClientService } from "@/features/environment/week/week.service.client"
import {
    SimulateQueryParams,
    SimulateResponse,
    Location,
} from "@/features/environment/week/week.types"

export class SimulateClientService {
    constructor(private readonly weekService: WeekClientService) {}

    private fetchEnvironmentAndSimulate = async (
        loc: Location,
        date?: Date,
        weeks = 0,
        params: SimulateQueryParams = { top_k_contributions: 25, explainer_method: "group" }
    ) => {
        const formattedDate = date ? format(date, "yyyy-MM-dd") : null
        const environment = await this.weekService.fetchEnvironment(loc, formattedDate, weeks)
        if (!environment) return null

        const result = await api
            .post<SimulateResponse>("ai/simulate", {
                json: environment,
                searchParams: {
                    top_k_contributors: params.top_k_contributions,
                    explainer_method: params.explainer_method,
                },
            })
            .json()
        return result
    }

    simulateEnvironment = async (
        loc: Location,
        date: Date,
        weeks = 1,
        params: SimulateQueryParams = { top_k_contributions: 25, explainer_method: "group" }
    ) => {
        return await toast
            .promise<SimulateResponse | null>(
                () => this.fetchEnvironmentAndSimulate(loc, date, weeks, params),
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
}
