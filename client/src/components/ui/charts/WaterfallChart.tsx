"use client"

import MetaTooltip from "@/components/ui/GlobalComponents/tooltips/MetaTooltip"
import WaterfallTooltip from "@/components/ui/GlobalComponents/tooltips/WaterfallTooltip"
import { Badge } from "@/components/ui/shadcn/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { CumulativeExplanationItem } from "@/features/environment/week/week.types"
import { buildWaterfallData, toProperCase } from "@/lib/utils"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { HelpCircle } from "lucide-react"
import { useMemo } from "react"
import {
    Bar,
    BarShapeProps,
    CartesianGrid,
    ComposedChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

interface ShapWaterfallChartProps {
    items: CumulativeExplanationItem[]
    healthOutcome: keyof IHealthOutcomes
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
                        Baseline {baseline.toFixed(3)}
                    </Badge>
                    <Badge className="font-mono text-xs">Final {finalValue.toFixed(3)}</Badge>
                    <Badge
                        variant="outline"
                        className={`font-mono text-xs ${
                            isNetPositive
                                ? "border-emerald-400 text-emerald-500"
                                : "border-rose-400 text-rose-500"
                        }`}
                    >
                        Net {isNetPositive ? "▲" : "▼"} {Math.abs(totalShift).toFixed(3)}
                    </Badge>
                </div>
            </CardHeader>

            {/* Legend above chart to define colors for increase and decrease */}
            <CardContent className="-ml-8 px-0 pt-2 pb-4">
                <div className="mb-4 flex justify-center">
                    <div className="bg-muted/40 border-border flex items-center gap-2 rounded-lg border px-4 py-1 text-xs backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-rose-500 opacity-90" />
                            <span className="text-muted-foreground">Increases prediction</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-emerald-500 opacity-90" />
                            <span className="text-muted-foreground">Decreases prediction</span>
                        </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart
                        data={waterfallData}
                        margin={{ top: 8, right: 32, left: 32, bottom: 40 }}
                    >
                        <CartesianGrid strokeDasharray="3 3 1 3" opacity={0.4} />

                        <XAxis
                            dataKey="feature"
                            tickLine={false}
                            axisLine={false}
                            angle={-65}
                            textAnchor="middle"
                            interval={0}
                        />

                        <YAxis
                            domain={[yMin, yMax]}
                            axisLine={false}
                            tickFormatter={(v) => v.toFixed(0)}
                        />

                        <Tooltip
                            content={({ active, payload }) => WaterfallTooltip({ active, payload })}
                            wrapperStyle={{ outline: "none" }}
                        />

                        {/* Baseline reference */}
                        <ReferenceLine
                            y={baseline}
                            strokeDasharray="4 4"
                            strokeWidth={4}
                            opacity={0.75}
                            label={{
                                value: "Baseline",
                                position: "insideTopLeft",
                                fontSize: 10,
                            }}
                        />

                        {/* Invisible spacer bar to offset the visible bar */}
                        <Bar dataKey="base" stackId="waterfall" fill="transparent" />

                        {/* Visible bar */}
                        <Bar
                            dataKey="value"
                            stackId="waterfall"
                            shape={({ x, y, width, height, payload }: BarShapeProps) => {
                                const fill = payload?.isLast
                                    ? "hsl(var(--primary))"
                                    : payload?.direction === "Increase"
                                      ? "hsl(152 60% 48%)"
                                      : "hsl(347 80% 60%)"

                                return (
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        fill={fill}
                                        opacity={payload?.isLast ? 1 : 0.9}
                                        rx={6}
                                    />
                                )
                            }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
