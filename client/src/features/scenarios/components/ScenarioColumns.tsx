"use client"

import { Button } from "@/components/ui/shadcn/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/shadcn/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/shadcn/tooltip"
import {
    formatCurrency,
    formatInteger,
    formatNumber,
    getAqiSeverity,
    getFloodSeverity,
    missingValue,
    SeverityBadge,
} from "@/features/scenarios/scenario.formatters"
import type { Scenario } from "@/features/scenarios/scenario.types"
import { formatDate } from "@/lib/utils/date"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import type { ColumnDef } from "@tanstack/react-table"
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

type ScenarioColumnActions = {
    canDelete: (row: Scenario) => boolean
    onAddNote: (row: Scenario) => void
    onDelete: (row: Scenario) => void
    onViewDetails: (row: Scenario) => void
}

const valueOrMissing = (value: string | null) => value ?? missingValue()

const healthOutcomeSummary = (row: Scenario) => {
    const respiratory = formatNumber(
        row.prediction_id.health_outcomes.respiratory_disease_rate.point,
        "%"
    )
    const cardio = formatNumber(row.prediction_id.health_outcomes.cardio_mortality_rate.point, "%")

    return respiratory || cardio
        ? `${respiratory ?? "N/A"} resp. / ${cardio ?? "N/A"} cardio`
        : null
}
// TODO: columns like `undernourishment`, `food_production_index` are missing @Mahmoudamin11
const createScenarioColumns = ({
    canDelete,
    onAddNote,
    onDelete,
    onViewDetails,
}: ScenarioColumnActions): ColumnDef<Scenario>[] => [
    {
        accessorKey: "baseDate",
        header: "Base Date",
        cell: ({ row }) =>
            formatDate(row.original.base_date, { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
        accessorKey: "location_id.name",
        header: "Location",
        cell: ({ row }) => row.original.location_id.name || missingValue("Unknown"),
    },
    {
        accessorFn: (row) => row.climate.temperature_celsius,
        id: "climate.temperature_celsius",
        header: "Temperature",
        cell: ({ row }) =>
            valueOrMissing(formatNumber(row.original.climate.temperature_celsius, "°C")),
    },
    {
        accessorFn: (row) => row.climate.precipitation_mm,
        id: "climate.precipitation_mm",
        header: "Precipitation",
        cell: ({ row }) =>
            valueOrMissing(formatNumber(row.original.climate.precipitation_mm, "mm")),
    },
    {
        accessorFn: (row) => row.climate.heat_wave_days,
        id: "climate.heat_wave_days",
        header: "Heat Wave Days",
        cell: ({ row }) =>
            valueOrMissing(formatInteger(row.original.climate.heat_wave_days, "days")),
    },
    {
        accessorFn: (row) => row.climate.flood_indicator,
        id: "climate.flood_indicator",
        header: "Flood Indicator",
        cell: ({ row }) => (
            <SeverityBadge severity={getFloodSeverity(row.original.climate.flood_indicator)} />
        ),
    },
    {
        accessorFn: (row) => row.air_quality.pm25_ugm3,
        id: "air_quality.pm25_ugm3",
        header: "PM2.5",
        cell: ({ row }) =>
            valueOrMissing(formatNumber(row.original.air_quality.pm25_ugm3, "µg/m³")),
    },
    {
        accessorFn: (row) => row.air_quality.aqi_pm,
        id: "air_quality.aqi_pm",
        header: "AQI",
        cell: ({ row }) => (
            <SeverityBadge severity={getAqiSeverity(row.original.air_quality.aqi_pm)} />
        ),
    },
    {
        accessorFn: (row) => row.health_indicators.food_production_index,
        id: "health_indicators.food_production_index",
        header: "Food Security Index",
        cell: ({ row }) =>
            valueOrMissing(formatNumber(row.original.health_indicators.food_production_index)),
    },
    {
        accessorFn: (row) => row.health_indicators.gdp_per_capita_usd,
        id: "health_indicators.gdp_per_capita_usd",
        header: "GDP Per Capita",
        cell: ({ row }) =>
            valueOrMissing(formatCurrency(row.original.health_indicators.gdp_per_capita_usd)),
    },
    {
        id: "notes",
        header: "Notes",
        enableSorting: false,
        cell: ({ row }) =>
            row.original.note ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <FileText className="text-primary size-4" aria-label="Note present" />
                    </TooltipTrigger>
                    <TooltipContent>{row.original.note}</TooltipContent>
                </Tooltip>
            ) : (
                <Button
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddNote(row.original)
                    }}
                >
                    Add Note
                </Button>
            ),
    },
    {
        id: "prediction_id.health_outcomes",
        header: "Health Outcomes",
        enablePinning: true,
        enableSorting: false,
        size: 220,
        cell: ({ row }) => {
            const summary = healthOutcomeSummary(row.original)
            if (!summary) return missingValue()

            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex max-w-44 cursor-help truncate">{summary}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <div className="space-y-1">
                            {HEALTH_OUTCOMES_KEYS.map((key) => (
                                <p key={key}>
                                    {key.replaceAll("_", " ")}:{" "}
                                    {formatNumber(
                                        row.original.prediction_id.health_outcomes[key].point
                                    ) ?? "N/A"}
                                </p>
                            ))}
                        </div>
                    </TooltipContent>
                </Tooltip>
            )
        },
    },

    {
        id: "actions",
        header: "Actions",
        enablePinning: true,
        enableSorting: false,
        size: 72,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                    <Button variant="ghost" size="icon" aria-label="Open row actions">
                        <MoreHorizontal className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="min-w-64"
                    align="end"
                    onClick={(event) => event.stopPropagation()}
                >
                    <DropdownMenuLabel>Observation</DropdownMenuLabel>
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
                            <FileText />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddNote(row.original)}>
                            <Pencil />
                            Add Note
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={!canDelete(row.original)}
                            onClick={() => onDelete(row.original)}
                        >
                            <Trash2 />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]

export { createScenarioColumns }
