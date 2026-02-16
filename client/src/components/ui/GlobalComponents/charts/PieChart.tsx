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
import { useThemeStore } from "@/stores/map/use-theme"

export const description = "A simple pie chart"

type Props = {
    contributors: Contributors
    healthOutcome: keyof Prediction
}
export default function AppPieChart({ contributors, healthOutcome }: Props) {
    const { getSampledColors } = useThemeStore()

    const label = toProperCase(healthOutcome)
    const chartData = structuredClone(contributors)

    if (!chartData || chartData.length === 0) return null

    // Check if their percentages not close to 100% then add {Others} with the remaining
    const total = chartData.reduce((acc, item) => acc + item.percent, 0)

    if (Math.abs(total - 100) > 0.05) chartData.push({ group: "Others", percent: 100 - total })

    const colors = getSampledColors(chartData.length)
    const sortedData = chartData.map((item, index) => ({
        ...item,
        fill: colors[index % colors.length], // Add the fill color
    }))

    const chartConfig = sortedData.reduce(
        (acc, item, index) => {
            acc[item.group] = {
                label: item.group,
                color: colors[index % colors.length],
            }
            return acc
        },
        {
            percent: { label }, // main key
        } as ChartConfig
    )

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="items-center p-0 pt-4">
                <CardTitle>
                    <h6>{label}</h6>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <ChartContainer config={chartConfig} className="mx-auto h-38 w-38">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie data={sortedData} dataKey="percent" nameKey="group" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
