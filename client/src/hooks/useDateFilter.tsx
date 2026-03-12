"use client"

import {
    ALLOWED_GRANULARITIES,
    buildTicks,
    getRangeStart,
    Granularity,
    maxLabels,
    RangePreset,
} from "@/lib/utils/date"
import { useFilterDateStore } from "@/stores/map/use-filter-date"
import { isValid } from "date-fns"
import * as React from "react"

const useDateFilter = ((dataStart: Date, dataEnd: Date, onChange?: (value: any) => void) => {
    const granularity = useFilterDateStore((s) => s.granularity)
    const setDate = useFilterDateStore((s) => s.setDate)
    const setGranularity = useFilterDateStore((s) => s.setGranularity)
    const [preset, setPreset] = React.useState<RangePreset>("Last 5 years")
    const [sliderIndex, setSliderIndex] = React.useState<number>(0) // index into ticks[]

    // ── Derived state ──────────────────────────────────────────────────────────
    const rangeStart = React.useMemo(() => {
        return getRangeStart(preset, dataStart, dataEnd)
    }, [preset, dataStart, dataEnd])
    
    const rangeEnd = dataEnd

    const ticks = React.useMemo(() => {
        return buildTicks(rangeStart, rangeEnd, granularity)
    }, [rangeStart, rangeEnd, granularity])

    const safeIndex = Math.min(sliderIndex, ticks.length - 1)

    const selectedDate = React.useMemo(() => {
        return ticks[safeIndex] ?? rangeEnd
    }, [ticks, safeIndex, rangeEnd])

    React.useEffect(() => {
        if (!isValid(selectedDate)) return
        // Keep global store in sync with selected date
        setDate(selectedDate)
    }, [selectedDate])


    // ── Preset change → clamp granularity, reset to last tick ─────────────────
    const handlePresetChange = (next: RangePreset) => {
        const allowed = ALLOWED_GRANULARITIES[next]
        const nextGranularity = allowed.includes(granularity)
            ? granularity
            : allowed[allowed.length - 1]
        const nextTicks = buildTicks(
            getRangeStart(next, dataStart, dataEnd),
            dataEnd,
            nextGranularity
        )
        setPreset(next)
        setGranularity(nextGranularity)
        setSliderIndex(nextTicks.length - 1)
    }

    // ── Granularity change → keep closest date ────────────────────────────────
    const handleGranularityChange = (next: Granularity) => {
        const nextTicks = buildTicks(rangeStart, rangeEnd, next)
        // find closest index
        const currentDate = selectedDate
        let closest = 0
        let minDiff = Infinity
        nextTicks.forEach((t, i) => {
            const diff = Math.abs(t.getTime() - currentDate.getTime())
            if (diff < minDiff) {
                minDiff = diff
                closest = i
            }
        })
        setGranularity(next)
        setSliderIndex(closest)
    }

    // ── Step buttons ──────────────────────────────────────────────────────────
    const stepBy = (delta: number) => {
        setSliderIndex((prev) => Math.max(0, Math.min(ticks.length - 1, prev + delta)))
    }

    // ── Notify parent ──────────────────────────────────────────────────────────
    React.useEffect(() => {
        if (!isValid(selectedDate)) return
        onChange?.({ selectedDate, granularity, preset, rangeStart, rangeEnd })
    }, [safeIndex, granularity, preset]) // eslint-disable-line

    // ── Axis labels ────────────────────────────────────────────────────────────
    const labelCount = maxLabels(preset, granularity)
    const labelIndices = React.useMemo(() => {
        if (ticks.length <= labelCount) return ticks.map((_, i) => i)
        const step = (ticks.length - 1) / (labelCount - 1)

        return Array.from({ length: labelCount }, (_, i) => Math.round(i * step))
    }, [ticks, labelCount])

    // ─── Render ────────────────────────────────────────────────────────────────

    return {
        handleGranularityChange,
        handlePresetChange,
        stepBy,
        ticks,
        safeIndex,
        labelIndices,
        preset,
        granularity,
        selectedDate,
        setSliderIndex,
    }
})

export default useDateFilter
