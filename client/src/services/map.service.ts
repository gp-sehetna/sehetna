import { api } from "@/lib/fetch"

interface Prediction {
    respiratory_disease_rate: number
    cardio_mortality_rate: number
    vector_disease_risk_score: number
    waterborne_disease_incidents: number
    heat_related_admissions: number
}

interface PredictionsResponse {
    predictions: Prediction
}

export const MapService = {
    getMapPredictions: async (payload: any) => {
        const { predictions } = await api
            .post<PredictionsResponse>("ai/simulate", { json: payload })
            .json()
        return predictions
    },
}
