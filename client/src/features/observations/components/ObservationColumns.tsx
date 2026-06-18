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
} from "@/features/observations/Observation.formatters"
import type { ScenarioObservation } from "@/features/observations/Observation.types"
import { formatDate } from "@/lib/utils/date"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import type { ColumnDef } from "@tanstack/react-table"
import { FileText, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

type ObservationColumnActions = {
    canDelete: (row: ScenarioObservation) => boolean
    onAddNote: (row: ScenarioObservation) => void
    onDelete: (row: ScenarioObservation) => void
    onViewDetails: (row: ScenarioObservation) => void
}

const valueOrMissing = (value: string | null) => value ?? missingValue()

const healthOutcomeSummary = (row: ScenarioObservation) => {
    const respiratory = formatNumber(row.healthOutcomes!.respiratory_disease_rate, "%")
    const cardio = formatNumber(row.healthOutcomes!.cardio_mortality_rate, "%")

    return respiratory || cardio
        ? `${respiratory ?? "N/A"} resp. / ${cardio ?? "N/A"} cardio`
        : null
}

const createObservationColumns = ({
    canDelete,
    onAddNote,
    onDelete,
    onViewDetails,
}: ObservationColumnActions): ColumnDef<ScenarioObservation>[] => [
    {
        accessorKey: "baseDate",
        header: "Base Date",
        cell: ({ row }) =>
            formatDate(row.original.baseDate, { day: "2-digit", month: "short", year: "numeric" }),
    },
    {
        accessorKey: "locationName",
        header: "Location",
        cell: ({ row }) => row.original.locationName || missingValue("Unknown"),
    },
    {
        accessorFn: (row) => row.climate.temperatureCelsius,
        id: "temperatureCelsius",
        header: "Temperature",
        cell: ({ row }) =>
            valueOrMissing(formatNumber(row.original.climate.temperatureCelsius, "°C")),
    },
    {
        accessorFn: (row) => row.climate.precipitationMm,
        id: "precipitationMm",
        header: "Precipitation",
        cell: ({ row }) => valueOrMissing(formatNumber(row.original.climate.precipitationMm, "mm")),
    },
    {
        accessorFn: (row) => row.climate.heatWaveDays,
        id: "heatWaveDays",
        header: "Heat Wave Days",
        cell: ({ row }) => valueOrMissing(formatInteger(row.original.climate.heatWaveDays, "days")),
    },
    {
        accessorFn: (row) => row.climate.floodIndicator,
        id: "floodIndicator",
        header: "Flood Indicator",
        cell: ({ row }) => (
            <SeverityBadge severity={getFloodSeverity(row.original.climate.floodIndicator)} />
        ),
    },
    {
        accessorFn: (row) => row.airQuality.pm25Ugm3,
        id: "pm25_ugm3",
        header: "PM2.5",
        cell: ({ row }) => valueOrMissing(formatNumber(row.original.airQuality.pm25Ugm3, "µg/m³")),
    },
    {
        accessorFn: (row) => row.airQuality.aqiPm,
        id: "aqi",
        header: "AQI",
        cell: ({ row }) => (
            <SeverityBadge severity={getAqiSeverity(row.original.airQuality.aqiPm)} />
        ),
    },
    // {
    //     accessorFn: (row) => row.healthIndicators.healthcareAccessIndex,
    //     id: "healthcareAccessIndex",
    //     header: "Healthcare Access Index",
    //     cell: ({ row }) =>
    //         valueOrMissing(formatNumber(row.original.healthIndicators.healthcareAccessIndex)),
    // },
    {
        accessorFn: (row) => row.healthIndicators.foodProductionIndex,
        id: "foodSecurityIndex",
        header: "Food Security Index",
        cell: ({ row }) =>
            valueOrMissing(formatNumber(row.original.healthIndicators.foodProductionIndex)),
    },
    {
        accessorFn: (row) => row.healthIndicators.gdpPerCapitaUsd,
        id: "gdpPerCapitaUsd",
        header: "GDP Per Capita",
        cell: ({ row }) =>
            valueOrMissing(formatCurrency(row.original.healthIndicators.gdpPerCapitaUsd)),
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
        id: "healthOutcomes",
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
                                    {formatNumber(row.original.healthOutcomes![key]) ?? "N/A"}
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

export { createObservationColumns }
export type { ObservationColumnActions }
