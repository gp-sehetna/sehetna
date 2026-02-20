import { Badge } from "@/components/ui/shadcn/badge"
import { WaterfallItem } from "@/features/environment/week/week.types"

const WaterfallTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const d: WaterfallItem = payload[0]?.payload
    if (!d) return null

    const isPositive = d.shap >= 0
    const colorClass = isPositive ? "text-rose-500" : "text-emerald-500"
    const borderClass = isPositive
        ? "border-rose-400 text-rose-500"
        : "border-emerald-400 text-emerald-500"

    return (
        <div className="bg-popover text-popover-foreground min-w-[200px] space-y-1.5 rounded-md border p-3 text-sm shadow-md">
            <p className="font-semibold">{d.feature}</p>
            {[
                {
                    label: "SHAP value",
                    value: `${isPositive ? "+" : ""}${d.shap.toFixed(4)}`,
                    className: `font-mono font-medium ${colorClass}`,
                },
                { label: "From", value: d.from.toFixed(3) },
                { label: "To", value: d.to.toFixed(3) },
            ].map(({ label, value, className }) => (
                <div key={label} className="text-muted-foreground flex justify-between gap-4">
                    <span>{label}</span>
                    <span className={`font-mono ${className ?? ""}`}>{value}</span>
                </div>
            ))}
            <Badge variant="outline" className={`mt-1 text-xs ${borderClass}`}>
                {d.direction}
            </Badge>
        </div>
    )
}

export default WaterfallTooltip
