import { IEnvironmentData } from "@/features/environment/week/week.dto"
import { Explanations, SimulateResponse } from "@/features/environment/week/week.types"
import { DEFAULT_HEALTH_OUTCOME, IHealthOutcomes } from "@/shared/config/health-outcomes"
import { AiModel, AiModelEnum } from "@/shared/db/enums/ai-model.enum"
import { create } from "zustand"

type PredictionsState = {
    healthOutcome: keyof IHealthOutcomes
    simulation: SimulateResponse | null
    environment: IEnvironmentData | null
    modifying: boolean
    explanations: Explanations | null
    loading: boolean
    forecaster: AiModelEnum

    setLoading: (loading: boolean) => void
    setForecaster: (forecaster: AiModelEnum) => void
    setSimulation: (simulation: SimulateResponse, healthOutcome: keyof IHealthOutcomes) => void
    setModifying: (modifying: boolean) => void
    setEnvironment: (environment: IEnvironmentData | null) => void
    onOutcomeSelect: (healthOutcome: keyof IHealthOutcomes) => void
    resetSimulationMessage: () => void
    reset: () => void
}

export const usePredictionsStore = create<PredictionsState>((set, get) => {
    const setExplanations = (simulation: SimulateResponse) => {
        if (!simulation || simulation.predictions.length === 0) return undefined

        set({ explanations: simulation.explanations })
    }

    const setHealthOutcome = (healthOutcome: keyof IHealthOutcomes) => set({ healthOutcome })
    const setLoading = (loading: boolean) => set({ loading })

    return {
        healthOutcome: DEFAULT_HEALTH_OUTCOME,
        simulation: null,
        contributors: null,
        modifying: false,
        explanations: null,
        environment: null,
        forecaster: AiModel.patchtst,
        loading: false,

        setLoading,
        setForecaster: (forecaster) => set({ forecaster }),
        setModifying: (modifying) => set({ modifying }),
        setEnvironment: (environment) => set({ environment }),
        setSimulation: (simulation: SimulateResponse, healthOutcome: keyof IHealthOutcomes) => {
            setExplanations(simulation)
            setHealthOutcome(healthOutcome)
            set({ simulation })
        },

        resetSimulationMessage: () => {
            set((state) => ({
                simulation: state.simulation ? { ...state.simulation, message: "" } : null,
            }))
        },
        onOutcomeSelect: (healthOutcome: keyof IHealthOutcomes) => {
            setHealthOutcome(healthOutcome)

            const { simulation } = get()
            if (!simulation) return

            setExplanations(simulation)
        },

        reset: () => {
            setHealthOutcome(DEFAULT_HEALTH_OUTCOME)
            setLoading(false)
        },
    }
})
