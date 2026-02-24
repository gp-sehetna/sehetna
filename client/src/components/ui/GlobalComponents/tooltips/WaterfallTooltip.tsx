import { Badge } from "@/components/ui/shadcn/badge"
import { WaterfallItem } from "@/features/environment/week/week.types"
import { cn } from "@/lib/utils"

const WaterfallTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d: WaterfallItem | undefined = payload[0]?.payload
    if (!d) return null

    const { shap, direction, feature, from, to } = d

    const isPositive = shap >= 0
    const colorClass = isPositive ? "text-emerald-500" : "text-rose-500"
    const borderClass = isPositive
        ? "border-emerald-400 text-emerald-500"
        : "border-rose-400 text-rose-500"

    const items = [
        {
            label: "Impact Value",
            value: `${isPositive ? "+" : ""}${shap.toFixed(4)}`,
            className: `font-mono font-medium ${colorClass}`,
        },
        { label: "From", value: from.toFixed(3) },
        { label: "To", value: to.toFixed(3) },
    ]
    return (
        <div className="bg-popover text-popover-foreground min-w-50 space-y-1.5 rounded-md border p-3 text-sm shadow-md">
            <p className="font-semibold">{feature}</p>
            {items.map(({ label, value, className }) => (
                <div key={label} className="text-muted-foreground flex justify-between gap-4">
                    <span>{label}</span>
                    <span className={cn("font-mono", className)}>{value}</span>
                </div>
            ))}
            <Badge variant="outline" className={`mt-1 text-xs ${borderClass}`}>
                {direction}
            </Badge>
        </div>
    )
}

export default WaterfallTooltip
