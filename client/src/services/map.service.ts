import { apiClient } from "@/lib/axios"

export const MapService = {
    getMapPredictions: async (payload: any) => {
        const { data: predictions } = await apiClient.post<any>("/api/simulate", payload)
        return predictions
    },
}
