import {
    addWeeks,
    differenceInWeeks,
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachYearOfInterval,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    startOfMonth,
    startOfWeek,
    startOfYear,
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

function getWeekRange(date: Date | string, weeks: number = 0) {
    /**
     * 1. Get the Sunday of the current week
     * 2. Get the weeks in between startDate and today in case that weeks is not provided
     * 3. Add weeks to get the end of the range
     */
    const startDate = startOfWeek(date)
    const weeksInBetween = !weeks ? getWeeksTillToday(startDate) : weeks
    const endDate = addWeeks(startDate, weeksInBetween)

    return { startDate, endDate, weeks: weeksInBetween }
}

const getWeeksTillToday = (start: Date) => {
    const startOfTodaysWeek = startOfWeek(new Date())

    return differenceInWeeks(startOfTodaysWeek, start, { roundingMethod: "ceil" })
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

// ─── Granularity helpers ───────────────────────────────────────────────────────

function getDateRangeByGranularity(date: Date, granularity: Granularity) {
    switch (granularity) {
        case "weekly":
            return { start: startOfWeek(date), end: endOfWeek(date) }
        case "monthly":
            return { start: startOfMonth(date), end: endOfMonth(date) }
        case "yearly":
            return { start: startOfYear(date), end: endOfYear(date) }
        default:
            throw new Error("Invalid granularity")
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

const formatDate = (date?: string | Date, opts?: Intl.DateTimeFormatOptions) => {
    if (!date) return "unknown"
    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) return "N/A"

    return parsedDate.toLocaleDateString(
        "en-US",
        opts ?? {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    )
}

export {
    ALLOWED_GRANULARITIES,
    buildTicks,
    formatDate,
    formatSelectedDate,
    formatTick,
    getDateRangeByGranularity,
    getRangeStart,
    getWeekRange,
    GRANULARITY_LABELS,
    maxLabels,
    rangePreset,
}

export type { Granularity, RangePreset }
