"use client"

import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, ChartConfig } from "@/components/ui/shadcn/chart"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/shadcn/tooltip"
import { LucideIcon } from "lucide-react"

type RadialChartProps = {
    value: number | string
    max?: number
    color: string
    chartLabel: string
    Icon: LucideIcon
    tooltip: string
}

export function RadialChart({
    value,
    max = 100,
    color,
    chartLabel,
    tooltip,
    Icon,
}: RadialChartProps) {
    const startAngle = 65
    const maxSweep = 310

    const safeValue = Math.min(Math.max(Number(value), 0), max)

    const sweep = (safeValue / max) * maxSweep
    const endAngle = startAngle - sweep

    const chartData = [
        {
            name: chartLabel,
            value: safeValue,
            fill: color,
        },
    ]
    const chartConfig = {
        value: {
            label: chartLabel,
        },
        metric: {
            label: chartLabel,
            color: color,
        },
    } satisfies ChartConfig

    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-40 w-full">
            <RadialBarChart
                data={chartData}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={40}
                outerRadius={50}
            >
                <PolarGrid
                    gridType="circle"
                    stroke="none"
                    className="last:fill-background/30"
                    polarRadius={[20, 45]}
                />

                <RadialBar dataKey="value" background cornerRadius={10} />

                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (!viewBox || !("cx" in viewBox)) return null

                            const centerX = viewBox.cx
                            const centerY = viewBox.cy
                            const size = 28
                            const posX = centerX - size / 2
                            const posY = centerY - 58

                            return (
                                <>
                                    <foreignObject x={posX} y={posY} width={size} height={size}>
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="glassy flex h-full w-full cursor-pointer items-center justify-center rounded-full p-0.5 shadow-2xl">
                                                        <Icon
                                                            size={size - 10}
                                                            className="hover:text-neutral-1000 text-neutral-800"
                                                        />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    className="glassy text-neutral-1000 bg-background/75 max-w-3xs whitespace-pre-line"
                                                    side="top"
                                                >
                                                    {tooltip}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </foreignObject>
                                    <text
                                        x={centerX}
                                        y={centerY}
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                    >
                                        <tspan
                                            x={centerX}
                                            y={centerY}
                                            className="fill-foreground text-2xl font-bold"
                                        >
                                            {safeValue}
                                        </tspan>

                                        <tspan
                                            x={centerX}
                                            y={centerY + 60}
                                            className="fill-foreground text-xs font-bold"
                                        >
                                            {chartLabel}
                                        </tspan>
                                    </text>
                                </>
                            )
                        }}
                    />
                </PolarRadiusAxis>
            </RadialBarChart>
        </ChartContainer>
    )
}
