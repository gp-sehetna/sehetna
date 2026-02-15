import { Prediction, SimulateResponse } from "@/features/environment/week/week.types"
import { Contributors } from "@/shared/types/map"
import { create } from "zustand"

type PredictionsState = {
    healthOutcome: keyof Prediction
    simulation: SimulateResponse | null
    contributors: Contributors | null
    loading: boolean
    setLoading: (loading: boolean) => void
    setSimulation: (simulation: SimulateResponse, healthOutcome: keyof Prediction) => void
    onOutcomeSelect: (healthOutcome: keyof Prediction) => void
    reset: () => void
}

export const usePredictionsStore = create<PredictionsState>((set, get) => {
    const getContributors = (simulation: SimulateResponse, healthOutcome: keyof Prediction) => {
        if (!simulation || simulation.predictions.length === 0) return undefined

        return simulation.explanations[simulation.explanations.method][healthOutcome]
    }

    const setContributions = (simulation: SimulateResponse, healthOutcome: keyof Prediction) => {
        const contributors = getContributors(simulation, healthOutcome)
        if (!contributors) return

        set({ healthOutcome, contributors })
    }

    return {
        healthOutcome: "respiratory_disease_rate",
        simulation: null,
        contributors: null,
        loading: false,

        setLoading: (loading) => set({ loading }),

        setSimulation: (simulation: SimulateResponse, healthOutcome: keyof Prediction) => {
            setContributions(simulation, healthOutcome)
            set({ simulation })
        },

        onOutcomeSelect: (healthOutcome: keyof Prediction) => {
            const { simulation } = get()
            if (!simulation) return

            setContributions(simulation, healthOutcome)
        },

        reset: () =>
            set({ healthOutcome: "respiratory_disease_rate", contributors: null, loading: false }),
    }
})
