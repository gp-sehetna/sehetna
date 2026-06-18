import { Badge } from "@/components/ui/shadcn/badge"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/date"


const missingValue = (label = "–") => <span className="text-muted-foreground">{label}</span>

const numberFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
})

const integerFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
})

const currencyFormatter = new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
})

const formatScenarioDate = (value?: string | Date | null) =>
    value ? formatDate(value, { day: "2-digit", month: "short", year: "numeric" }) : "Unknown"

const formatNumber = (value?: number | null, suffix?: string) => {
    if (value == null || Number.isNaN(value)) return null
    return `${numberFormatter.format(value)}${suffix ? ` ${suffix}` : ""}`
}

const formatInteger = (value?: number | null, suffix?: string) => {
    if (value == null || Number.isNaN(value)) return null
    return `${integerFormatter.format(value)}${suffix ? ` ${suffix}` : ""}`
}

const formatCurrency = (value?: number | null) => {
    if (value == null || Number.isNaN(value)) return null
    return currencyFormatter.format(value)
}

const getAqiSeverity = (value?: number | null) => {
    if (value == null || Number.isNaN(value)) return null
    if (value <= 50)
        return { label: "Good", className: "border-green-200 bg-green-50 text-green-700" }
    if (value <= 100)
        return { label: "Moderate", className: "border-yellow-200 bg-yellow-50 text-yellow-700" }
    if (value <= 150)
        return {
            label: "Unhealthy (Sensitive)",
            className: "border-orange-200 bg-orange-50 text-orange-700",
        }
    if (value <= 200)
        return { label: "Unhealthy", className: "border-red-200 bg-red-50 text-red-700" }

    return {
        label: "Very Unhealthy",
        className: "border-purple-200 bg-purple-50 text-purple-700",
    }
}


type FloodIndicator = 0 | 1

const getFloodSeverity = (value?: FloodIndicator | null) => {
    // Handle null, undefined, or invalid inputs safely
    if (value === null || value === undefined) return null

    const statusMap = {
        0: {
            label: "Normal",
            className: "border-green-200 bg-green-50 text-green-700",
        },
        1: {
            label: "Flooded",
            className: "border-red-200 bg-red-50 text-red-700",
        },
    } satisfies Record<FloodIndicator, { label: string; className: string }>

    return statusMap[value] ?? null
}

// 2. Extract the return type for the component props
type Severity = ReturnType<typeof getFloodSeverity>

// 3. Your Badge Component
const SeverityBadge = ({ severity }: { severity: Severity }) => {
    // If severity is null, call your fallback function
    if (!severity) return missingValue() 

    return (
        <Badge
            variant="outline"
            className={cn("whitespace-nowrap font-medium", severity.className)}
        >
            {severity.label}
        </Badge>
    )
}

export {
    formatCurrency,
    formatInteger,
    formatNumber,
    formatScenarioDate,
    getAqiSeverity,
    getFloodSeverity,
    missingValue,
    SeverityBadge,
}
