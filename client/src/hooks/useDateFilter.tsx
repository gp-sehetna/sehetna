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
import { differenceInMilliseconds } from "date-fns"
import { useMemo, useState } from "react"

const useDateFilter = () => {
    const {
        granularity,
        setGranularity,
        date,
        setDate,
        rangeStart,
        setRangeStart,
        preset,
        dataStart,
        dataEnd,
        setPreset,
    } = useFilterDateStore()
    const [sliderIndex, setSliderIndex] = useState<number>(0)

    const ticks = useMemo(() => {
        return buildTicks(rangeStart, dataEnd, granularity)
    }, [rangeStart, dataEnd, granularity])

    // ── Preset change → clamp granularity, reset to last tick ─────────────────
    const handlePresetChange = (next: RangePreset) => {
        const allowed = ALLOWED_GRANULARITIES[next]
        const newRangeStart = getRangeStart(next, dataStart, dataEnd)
        const nextGranularity = allowed.includes(granularity)
            ? granularity
            : allowed[allowed.length - 1]

        setPreset(next)
        setDate(newRangeStart)
        setRangeStart(newRangeStart)
        setGranularity(nextGranularity)
        setSliderIndex(0)
    }

    // ── Granularity change → keep closest date ────────────────────────────────
    const handleGranularityChange = (next: Granularity) => {
        const nextTicks = buildTicks(rangeStart, dataEnd, next)
        const closest = nextTicks.reduce((closestIndex, t, i) => {
            const currentDiff = Math.abs(differenceInMilliseconds(t, date))
            const bestDiff = Math.abs(differenceInMilliseconds(nextTicks[closestIndex], date))

            return currentDiff < bestDiff ? i : closestIndex
        }, 0)
        setGranularity(next)
        setSliderIndex(closest)
    }

    // ── Step buttons ──────────────────────────────────────────────────────────
    const stepBy = (delta: number) => {
        setSliderIndex((prev) => Math.max(0, Math.min(ticks.length - 1, prev + delta)))
    }

    // ── Axis labels ────────────────────────────────────────────────────────────
    const labelCount = maxLabels(preset, granularity)
    const labelIndices = useMemo(() => {
        if (ticks.length <= labelCount) return ticks.map((_, i) => i)
        const step = (ticks.length - 1) / (labelCount - 1)

        return Array.from({ length: labelCount }, (_, i) => Math.round(i * step))
    }, [ticks, labelCount])

    return {
        handleGranularityChange,
        handlePresetChange,
        stepBy,
        ticks,
        sliderIndex,
        labelIndices,
        preset,
        setSliderIndex,
    }
}

export { useDateFilter }

