import { GroupExplanationItem, Prediction } from "@/features/environment/week/week.types"

interface Coordinates {
    lat: number
    lng: number
}
type CurrHealthOutcomePreds = {
    healthOutcome: string
    value: number | null
    contributors: GroupExplanationItem[] | null
}
type PredictionsStates = {
    clickedZonePredictions: Prediction | null
    loadingPredictions: boolean
}
type HealthOutcomePredictions = Omit<PredictionsStates, "loadingPredictions">
export type { Coordinates, HealthOutcomePredictions, PredictionsStates, CurrHealthOutcomePreds }
