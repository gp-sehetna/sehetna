"use client"

import { api } from "@/shared/api"
import type {
    ScenarioObservationListResult,
    ScenarioObservationQueryParams,
} from "@/features/scenarios/scenario.types"
import { IEnvironmentData } from "../environment/week/week.dto"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"

type ScenarioObservationListResponse = {
    data: ScenarioObservationListResult
    message: string
}

class ScenarioClientService {
    listObservations = async (params: ScenarioObservationQueryParams) => {
        const response = await api
            .get<ScenarioObservationListResponse>("api/scenarios", {
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

    exportObservations = async (params: ScenarioObservationQueryParams) => {
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
            .post("api/scenario", {
                json: {
                    environment,
                    prediction: prediction,
                },
            })
            .json()
    }

    deleteObservation = async (id: string) => {
        await api.delete(`api/scenarios/${id}`).json()
    }

    addObservationNote = async (id: string, note: string) => {
        await api.post(`api/scenarios/${id}`, { json: { note } }).json()
    }
}

const scenarioClientService = new ScenarioClientService()

export { scenarioClientService, ScenarioClientService }
