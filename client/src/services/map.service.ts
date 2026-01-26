import { MAP_CONFIG } from "@/components/ui/map/config"
import { api } from "@/lib/fetch"

interface Prediction {
    respiratory_disease_rate: number
    cardio_mortality_rate: number
    vector_disease_risk_score: number
    waterborne_disease_incidents: number
    heat_related_admissions: number
}

interface PredsRes {
    predictions: Prediction
}

export const MapService = {
    getMapPredictions: async (payload: any) => {
        const { predictions } = await api.post<PredsRes>("ai/simulate", { json: payload }).json()
        return predictions
    },
    getCountriesPolygons: async () => {
        const geoJson = await api.get<any>(MAP_CONFIG.countriesPath).json()
        return geoJson
    },
}
