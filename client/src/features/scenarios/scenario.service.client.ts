"use client"

import { api } from "@/shared/api"
import type {
    ScenarioObservationListResult,
    ScenarioObservationQueryParams,
} from "@/features/scenarios/scenario.types"

type ScenarioObservationListResponse = {
    data: ScenarioObservationListResult
    message: string
}

class ScenarioClientService {
    listObservations = async (params: ScenarioObservationQueryParams) => {
        const response = await api
            .get<ScenarioObservationListResponse>("api/scenarios/observations", {
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
            .get("api/scenarios/observations/export", {
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

    deleteObservation = async (id: string) => {
        await api.delete(`api/scenarios/observations/${id}`).json()
    }

    addObservationNote = async (id: string, note: string) => {
        await api.post(`api/scenarios/observations/${id}`, { json: { note } }).json()
    }
}

const scenarioClientService = new ScenarioClientService()

export { scenarioClientService, ScenarioClientService }
