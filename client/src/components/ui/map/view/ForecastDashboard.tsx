"use client"

import { Badge } from "@/components/ui/shadcn/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/shadcn/select"
import { Separator } from "@/components/ui/shadcn/separator"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/shadcn/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs"
import { Forecasts } from "@/features/environment/forecast/forecast.dto"
import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import {
    Bug,
    Droplets,
    Heart,
    Minus,
    Thermometer,
    TrendingDown,
    TrendingUp,
    Wind,
} from "lucide-react"
import { useMemo, useState } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

interface FormattedPoint {
    date: string
    point: number
    lower: number
    upper: number
    range: [number, number] | undefined
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OUTCOME_META: Record<
    HealthOutcomesKeys,
    { label: string; unit: string; icon: React.ElementType; color: string }
> = {
    respiratory_disease_rate: {
        label: "Respiratory Disease",
        unit: "rate",
        icon: Wind,
        color: "hsl(221, 83%, 53%)",
    },
    cardio_mortality_rate: {
        label: "Cardio Mortality",
        unit: "rate",
        icon: Heart,
        color: "hsl(0, 72%, 51%)",
    },
    vector_disease_risk_score: {
        label: "Vector Disease Risk",
        unit: "score",
        icon: Bug,
        color: "hsl(142, 71%, 45%)",
    },
    waterborne_disease_incidents: {
        label: "Waterborne Disease",
        unit: "incidents",
        icon: Droplets,
        color: "hsl(199, 89%, 48%)",
    },
    heat_related_admissions: {
        label: "Heat Admissions",
        unit: "admissions",
        icon: Thermometer,
        color: "hsl(38, 92%, 50%)",
    },
}

const OUTCOME_KEYS = Object.keys(OUTCOME_META) as HealthOutcomesKeys[]

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatForecastData(
    forecasts: Forecasts["forecasts"],
    category: HealthOutcomesKeys
): FormattedPoint[] {
    const { point, lower, upper } = forecasts.health_outcomes[category]
    const baseDate = new Date(forecasts.base_date)
    const hasCI = lower.some((v) => v !== null)

    return point.map((val, i) => {
        const stepDate = new Date(baseDate)
        stepDate.setDate(baseDate.getDate() + i)

        const lo = lower[i] ?? val
        const hi = upper[i] ?? val

        return {
            date: stepDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            point: Number(val.toFixed(2)),
            lower: Number(lo.toFixed(2)),
            upper: Number(hi.toFixed(2)),
            range: hasCI ? [Number(lo.toFixed(2)), Number(hi.toFixed(2))] : undefined,
        }
    })
}

function getTrend(data: FormattedPoint[]): {
    direction: "up" | "down" | "flat"
    pct: number
} {
    if (data.length < 2) return { direction: "flat", pct: 0 }
    const first = data[0].point
    const last = data[data.length - 1].point
    const pct = ((last - first) / first) * 100
    if (Math.abs(pct) < 0.5) return { direction: "flat", pct }
    return { direction: pct > 0 ? "up" : "down", pct }
}

// ─── TrendBadge ───────────────────────────────────────────────────────────────

function TrendBadge({ direction, pct }: { direction: "up" | "down" | "flat"; pct: number }) {
    if (direction === "flat")
        return (
            <Badge variant="secondary" className="gap-1 text-xs font-medium">
                <Minus className="h-3 w-3" />
                Stable
            </Badge>
        )

    return (
        <Badge
            variant={direction === "up" ? "destructive" : "default"}
            className="gap-1 text-xs font-medium"
        >
            {direction === "up" ? (
                <TrendingUp className="h-3 w-3" />
            ) : (
                <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(pct).toFixed(1)}%
        </Badge>
    )
}

// ─── OutcomeCard (Sparkline) ──────────────────────────────────────────────────

function OutcomeCard({
    outcomeKey,
    data,
    isSelected,
    onClick,
}: {
    outcomeKey: HealthOutcomesKeys
    data: FormattedPoint[]
    isSelected: boolean
    onClick: () => void
}) {
    const meta = OUTCOME_META[outcomeKey]
    const trend = getTrend(data)
    const Icon = meta.icon
    const lastPoint = data[data.length - 1]?.point ?? 0
    const hasCI = data[0]?.range !== undefined

    const chartConfig = {
        point: { label: meta.label, color: meta.color },
    }

    return (
        <Card
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? "ring-primary shadow-md ring-2" : "hover:ring-border hover:ring-1"
            }`}
            onClick={onClick}
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${meta.color}18` }}
                        >
                            <Icon className="h-4 w-4" style={{ color: meta.color }} />
                        </div>
                        <div>
                            <CardTitle className="text-sm leading-tight font-semibold">
                                {meta.label}
                            </CardTitle>
                            <CardDescription className="text-xs capitalize">
                                {meta.unit}
                            </CardDescription>
                        </div>
                    </div>
                    <TrendBadge direction={trend.direction} pct={trend.pct} />
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="mb-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums">{lastPoint}</span>
                    <span className="text-muted-foreground text-xs">{meta.unit}</span>
                    {hasCI && (
                        <Badge variant="outline" className="ml-auto text-[10px]">
                            CI
                        </Badge>
                    )}
                </div>

