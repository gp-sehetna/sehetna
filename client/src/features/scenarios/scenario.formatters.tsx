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
        return {
            label: "Good",
            className: "border-success-100/40 bg-success-100/5 text-success-300",
        }
    if (value <= 100)
        return {
            label: "Moderate",
            className: "border-warning-200/20 bg-warning-100/5 text-warning-300",
        }
    if (value <= 150)
        return {
            label: "Unhealthy (Sensitive)",
            className: "border-orange-200 bg-orange-50 text-orange-700",
        }
    if (value <= 200)
        return {
            label: "Unhealthy",
            className: "border-danger-100/10 bg-danger-100/5 text-danger-300",
        }

    return {
        label: "Very Unhealthy",
        className: "border-purple-200 bg-purple-50 text-purple-700",
    }
}

const getFloodSeverity = (value: number | null) => {
    if (value == null || Number.isNaN(value)) return null
    const statusMap: Record<number, { label: string; className: string }> = {
        0: {
            label: "Normal",
            className: "border-success-100/40 bg-success-100/5 text-success-300",
        },
        1: {
            label: "Flooded",
            // className: "border-warning-200/20 bg-warning-100/5 text-warning-300",
            className: "border-danger-100/10 bg-danger-100/5 text-danger-300",
        },
    }

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
            className={cn("font-medium whitespace-nowrap", severity.className)}
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
