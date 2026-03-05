"use client"

import { Pie, PieChart } from "recharts"

import MetaTooltip from "@/components/ui/GlobalComponents/tooltips/MetaTooltip"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/shadcn/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/shadcn/chart"
import { GroupExplanationItem } from "@/features/environment/week/week.types"
import { getInitials, toProperCase } from "@/lib/utils"
import { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { useThemeStore } from "@/stores/map/use-theme"
import { HelpCircle } from "lucide-react"
import { useEffect, useState } from "react"

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

    const getTitle = (item: GroupExplanationItem) => {
        return metadata?.[item.group]?.title || item.group
    }

    const colors = getSampledColors(chartData.length)
    const sortedData = chartData.map((item, index) => ({
        ...item,
        group: getTitle(item),
        initials: getInitials(getTitle(item)),
        description: metadata?.[item.group]?.description || "No Description",
        fill: colors[index % colors.length], // Add the fill color
    }))

    const chartConfig = sortedData.reduce<ChartConfig>(
        (acc, item, index) => {
            acc[getTitle(item)] = {
                label: getTitle(item),
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
                <div>
                    <CardTitle className="text-lg font-semibold">{label}</CardTitle>
                    <CardDescription>Categories Impact Explanation</CardDescription>
                </div>
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

                                const item = payload[0]?.payload as GroupExplanationItem

                                return (
                                    <div className="glassy max-w-sm rounded-xl p-2 shadow-xl">
                                        <p className="text-sm">
                                            <span className="font-semibold">
                                                {chartConfig[getTitle(item)].label}
                                            </span>
                                            <span>: {item.percent.toFixed(2)}%</span>
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
                                side="bottom"
                                key={getTitle(item)}
                                title={getTitle(item)}
                                description={item.description}
                                bgColor={chartConfig[getTitle(item)]?.color}
                                initial={item.initials}
                            />
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
