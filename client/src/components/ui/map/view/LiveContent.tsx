import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import { ModelSelector } from "@/components/ui/map/ModelSelector"
import { ForecastDashboard } from "@/components/ui/map/view/ForecastDashboard"
import { useForecasts } from "@/hooks/map/use-forecasts"
import { GeoJsonProperties } from "@/shared/config/map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import AppLink from "../../GlobalControls/AppLink"
import { MapDashboardProps } from "./MapDashboard"

export const NoPredictionsFallback = ({
    text,
    addLink = true,
}: {
    text: string
    addLink?: boolean
}) => {
    return (
        <div className="text-muted-foreground flex h-full max-w-120 flex-col items-center justify-center">
            <p className="text-center text-sm">
                {text}
                {addLink && (
                    <>
                        Got a data provider in mind? We’d love your{" "}
                        <AppLink
                            className="text-info"
                            target="_blank"
                            rel="noopener"
                            href="https://github.com/gp-sehetna/sehetna"
                        >
                            contribution on GitHub.
                        </AppLink>
                    </>
                )}
            </p>
        </div>
    )
}

export const LiveContent = ({
    onLayerSelect,
    zoneProperties,
}: Pick<MapDashboardProps, "onLayerSelect"> & {
    zoneProperties: GeoJsonProperties
}) => {
    const modelId = usePredictionsStore((s) => s.forecaster)
    const { predictions, isLoading } = useForecasts({
        modelId,
        iso: zoneProperties.isoA3,
    })
    const hasForecasts = !!predictions && predictions.length > 0

    return (
        <div className="flex h-full flex-col gap-2">
            <ModelSelector />

            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <AppLoader />
                    </div>
                ) : hasForecasts ? (
                    <ForecastDashboard onCardClick={onLayerSelect} forecasts={predictions} />
                ) : (
                    <NoPredictionsFallback text="No prediction timeline available for this model yet." />
                )}
            </div>
        </div>
    )
}
