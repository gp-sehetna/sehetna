import { Explanations, Prediction, SimulateResponse } from "@/features/environment/week/week.types"
import { create } from "zustand"

type PredictionsState = {
    healthOutcome: keyof Prediction
    simulation: SimulateResponse | null
    explanations: Explanations | null
    loading: boolean
    setLoading: (loading: boolean) => void
    setSimulation: (simulation: SimulateResponse, healthOutcome: keyof Prediction) => void
    onOutcomeSelect: (healthOutcome: keyof Prediction) => void
    reset: () => void
}

export const usePredictionsStore = create<PredictionsState>((set, get) => {
    const setExplanations = (simulation: SimulateResponse) => {
        if (!simulation || simulation.predictions.length === 0) return undefined

        set({ explanations: simulation.explanations })
    }

    return {
        healthOutcome: "respiratory_disease_rate",
        simulation: null,
        contributors: null,
        explanations: null,
        loading: false,

        setLoading: (loading) => set({ loading }),

        setSimulation: (simulation: SimulateResponse, healthOutcome: keyof Prediction) => {
            setExplanations(simulation)
            set({ healthOutcome, simulation })
        },

        onOutcomeSelect: (healthOutcome: keyof Prediction) => {
            const { simulation } = get()
            if (!simulation) return

            setExplanations(simulation)
            set({ healthOutcome })
        },

        reset: () => set({ healthOutcome: "respiratory_disease_rate", loading: false }),
    }
})
