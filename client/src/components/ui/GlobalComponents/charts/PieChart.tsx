"use client"

import { Pie, PieChart } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/shadcn/chart"
import { toProperCase } from "@/lib/utils"
import { CurrHealthOutcomePreds } from "@/shared/types/map"

export const description = "A simple pie chart"

export default function AppPieChart({ items }: { items: CurrHealthOutcomePreds }) {
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

    const healthOutcome = toProperCase(items.healthOutcome)

    const chartData = items.contributors

    if (!chartData || chartData.length === 0) return null

    const sortedData = [...chartData]
        .sort((a, b) => b.percent - a.percent) // highest first
        .map((item, index) => ({
            ...item,
            fill: pieColors[index % pieColors.length],
        }))

    const chartConfig: ChartConfig = sortedData.reduce(
        (acc, item, index) => {
            acc[item.group] = {
                label: item.group,
                color: pieColors[index % pieColors.length],
            }
            return acc
        },
        {
            percent: { label: healthOutcome }, // main key
        } as ChartConfig
    )

    return (
        <Card className="flex flex-col border-0 bg-transparent">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    <h6>{healthOutcome}</h6>
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
