import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { Explanations, SimulateResponse } from "@/features/environment/week/week.types"
import { HEALTH_OUTCOMES_KEYS, IHealthOutcomes } from "@/shared/config/health-outcomes"
import { create } from "zustand"

type PredictionsState = {
    healthOutcome: keyof IHealthOutcomes
    simulation: SimulateResponse | null
    environment: IEnvironmentData | null
    modifying: boolean
    explanations: Explanations | null
    loading: boolean

    setLoading: (loading: boolean) => void
    setSimulation: (simulation: SimulateResponse, healthOutcome: keyof IHealthOutcomes) => void
    setModifying: (modifying: boolean) => void
    setEnvironment: (environment: IEnvironmentData | null) => void
    onOutcomeSelect: (healthOutcome: keyof IHealthOutcomes) => void
    reset: () => void
}

export const usePredictionsStore = create<PredictionsState>((set, get) => {
    const setExplanations = (simulation: SimulateResponse) => {
        if (!simulation || simulation.predictions.length === 0) return undefined

        set({ explanations: simulation.explanations })
    }

    return {
        healthOutcome: HEALTH_OUTCOMES_KEYS[0],
        simulation: null,
        contributors: null,
        modifying: false,
        explanations: null,
        environment: null,
        loading: false,

        setLoading: (loading) => set({ loading }),

        setModifying: (modifying) => set({ modifying }),
        setEnvironment: (environment) => set({ environment }),
        setSimulation: (simulation: SimulateResponse, healthOutcome: keyof IHealthOutcomes) => {
            setExplanations(simulation)
            set({ healthOutcome, simulation })
        },

        onOutcomeSelect: (healthOutcome: keyof IHealthOutcomes) => {
            const { simulation } = get()
            if (!simulation) return

            setExplanations(simulation)
            set({ healthOutcome })
        },

        reset: () => set({ healthOutcome: HEALTH_OUTCOMES_KEYS[0], loading: false }),
    }
})
