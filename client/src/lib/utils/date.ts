import {
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachYearOfInterval,
    format,
    subDays,
    subMonths,
    subYears,
} from "date-fns"

type Granularity = "weekly" | "monthly" | "yearly"
type RangePreset =
    | "Last 30 days"
    | "Last 90 days"
    | "Last 6 months"
    | "Last 9 months"
    | "Last 12 months"
    | "Last 5 years"
    | "All Time"

const rangePreset = {
    last30Days: "Last 30 days",
    last90Days: "Last 90 days",
    last6Months: "Last 6 months",
    last9Months: "Last 9 months",
    last12Months: "Last 12 months",
    last5Years: "Last 5 years",
    allTime: "All Time",
} as const

function getWeekRange(dateStr: string, weeks: number = 1) {
    const date = new Date(dateStr)
    const dayIndex = date.getDay() // Sunday = 0

    const startDate = new Date(date)
    startDate.setDate(date.getDate() - dayIndex)

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (weeks * 7 - 1))

    return {
        startDate: format(startDate, "yyyy-MM-dd"),
        endDate: format(endDate, "yyyy-MM-dd"),
    }
}

const GRANULARITY_LABELS: Record<Granularity, string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
}

/** Which granularities make sense for each preset */
const ALLOWED_GRANULARITIES: Record<RangePreset, Granularity[]> = {
    [rangePreset.last30Days]: ["weekly"],
    [rangePreset.last90Days]: ["weekly", "monthly"],
    [rangePreset.last6Months]: ["weekly", "monthly"],
    [rangePreset.last9Months]: ["weekly", "monthly"],
    [rangePreset.last12Months]: ["weekly", "monthly"],
    [rangePreset.last5Years]: ["monthly", "yearly"],
    [rangePreset.allTime]: ["monthly", "yearly"],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRangeStart(preset: RangePreset, dataStart: Date, dataEnd: Date): Date {
    switch (preset) {
        case "Last 30 days":
            return subDays(dataEnd, 30)
        case "Last 90 days":
            return subDays(dataEnd, 90)
        case "Last 6 months":
            return subMonths(dataEnd, 6)
        case "Last 9 months":
            return subMonths(dataEnd, 9)
        case "Last 12 months":
            return subMonths(dataEnd, 12)
        case "Last 5 years":
            return subYears(dataEnd, 5)
        case "All Time":
            return dataStart
    }
}

function buildTicks(rangeStart: Date, rangeEnd: Date, granularity: Granularity): Date[] {
    if (granularity === "weekly")
        return eachWeekOfInterval({ start: rangeStart, end: rangeEnd }, { weekStartsOn: 1 })
    if (granularity === "monthly") return eachMonthOfInterval({ start: rangeStart, end: rangeEnd })
    return eachYearOfInterval({ start: rangeStart, end: rangeEnd })
}

function formatTick(date: Date, granularity: Granularity): string {
    if (granularity === "weekly") return format(date, "MMM d")
    if (granularity === "monthly") return format(date, "MMM yyyy")
    return format(date, "yyyy")
}

function formatSelectedDate(date: Date, granularity: Granularity): string {
    if (granularity === "weekly") return format(date, "MMMM d, yyyy")
    if (granularity === "monthly") return format(date, "MMMM yyyy")
    return format(date, "yyyy")
}

/** How many axis labels to show at most so they don't crowd */
function maxLabels(preset: RangePreset, granularity: Granularity): number {
    if (granularity === "yearly") return 11
    if (granularity === "monthly") return 7
    // weekly
    if (preset === "Last 30 days") return 5
    if (preset === "Last 90 days") return 6
    return 7
}

export {
    ALLOWED_GRANULARITIES,
    buildTicks,
    formatSelectedDate,
    formatTick,
    getRangeStart,
    getWeekRange,
    GRANULARITY_LABELS,
    maxLabels,
    rangePreset,
}

export type { Granularity, RangePreset }
