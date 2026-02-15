import { GroupedHealthOutcome, Prediction } from "@/features/environment/week/week.types"
import { CurrHealthOutcomePreds } from "@/shared/types/map"
import { create } from "zustand"

type PredictionsState = {
    healthOutcome: string
    clickedZonePredictions: GroupedHealthOutcome["predictions"] | null
    currHealthOutcomePredictions: CurrHealthOutcomePreds | null
    loadingPredictions: boolean
    handleStorePredictions: (
        predictions: GroupedHealthOutcome["predictions"],
        healthOutcome: keyof Prediction
    ) => void
    setLoading: (loading: boolean) => void
    handleLayerChange: (healthOutcome: keyof Prediction) => void
    reset: () => void
}

export const usePredictionsStore = create<PredictionsState>((set, get) => ({
    healthOutcome: "",
    clickedZonePredictions: null,
    currHealthOutcomePredictions: null,
    loadingPredictions: false,

    setLoading: (loading) => set({ loadingPredictions: loading }),

    handleStorePredictions: (
        predictions: GroupedHealthOutcome["predictions"],
        healthOutcome: keyof Prediction
    ) => {
        const value = predictions ? predictions[healthOutcome] : null

        const contributors = predictions?.explanations?.group[healthOutcome] || null

        set({
            healthOutcome,
            clickedZonePredictions: predictions,
            currHealthOutcomePredictions: { healthOutcome, value, contributors },
        })
    },

    handleLayerChange: (newHealthOutcome: keyof Prediction) => {
        const { clickedZonePredictions } = get()
        const value = clickedZonePredictions ? clickedZonePredictions[newHealthOutcome] : null

        const contributors = clickedZonePredictions?.explanations?.group[newHealthOutcome] || null
        const currHealthOutcomePredictions = {
            healthOutcome: newHealthOutcome,
            value,
            contributors,
        }

        set({ healthOutcome: newHealthOutcome, currHealthOutcomePredictions })
        if (!clickedZonePredictions) return
    },

    reset: () =>
        set({
            clickedZonePredictions: null,
            currHealthOutcomePredictions: null,
            loadingPredictions: false,
        }),
}))