                {/* Sparkline — axes hidden intentionally */}
                <ChartContainer config={chartConfig} className="h-15 w-full">
                    <ComposedChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        {hasCI && (
                            <Area
                                dataKey="range"
                                fill={meta.color}
                                fillOpacity={0.12}
                                stroke="none"
                                isAnimationActive={false}
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="point"
                            stroke={meta.color}
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

// ─── DetailedForecastChart ────────────────────────────────────────────────────

function DetailedForecastChart({
    data,
    outcomeKey,
}: {
    data: FormattedPoint[]
    outcomeKey: HealthOutcomesKeys
}) {
    const meta = OUTCOME_META[outcomeKey]
    const hasCI = data[0]?.range !== undefined

    const chartConfig = {
        point: { label: "Forecast", color: meta.color },
        ...(hasCI && { range: { label: "Confidence Interval", color: meta.color } }),
    }

    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground text-xs"
                />
                <YAxis
                    domain={["auto", "auto"]}
                    tickLine={false}
                    axisLine={false}
                    width={52}
                    className="text-muted-foreground text-xs"
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            formatter={(value, name, item) => {
                                if (name === "range") return null
                                const payload = item.payload as FormattedPoint
                                if (name === "point" && payload.range) {
                                    return [
                                        <span key="val" className="font-semibold">
                                            {Number(value).toFixed(2)}
                                            <span className="text-muted-foreground ml-2 text-xs font-normal">
                                                [{payload.lower} – {payload.upper}]
                                            </span>
                                        </span>,
                                        "Forecast",
                                    ]
                                }
                                return [Number(value).toFixed(2), "Forecast"]
                            }}
                        />
                    }
                />
                {hasCI && (
                    <Area
                        dataKey="range"
                        fill={meta.color}
                        fillOpacity={0.15}
                        stroke="none"
                        name="Confidence Interval"
                    />
                )}
                <Line
                    type="monotone"
                    dataKey="point"
                    stroke={meta.color}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: meta.color, strokeWidth: 0 }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: "hsl(var(--background))" }}
                    name="Forecast"
                />
                {hasCI && <ChartLegend content={<ChartLegendContent />} />}
            </ComposedChart>
        </ChartContainer>
    )
}

// ─── ForecastTable ────────────────────────────────────────────────────────────

