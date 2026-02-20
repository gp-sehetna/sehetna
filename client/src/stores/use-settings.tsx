import { ExplanationMethod } from "@/features/environment/week/week.types"
import { create } from "zustand"

type SettingsState = {
    explanationMethod: ExplanationMethod
    contributors: number
    setExplanationMethod: (method: ExplanationMethod) => void
    setContributors: (contributors: number) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
    explanationMethod: "group",
    contributors: 8,

    setExplanationMethod: (explanationMethod) => set({ explanationMethod }),
    setContributors: (contributors) => set({ contributors }),
}))
