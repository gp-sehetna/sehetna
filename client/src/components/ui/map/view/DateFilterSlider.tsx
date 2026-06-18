"use client"

import { Button } from "@/components/ui/shadcn/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"
import { Slider } from "@/components/ui/shadcn/slider"
import { useDateFilter } from "@/hooks/useDateFilter"
import { cn } from "@/lib/utils"
import {
    ALLOWED_GRANULARITIES,
    formatSelectedDate,
    formatTick,
    Granularity,
    GRANULARITY_LABELS,
    rangePreset,
    RangePreset,
} from "@/lib/utils/date"
import { useFilterDateStore } from "@/stores/map/use-filter-date"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dispatch } from "react"

type OnDateFilerChangeValue = {
    date: Date
    granularity: Granularity
    preset: RangePreset
}

type OnDateFilterChange = Dispatch<OnDateFilerChangeValue>

interface DateRangeSliderProps {
    onChange?: OnDateFilterChange
    className?: string
}

const DateRangeSlider = ({ onChange, className }: DateRangeSliderProps) => {
    const { date, setDate, granularity } = useFilterDateStore()
    const {
        handleGranularityChange,
        handlePresetChange,
        stepBy,
        ticks,
        sliderIndex,
        labelIndices,
        preset,
        setSliderIndex,
    } = useDateFilter()

    return (
        <div className={cn("mt-4 flex w-full flex-col gap-3 rounded-xl select-none", className)}>
            {/* ── Row 1: Selected date label + controls ── */}
            <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Date display */}
                <span className="font-semibold tracking-tight">
                    {formatSelectedDate(date, granularity)}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Preset selector */}
                    <Select
                        value={preset}
                        onValueChange={(v) => handlePresetChange(v as RangePreset)}
                    >
                        <SelectTrigger size="sm" className="w-35" variant="glassy">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-background/10">
                            {Object.values(rangePreset).map((p) => (
                                <SelectItem key={p} value={p}>
                                    {p}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Granularity selector */}
                    <Select
                        value={granularity}
                        onValueChange={(v) => handleGranularityChange(v as Granularity)}
                    >
                        <SelectTrigger size="sm" className="w-27.5" variant="glassy">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-background/10">
                            {ALLOWED_GRANULARITIES[preset].map((g) => (
                                <SelectItem key={g} value={g} className="">
                                    {GRANULARITY_LABELS[g]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* ── Row 2: Step buttons + Slider ── */}
            <div className="flex items-center gap-2">
                {/* Left step */}
                <Button
                    size="icon"
                    variant="text"
                    className="h-6.5 w-6.5"
                    onClick={() => stepBy(-1)}
                    disabled={sliderIndex === 0}
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>

                {/* Slider track area */}
                <div className="flex-1 px-1">
                    <Slider
                        min={0}
                        max={ticks.length - 1}
                        step={1}
                        value={[sliderIndex]}
                        onValueChange={([v]) => {
                            setSliderIndex(v)
                            setDate(ticks[v])
                            onChange?.({ date, granularity, preset })
                        }}
                    />
                </div>

                {/* Right step */}
                <Button
                    size="icon"
                    variant="text"
                    className="h-6.5 w-6.5"
                    onClick={() => stepBy(1)}
                    disabled={sliderIndex === ticks.length - 1}
                >
                    <ChevronRight className="h-6 w-6" />
                </Button>
            </div>

            {/* ── Row 3: All ticks + labels on key indices ── */}
            <div className="relative mr-8 ml-8 h-6 w-full" style={{ width: "calc(100% - 64px)" }}>
                {ticks.map((_, tickIdx) => {
                    const pct = ticks.length > 1 ? (tickIdx / (ticks.length - 1)) * 100 : 0
                    const isActive = tickIdx === sliderIndex
                    const hasLabel = labelIndices.includes(tickIdx)
                    return (
                        <span
                            key={tickIdx}
                            onClick={() => setSliderIndex(tickIdx)}
                            style={{ left: `${pct}%` }}
                            className="absolute flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2"
                        >
                            {/* label — only on labelIndices */}
                            {/* tick mark — all ticks */}
                            <span
                                className={cn(
                                    "base-transition w-px rounded-full",
                                    isActive ? "bg-neutral-1000/70 h-3" : "bg-foreground/20 h-1.5"
                                )}
                            />
                            {hasLabel && (
                                <span
                                    className={cn(
                                        "base-transition text-[10px] whitespace-nowrap",
                                        isActive
                                            ? "text-neutral-1000 font-medium"
                                            : "hover:text-neutral-1000 text-neutral-700"
                                    )}
                                >
                                    {formatTick(ticks[tickIdx], granularity)}
                                </span>
                            )}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}

export default DateRangeSlider
