"use client"
import { Card } from "@/components/ui/shadcn/card"
import { cn, toProperCase, unslugify } from "@/lib/utils"
import { HEALTH_OUTCOMES } from "@/shared/config/health-outcomes"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/shadcn/button"
import useMapHook from "@/hooks/map/use-map"

export type LayerSelectorProps = {
    healthOutcome: string
}

const MapLayerSelector = ({ healthOutcome }: LayerSelectorProps) => {
    const { onLayerSelect } = useMapHook()
    return (
        <Card className="mb-3 space-y-1 p-2">
            {HEALTH_OUTCOMES.map((outcome) => (
                <Button
                    key={outcome}
                    onClick={() => onLayerSelect(outcome)}
                    variant={outcome === healthOutcome ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                        "w-full justify-between font-normal",
                        outcome === healthOutcome && "bg-primary"
                    )}
                >
                    <span>{toProperCase(unslugify(outcome))}</span>
                    {outcome === healthOutcome && <Check className="h-4 w-4" />}
                </Button>
            ))}
        </Card>
    )
}

export default MapLayerSelector
