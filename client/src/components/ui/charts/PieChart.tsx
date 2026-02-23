"use client"

import { Pie, PieChart } from "recharts"

import MetaTooltip from "@/components/ui/GlobalComponents/tooltips/MetaTooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/shadcn/chart"
import { GroupExplanationItem } from "@/features/environment/week/week.types"
import { getInitials, toProperCase } from "@/lib/utils"
import { useThemeStore } from "@/stores/map/use-theme"
import { HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"

type Props = {
    items: GroupExplanationItem[]
    healthOutcome: keyof IHealthOutcomes
}
export default function GroupPieChart({ items, healthOutcome }: Props) {
    const [metadata, setMetadata] =
        useState<Record<string, { title: string; description: string }>>()
    const { getSampledColors } = useThemeStore()

    useEffect(() => {
        const fetchMetadata = async () => {
            const data = await fetch(`/simulation/metadata/groups.json`).then((res) => res.json())
            setMetadata(data)
        }
        fetchMetadata()
    }, [])

    const label = toProperCase(healthOutcome)
    const chartData = structuredClone(items)

    if (!chartData || chartData.length === 0) return null

    // Check if their percentages not close to 100% then add {Others} with the remaining
    const total = chartData.reduce((acc, item) => acc + item.percent, 0)

    if (Math.abs(total - 100) > 0.05) chartData.push({ group: "Others", percent: 100 - total })

    const colors = getSampledColors(chartData.length)
    const sortedData = chartData.map((item, index) => ({
        ...item,
        group: metadata?.[item.group]?.title || item.group,
        initials: getInitials(metadata?.[item.group]?.title || item.group),
        description: metadata?.[item.group]?.description || "No Description",
        fill: colors[index % colors.length], // Add the fill color
    }))

    const chartConfig = sortedData.reduce<ChartConfig>(
        (acc, item, index) => {
            acc[item.group] = {
                label: metadata?.[item.group]?.title || item.group,
                color: colors[index % colors.length],
            }
            return acc
        },
        {
            percent: { label },
        }
    )

    return (
        <Card className="border-none bg-transparent shadow-none">
            <CardHeader className="flex flex-row justify-between pt-4 pb-0">
                <CardTitle className="text-lg font-semibold">{label}</CardTitle>
                {/* help icon */}
                <MetaTooltip
                    title="Impact by Category"
                    description={
                        <div className="text-muted-foreground mt-2 text-xs">
                            The circle is divided into slices, where each slice represents a group.
                            <br /> <br />
                            The size of a slice corresponds to its
                            <strong> percentage value.</strong>
                            <br />
                            <br />
                            <strong>Hover on the colored indicators</strong> below to identify each
                            group.
                        </div>
                    }
                    trigger={
                        <HelpCircle className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                    }
                />
            </CardHeader>
            <CardContent className="p-0 pb-4">
                <ChartContainer config={chartConfig} className="mx-auto h-38 w-38">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null

                                const { name, value } = payload[0]

                                return (
                                    <div className="glassy max-w-sm rounded-xl p-2 shadow-xl">
                                        <p className="text-sm">
                                            <span className="font-semibold">
                                                {chartConfig[name].label}
                                            </span>
                                            <span>: {value.toFixed(2)}%</span>
                                        </p>
                                    </div>
                                )
                            }}
                        />
                        <Pie data={sortedData} dataKey="percent" nameKey="group" />
                    </PieChart>
                </ChartContainer>
                <div className="flex justify-center gap-2">
                    {sortedData.map((item) => {
                        return (
                            <MetaTooltip
                                key={item.group}
                                title={item.group}
                                description={item.description}
                                bgColor={chartConfig[item.group]?.color}
                                initial={item.initials}
                            />
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
