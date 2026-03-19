"use client"

import { Card, CardContent } from "@/components/ui/shadcn/card"
import { cn } from "@/lib/utils"
import { spreadOverDomain } from "@/lib/utils/array"
import { useThemeStore } from "@/stores/map/use-theme"

type HorizontalColorbarProps = {
    ticks?: number
    className?: string
}

export default function HorizontalColorbar({ ticks = 5, className }: HorizontalColorbarProps) {
    const { theme } = useThemeStore()
    const tickValues = spreadOverDomain(theme.domain, ticks)

    return (
        <Card className={cn("w-full border-none bg-transparent shadow-none", className)}>
            <CardContent className="flex flex-col gap-1 p-2">
                <div
                    className="h-2 w-full rounded-full"
                    style={{
                        background: theme.gradientCSS,
                    }}
                />
                <div className="text-muted-foreground flex justify-between text-xs font-medium select-none">
                    {tickValues.map((value) => (
                        <small key={value}>{Math.round(value)}</small>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
