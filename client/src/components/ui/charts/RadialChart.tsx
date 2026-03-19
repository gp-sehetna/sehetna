"use client"

import { ChartConfig, ChartContainer } from "@/components/ui/shadcn/chart"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover"
import { LucideIcon } from "lucide-react"
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

type RadialChartProps = {
    value: number | string
    max?: number
    color: string
    chartLabel: string
    Icon: LucideIcon
    tooltip?: string
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

    const helpSize = 28

    const IconElement = () => (
        <div className="glassy flex h-full w-full cursor-pointer items-center justify-center rounded-full p-0.5 shadow-2xl">
            <Icon size={helpSize - 10} className="hover:text-neutral-1000 text-neutral-800" />
        </div>
    )
    return (
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-35 w-full">
            <RadialBarChart
                data={chartData}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={30}
                outerRadius={35}
            >
                <PolarGrid
                    gridType="circle"
                    stroke="none"
                    className="last:fill-background/30"
                    polarRadius={[15, 32]}
                />

                <RadialBar dataKey="value" cornerRadius={10} />

                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                    <Label
                        content={({ viewBox }) => {
                            if (
                                !viewBox ||
                                !("cx" in viewBox) ||
                                !("cy" in viewBox) ||
                                !viewBox.cx ||
                                !viewBox.cy
                            )
                                return null

                            const centerX = viewBox.cx
                            const centerY = viewBox.cy
                            const posX = centerX - helpSize / 2
                            const posY = centerY - 50

                            return (
                                <>
                                    <foreignObject
                                        x={posX}
                                        y={posY}
                                        width={helpSize}
                                        height={helpSize}
                                    >
                                        tooltip ? (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                {<IconElement />}
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="glassy text-neutral-1000 bg-background/75 max-w-3xs text-xs whitespace-pre-line"
                                                side="top"
                                            >
                                                {tooltip}
                                            </PopoverContent>
                                        </Popover>
                                        ) : ( <IconElement /> )
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
                                            className="fill-foreground text-lg font-bold"
                                        >
                                            {safeValue}
                                        </tspan>

                                        <tspan
                                            x={centerX}
                                            y={centerY + 50}
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
