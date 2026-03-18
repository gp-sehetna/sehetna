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
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn/chart"
import { Separator } from "@/components/ui/shadcn/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs"
import { Forecasts } from "@/features/environment/prediction/prediction.dto"
import { cn, slugify, toProperCase } from "@/lib/utils"
import { HEALTH_OUTCOMES_KEYS, HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { blue, darkBlue, getPrimaryColor, green, mix, red } from "@/shared/config/map-colors"
import { PredictionTypeEnum } from "@/shared/db/enums/prediction.enum"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { format } from "date-fns"
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
import { Dispatch, useMemo } from "react"
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"

interface FormattedPoint {
    dates: {
        simple: string
        full: string
    }
    predictionType: PredictionTypeEnum
    point: number
    lower: number
    upper: number
    range: [number, number] | undefined
}

type OutcomeMeta = Readonly<
    Record<HealthOutcomesKeys, ChartConfig[keyof ChartConfig] & { unit: string }>
>

function formatForecastData(forecasts: Forecasts, category: HealthOutcomesKeys): FormattedPoint[] {
    return forecasts.map((forecastEntry) => {
        const { point, lower, upper } = forecastEntry.health_outcomes[category]
        const baseDate = new Date(forecastEntry.base_date)
        const lowerBound = lower ?? point
        const upperBound = upper ?? point

        return {
            dates: {
                simple: format(baseDate, "MMM, yy"),
                full: format(baseDate, "EE, d MMM yyyy"),
            },
            predictionType: forecastEntry.prediction_type,
            point: Number(point.toFixed(2)),
            lower: Number(lowerBound.toFixed(2)),
            upper: Number(upperBound.toFixed(2)),
            range:
                lower != null || upper != null
                    ? [Number(lowerBound.toFixed(2)), Number(upperBound.toFixed(2))]
                    : undefined,
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

    if (first === 0) return { direction: "flat", pct: 0 }

    const pct = ((last - first) / first) * 100
    if (Math.abs(pct) < 0.5) return { direction: "flat", pct }

    return { direction: pct > 0 ? "up" : "down", pct }
}

type TrendBadgeProps = {
    direction: "up" | "down" | "flat"
    pct: number
    className?: string
}

function TrendBadge({ direction, pct, className }: TrendBadgeProps) {
    if (direction === "flat")
        return (
            <Badge
                variant="muted"
                className={cn("gap-1 text-xs font-medium select-none", className)}
            >
                <Minus className="h-3 w-3" />
                Stable
            </Badge>
        )

    return (
        <Badge
            className={cn(
                "gap-1 text-xs font-medium select-none",
                className,
                direction === "up"
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                    : "bg-success/10 text-success hover:bg-success/20 hover:text-success"
            )}
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

type OutcomeCardProps = {
    OUTCOME_META: OutcomeMeta
    outcomeKey: HealthOutcomesKeys
    data: FormattedPoint[]
    isSelected: boolean
    onClick: Dispatch<string>
}

function OutcomeCard({ OUTCOME_META, outcomeKey, onClick, data, isSelected }: OutcomeCardProps) {
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
            className={cn(
                "glassy cursor-pointer bg-transparent transition-all duration-200 hover:shadow-md",
                isSelected ? "ring-primary-200 shadow-md ring-2" : "hover:ring-border hover:ring-1"
            )}
            onClick={() => onClick(slugify(outcomeKey))}
        >
            <CardHeader className="px-4 pt-4 pb-2">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                            {Icon && <Icon className="h-4 w-4" stroke={meta.color} />}
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

            <CardContent className="px-4 pt-2 pb-2">
                <div className="mb-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{lastPoint}</span>
                    <span className="text-muted-foreground text-xs">{meta.unit}</span>
                </div>

                <ChartContainer config={chartConfig} className="h-15 w-full">
                    <ComposedChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        {hasCI && (
                            <Area
                                dataKey="range"
                                fill={meta.color}
                                fillOpacity={0.15}
                                stroke="none"
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="point"
                            stroke={meta.color}
                            strokeWidth={1.5}
                            dot={false}
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

type DetailedForecastChartProps = {
    OUTCOME_META: OutcomeMeta
    data: FormattedPoint[]
    outcomeKey: HealthOutcomesKeys
}

function DetailedForecastChart({ OUTCOME_META, data, outcomeKey }: DetailedForecastChartProps) {
    const meta = OUTCOME_META[outcomeKey]
    const hasCI = data[0]?.range !== undefined

    const chartConfig: ChartConfig = {
        point: { label: "Forecast Point", color: meta.color },
        ...(hasCI && {
            range: { label: "Confidence Interval", color: meta.color },
        }),
    }

    return (
        <ChartContainer config={chartConfig} className="h-80 w-full">
            <ComposedChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3 1 3" />

                <XAxis
                    dataKey="dates.simple"
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground text-[10px]"
                />
                <YAxis
                    domain={["auto", "auto"]}
                    tickLine={false}
                    axisLine={false}
                    width={42}
                    className="text-muted-foreground text-[10px]"
                />
                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(_, payload) => {
                                const point = payload?.[0]?.payload as FormattedPoint | undefined
                                if (!point) return _

                                return `${point.dates.full} • ${toProperCase(point.predictionType)}`
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
                        name="CI"
                    />
                )}
                <Line
                    type="monotone"
                    dataKey="point"
                    stroke={meta.color}
                    dot={{ r: 2, fill: meta.color, strokeWidth: 0 }}
                    activeDot={{ r: 4, strokeWidth: 1, stroke: "hsl(var(--background))" }}
                    name="Forecast"
                />
                {hasCI && <ChartLegend content={<ChartLegendContent />} />}
            </ComposedChart>
        </ChartContainer>
    )
}

type ForecastDashboardProps = {
    onCardClick: Dispatch<string>
    forecasts: Forecasts
}

export function ForecastDashboard({ forecasts, onCardClick }: ForecastDashboardProps) {
    const healthOutcome = usePredictionsStore((s) => s.healthOutcome)

    const OUTCOME_META: OutcomeMeta = {
        respiratory_disease_rate: {
            label: "Respiratory Disease",
            unit: "rate",
            icon: Wind,
            color: getPrimaryColor(darkBlue),
        },
        cardio_mortality_rate: {
            label: "Cardio Mortality",
            unit: "rate",
            icon: Heart,
            color: getPrimaryColor(mix),
        },
        vector_disease_risk_score: {
            label: "Vector Disease Risk",
            unit: "score",
            icon: Bug,
            color: getPrimaryColor(green),
        },
        waterborne_disease_incidents: {
            label: "Waterborne Disease",
            unit: "incidents",
            icon: Droplets,
            color: getPrimaryColor(blue),
        },
        heat_related_admissions: {
            label: "Heat Admissions",
            unit: "admissions",
            icon: Thermometer,
            color: getPrimaryColor(red),
        },
    }

    const formattedByOutcome = useMemo(
        () =>
            Object.fromEntries(
                HEALTH_OUTCOMES_KEYS.map((key) => [key, formatForecastData(forecasts, key)])
            ) as Record<HealthOutcomesKeys, FormattedPoint[]>,
        [forecasts]
    )

    const data = formattedByOutcome[healthOutcome]
    const meta = OUTCOME_META[healthOutcome]
    const trend = getTrend(data)
    const Icon = meta.icon

    if (!forecasts.length) {
        return (
            <div className="text-muted-foreground py-8 text-center text-sm">
                No prediction timeline is available for this model yet.
            </div>
        )
    }

    return (
        <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
                <p className="text-muted-foreground my-2 text-xs">
                    Click a card to select it, then switch to Details for a full breakdown.
                </p>
                <div className="grid grid-cols-1 gap-2">
                    {HEALTH_OUTCOMES_KEYS.map((key) => (
                        <OutcomeCard
                            key={key}
                            OUTCOME_META={OUTCOME_META}
                            outcomeKey={key}
                            data={formattedByOutcome[key]}
                            isSelected={healthOutcome === key}
                            onClick={onCardClick}
                        />
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
                <p className="text-muted-foreground mt-2 mb-1 text-xs">
                    Full breakdown of the timeline for {meta.label} {meta.unit}.
                </p>
                <Card className="glassy bg-transparent">
                    <CardHeader className="p-4">
                        <div className="flex items-center gap-4">
                            {Icon && (
                                <Icon className="flex-basis-1/4 h-4 w-4" stroke={meta.color} />
                            )}
                            <div className="flex-basis-1/2 grow flex-col">
                                <CardTitle className="text-base">{meta.label}</CardTitle>
                                <CardDescription>
                                    {data[0]?.range
                                        ? "Timeline with confidence interval"
                                        : "Timeline point with no confidence bounds available"}
                                </CardDescription>
                            </div>
                            <TrendBadge
                                className="h-6 place-self-start"
                                direction={trend.direction}
                                pct={trend.pct}
                            />
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="p-4">
                        <DetailedForecastChart
                            OUTCOME_META={OUTCOME_META}
                            data={data}
                            outcomeKey={healthOutcome}
                        />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
