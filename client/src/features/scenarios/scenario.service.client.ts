"use client"

import { api } from "@/shared/api"
import type { ScenarioListResult, ScenarioQueryParams } from "@/features/scenarios/scenario.types"
import { IEnvironmentData } from "../environment/week/week.dto"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { SuccessResponseWithData } from "@/shared/http/response"

type ScenarioListResponse = SuccessResponseWithData<ScenarioListResult>

class ScenarioClientService {
    listScenarios = async (params: ScenarioQueryParams) => {
        const response = await api
            .get<ScenarioListResponse>("api/scenarios", {
                searchParams: {
                    page: params.page,
                    pageSize: params.pageSize,
                    sortBy: params.sortBy,
                    sortDirection: params.sortDirection,
                    filters: params.filters ? JSON.stringify(params.filters) : undefined,
                },
            })
            .json()

        return response.data
    }

    exportScenarios = async (params: ScenarioQueryParams) => {
        return await api
            .get("api/scenarios/export", {
                searchParams: {
                    page: params.page,
                    pageSize: params.pageSize,
                    sortBy: params.sortBy,
                    sortDirection: params.sortDirection,
                    filters: params.filters ? JSON.stringify(params.filters) : undefined,
                },
            })
            .text()
    }

    saveScenario = async (environment: IEnvironmentData, prediction: IHealthOutcomes) => {
        await api
            .post("api/scenarios", {
                json: {
                    environment,
                    prediction: prediction,
                },
            })
            .json()
    }

    deleteScenario = async (id: string) => {
        await api.delete(`api/scenarios/${id}`).json()
    }

    addScenarioNote = async (id: string, note: string) => {
        await api.post(`api/scenarios/${id}`, { json: { note } }).json()
    }
}

const scenarioClientService = new ScenarioClientService()

export { scenarioClientService, ScenarioClientService }
