"use client"

import { api } from "@/shared/api"
import type {
    ObservationListResult,
    ObservationQueryParams,
} from "@/features/observations/Observation.types"
import { IEnvironmentData } from "../environment/week/week.dto"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"

type ObservationListResponse = {
    data: ObservationListResult
    message: string
}

class ScenarioClientService {
    listObservations = async (params: ObservationQueryParams) => {
        const response = await api
            .get<ObservationListResponse>("api/scenarios", {
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

    exportObservations = async (params: ObservationQueryParams) => {
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

    deleteObservation = async (id: string) => {
        await api.delete(`api/scenarios/${id}`).json()
    }

    addObservationNote = async (id: string, note: string) => {
        await api.post(`api/scenarios/${id}`, { json: { note } }).json()
    }
}

const scenarioClientService = new ScenarioClientService()

export { scenarioClientService, ScenarioClientService }
