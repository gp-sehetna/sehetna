import { Button } from "@/components/ui/shadcn/button"
import { Card } from "@/components/ui/shadcn/card"
import { cn, toProperCase, unslugify } from "@/lib/utils"
import { HEALTH_OUTCOMES_WITH_HYPHEN } from "@/shared/config/health-outcomes"
import { useThemeStore } from "@/stores/map/use-theme"
import { Check } from "lucide-react"
import { Dispatch } from "react"

export type LayerSelectorProps = {
    healthOutcome: string
    onLayerSelect: Dispatch<string>
    className?: string
}

const MapLayerSelector = ({ healthOutcome, onLayerSelect, className }: LayerSelectorProps) => {
    const { theme } = useThemeStore()
    return (
        <Card className={cn(className, "glassy bg-neutral-100/40")}>
            <div className="flex flex-col gap-0.5">
                {HEALTH_OUTCOMES_WITH_HYPHEN.map((outcome) => (
                    <Button
                        key={outcome}
                        onClick={() => onLayerSelect(outcome)}
                        variant={outcome === healthOutcome ? "glassy" : "text"}
                        size="sm"
                        style={{
                            backgroundColor:
                                outcome === healthOutcome ? `${theme.oceanColor}66` : undefined,
                        }}
                        className={cn(
                            "h-8 w-full justify-between px-2.5 text-sm font-normal",
                            outcome === healthOutcome
                                ? "text-foreground border-0 shadow-sm"
                                : "hover:bg-accent/40 hover:text-accent-foreground"
                        )}
                    >
                        <span className="truncate">{toProperCase(unslugify(outcome))}</span>
                        {outcome === healthOutcome && (
                            <Check className="ml-2 h-3.5 w-3.5 shrink-0" />
                        )}
                    </Button>
                ))}
            </div>
        </Card>
    )
}

export default MapLayerSelector
