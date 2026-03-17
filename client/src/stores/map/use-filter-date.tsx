import { Granularity } from "@/lib/utils/date"
import { create } from "zustand"

type FilterDateState = {
    date?: Date
    granularity: Granularity
    setDate: (date: Date) => void
    setGranularity: (granularity: Granularity) => void
}

export const useFilterDateStore = create<FilterDateState>((set) => ({
    date: undefined,
    granularity: "monthly",

    setGranularity: (granularity) => set({ granularity }),
    setDate: (date) => set({ date }),
}))
