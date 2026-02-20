"use client"

import MetaTooltip from "@/components/ui/GlobalComponents/tooltips/MetaTooltip"
import WaterfallTooltip from "@/components/ui/GlobalComponents/tooltips/WaterfallTooltip"
import { Badge } from "@/components/ui/shadcn/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { CumulativeExplanationItem, Prediction } from "@/features/environment/week/week.types"
import { buildWaterfallData, toProperCase } from "@/lib/utils"
import { HelpCircle } from "lucide-react"
import { useMemo } from "react"
import {
    Bar,
    CartesianGrid,
    Cell,
    ComposedChart,
    Tooltip as RechartsTooltip,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts"

interface ShapWaterfallChartProps {
    items: CumulativeExplanationItem[]
    healthOutcome: keyof Prediction
}

export function WaterfallChart({ items, healthOutcome }: ShapWaterfallChartProps) {
    const waterfallData = useMemo(() => buildWaterfallData(items ?? []), [items])

    const label = toProperCase(healthOutcome)
    const allValues = waterfallData.flatMap((d) => [d.from, d.to])
    const yMin = Math.floor(Math.min(...allValues) * 0.98)
    const yMax = Math.ceil(Math.max(...allValues) * 1.02)

    const baseline = waterfallData[0].base ?? 0
    const finalValue = waterfallData[waterfallData.length - 1]?.to ?? 0
    const totalShift = finalValue - baseline
    const isNetPositive = totalShift >= 0

    return (
        <Card className="w-full border-0 bg-transparent">
            <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <CardTitle className="text-lg font-semibold">{label}</CardTitle>
                    <MetaTooltip
                        title="Cumulative Explanation"
                        description="How each feature contributed to shifting the model prediction from its
                            baseline."
                        trigger={
                            <HelpCircle className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                        }
                    />
                </div>

                {/* Summary badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="outline" className="font-mono text-xs">
                        Baseline: {baseline.toFixed(3)}
                    </Badge>
                    <Badge className="font-mono text-xs">Final: {finalValue.toFixed(3)}</Badge>
                    <Badge
                        variant="outline"
                        className={`font-mono text-xs ${
                            isNetPositive
                                ? "border-rose-400 text-rose-500"
                                : "border-emerald-400 text-emerald-500"
                        }`}
                    >
                        Net {isNetPositive ? "▲" : "▼"} {Math.abs(totalShift).toFixed(3)}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-2 pb-4">
                <div className="text-muted-foreground mt-1 mb-4 flex items-center justify-center gap-4 text-xs">
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-sm bg-rose-500 opacity-85" />
                        Increases prediction
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-sm bg-emerald-500 opacity-85" />
                        Decreases prediction
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="bg-primary inline-block h-3 w-3 rounded-sm" />
                        Final value
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={420}>
                    <ComposedChart
                        data={waterfallData}
                        margin={{ top: 8, right: 16, left: 8, bottom: 80 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                            opacity={0.6}
                        />

                        <XAxis
                            dataKey="feature"
                            tick={{
                                fontSize: 11,
                                fill: "hsl(var(--muted-foreground))",
                            }}
                            angle={-40}
                            textAnchor="end"
                            interval={0}
                            tickLine={false}
                            axisLine={{ stroke: "hsl(var(--border))" }}
                        />

                        <YAxis
                            domain={[yMin, yMax]}
                            tick={{
                                fontSize: 11,
                                fill: "hsl(var(--muted-foreground))",
                            }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => v.toFixed(1)}
                        />

                        <RechartsTooltip
                            content={<WaterfallTooltip />}
                            cursor={{ opacity: 0.08 }}
                        />

                        {/* Baseline reference */}
                        <ReferenceLine
                            y={baseline}
                            stroke="hsl(var(--primary))"
                            strokeDasharray="4 4"
                            strokeWidth={3}
                            label={{
                                value: "Baseline",
                                fontSize: 10,
                                fill: "hsl(var(--primary-foreground))",
                            }}
                        />

                        {/* Invisible spacer bar to offset the visible bar */}
                        <Bar dataKey="base" stackId="waterfall" fill="transparent" />

                        {/* Visible bar */}
                        <Bar dataKey="value" stackId="waterfall" radius={[3, 3, 0, 0]}>
                            {waterfallData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={
                                        entry.isLast
                                            ? "hsl(var(--primary))"
                                            : entry.direction === "Increase"
                                              ? "hsl(347 80% 60%)" // rose for positive
                                              : "hsl(152 60% 48%)" // emerald for negative
                                    }
                                    opacity={entry.isLast ? 1 : 0.85}
                                />
                            ))}
                        </Bar>
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
