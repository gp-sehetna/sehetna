"use client"

import { Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn/chart"
import { Prediction } from "@/features/environment/week/week.types"
import { toProperCase } from "@/lib/utils"
import { Contributors } from "@/shared/types/map"

export const description = "A simple pie chart"

type Props = {
    contributors: Contributors
    healthOutcome: keyof Prediction
}
export default function AppPieChart({ contributors, healthOutcome }: Props) {
    const pieColors = [
        "#d55035", // darkest orange
        "#ff390c",
        "#ff581d",
        "#fd692d",
        "#fc793a",
        "#ef8470",
        "#fecefb",
        "#fee5ff",
    ]

    const label = toProperCase(healthOutcome)
    const chartData = structuredClone(contributors)

    if (!chartData || chartData.length === 0) return null

    // Check if their percentages not close to 100% then add {Others} with the remaining
    const total = chartData.reduce((acc, item) => acc + item.percent, 0)

    if (Math.abs(total - 100) > 0.05)
        chartData.push({
            group: "Others",
            percent: 100 - total,
            fill: pieColors[chartData.length % pieColors.length],
        } as any)

    const sortedData = [...chartData] // they are sorted already
        .map((item, index) => ({
            ...item,
            fill: pieColors[index % pieColors.length],
        }))

    const chartConfig = sortedData.reduce(
        (acc, item, index) => {
            acc[item.group] = {
                label: item.group,
                color: pieColors[index % pieColors.length],
            }
            return acc
        },
        {
            percent: { label }, // main key
        } as ChartConfig
    )

    return (
        <Card className="flex flex-col border-0 bg-transparent">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    <h6>{label}</h6>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={chartConfig} className="mx-auto h-52 w-52">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={sortedData} dataKey="percent" nameKey="group" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
