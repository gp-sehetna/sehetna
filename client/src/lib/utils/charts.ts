import { CumulativeExplanationItem, WaterfallItem } from "@/features/environment/week/week.types"
import { toProperCase } from "@/lib/utils/string"

function buildWaterfallData(entries: CumulativeExplanationItem[]) {
    return entries.map((entry, i): WaterfallItem => {
        const isLast = i === entries.length - 1,
            low = Math.min(entry.from, entry.to),
            high = Math.max(entry.from, entry.to)
        return {
            feature: toProperCase(entry.feature),
            base: low,
            value: high - low,
            shap: entry.shap,
            from: entry.from,
            to: entry.to,
            direction: entry.direction,
            isLast,
        }
    })
}

export { buildWaterfallData }
