import { getRangeStart, Granularity, RangePreset } from "@/lib/utils/date"
import { Dispatch } from "react"
import { create } from "zustand"

export interface DataRange {
    dataStart: Date
    dataEnd: Date
}

interface FilterDateState extends DataRange {
    date: Date
    granularity: Granularity
    preset: RangePreset
    rangeStart: Date

    setDate: Dispatch<Date>
    setGranularity: Dispatch<Granularity>
    setPreset: Dispatch<RangePreset>
    setRangeStart: Dispatch<Date>
}

export const useFilterDateStore = create<FilterDateState>((set) => {
    const dataStart = new Date("2015-01-05")
    const dataEnd = new Date()

    const preset: RangePreset = "Last 5 years"
    const granularity: Granularity = "monthly"
    const rangeStart = getRangeStart(preset, dataStart, dataEnd)

    return {
        dataStart,
        dataEnd,

        date: rangeStart,
        granularity,
        preset,
        rangeStart,

        setGranularity: (granularity) => set({ granularity }),
        setDate: (date) => set({ date }),
        setPreset: (preset) => set({ preset }),
        setRangeStart: (rangeStart) => set({ rangeStart }),
    }
})