function ForecastTable({ data }: { data: FormattedPoint[] }) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-25">Date</TableHead>
                        <TableHead className="text-right">Forecast</TableHead>
                        <TableHead className="text-right">Lower</TableHead>
                        <TableHead className="text-right">Upper</TableHead>
                        <TableHead className="text-right">CI Width</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => {
                        const hasCI = row.range !== undefined
                        const ciWidth = hasCI ? (row.range![1] - row.range![0]).toFixed(2) : null

                        return (
                            <TableRow key={row.date}>
                                <TableCell className="font-medium">{row.date}</TableCell>
                                <TableCell className="text-right font-semibold tabular-nums">
                                    {row.point}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-right tabular-nums">
                                    {hasCI ? (
                                        row.lower
                                    ) : (
                                        <span className="text-muted-foreground/50">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-right tabular-nums">
                                    {hasCI ? (
                                        row.upper
                                    ) : (
                                        <span className="text-muted-foreground/50">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {hasCI ? (
                                        <Badge variant="outline" className="font-mono text-xs">
                                            ±{(Number(ciWidth) / 2).toFixed(2)}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground/50">—</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export function ForecastDashboard({ forecasts }: { forecasts: Forecasts["forecasts"] }) {
    const [selectedOutcome, setSelectedOutcome] = useState<HealthOutcomesKeys>(
        "respiratory_disease_rate"
    )

    const formattedByOutcome = useMemo(
        () =>
            Object.fromEntries(
                OUTCOME_KEYS.map((key) => [key, formatForecastData(forecasts, key)])
            ) as Record<HealthOutcomesKeys, FormattedPoint[]>,
        [forecasts]
    )

    const selectedData = formattedByOutcome[selectedOutcome]
    const selectedMeta = OUTCOME_META[selectedOutcome]
    const selectedTrend = getTrend(selectedData)
    const SelectedIcon = selectedMeta.icon

    return (
        <div className="space-y-6">
            {/* Section header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight">Health Outcome Forecasts</h2>
                <p className="text-muted-foreground text-sm">
                    {forecasts.prediction_type === "forecasted" ? "AI-generated" : "Historical"}{" "}
                    predictions · base date{" "}
                    {new Date(forecasts.base_date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="grid w-full max-w-60 grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                {/* ── Overview ── */}
                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 gap-4">
                        {OUTCOME_KEYS.map((key) => (
                            <OutcomeCard
                                key={key}
                                outcomeKey={key}
                                data={formattedByOutcome[key]}
                                isSelected={selectedOutcome === key}
                                onClick={() => setSelectedOutcome(key)}
                            />
                        ))}
                    </div>
                    <p className="text-muted-foreground mt-3 text-xs">
                        Click a card to select it, then switch to Details for a full breakdown.
                    </p>
                </TabsContent>

                {/* ── Details ── */}
                <TabsContent value="details" className="mt-4 space-y-4">
                    {/* Outcome picker + trend */}
                    <div className="flex flex-wrap items-center gap-3">
                        <Select
                            value={selectedOutcome}
                            onValueChange={(v) => setSelectedOutcome(v as HealthOutcomesKeys)}
                        >
                            <SelectTrigger className="w-60">
                                <SelectValue placeholder="Select outcome" />
                            </SelectTrigger>
                            <SelectContent>
                                {OUTCOME_KEYS.map((key) => {
                                    const Icon = OUTCOME_META[key].icon
                                    return (
                                        <SelectItem key={key} value={key}>
                                            <div className="flex items-center gap-2">
                                                <Icon className="text-muted-foreground h-3.5 w-3.5" />
                                                {OUTCOME_META[key].label}
                                            </div>
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>

                        <TrendBadge direction={selectedTrend.direction} pct={selectedTrend.pct} />
                    </div>

                    {/* Chart card */}
                    <Card>
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                                    style={{ backgroundColor: `${selectedMeta.color}18` }}
                                >
                                    <SelectedIcon
                                        className="h-4 w-4"
                                        style={{ color: selectedMeta.color }}
                                    />
                                </div>
                                <div>
                                    <CardTitle className="text-base">
                                        {selectedMeta.label}
                                    </CardTitle>
                                    <CardDescription>
                                        {selectedData[0]?.range
                                            ? "Forecast with confidence interval"
                                            : "Point forecast — no confidence bounds available"}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-4">
                            <DetailedForecastChart
                                data={selectedData}
                                outcomeKey={selectedOutcome}
                            />
                        </CardContent>
                    </Card>

                    {/* Table card */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Raw Forecast Values
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Exact numeric values for each forecast step
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ForecastTable data={selectedData} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
