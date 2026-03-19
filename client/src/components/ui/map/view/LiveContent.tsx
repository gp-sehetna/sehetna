import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import { ModelSelector } from "@/components/ui/map/ModelSelector"
import { ForecastDashboard } from "@/components/ui/map/view/ForecastDashboard"
import { useForecasts } from "@/hooks/map/use-forecasts"
import { GeoJsonProperties } from "@/shared/config/map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { MapDashboardProps } from "./MapDashboard"
import AppLink from "../../GlobalControls/AppLink"

export const LiveContent = ({
    onLayerSelect,
    zoneProperties,
}: Pick<MapDashboardProps, "onLayerSelect"> & {
    zoneProperties: GeoJsonProperties
}) => {
    const modelId = usePredictionsStore((s) => s.forecaster)
    const { data: forecasts, isLoading: isForecastsLoading } = useForecasts({
        modelId,
        iso: zoneProperties.isoA3,
    })
    const hasForecasts = !!forecasts && forecasts.length > 0

    return (
        <div className="flex h-full flex-col gap-2">
            <ModelSelector />

            <div className="flex-1 overflow-hidden">
                {isForecastsLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <AppLoader />
                    </div>
                ) : hasForecasts ? (
                    <ForecastDashboard onCardClick={onLayerSelect} forecasts={forecasts} />
                ) : (
                    <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
                        <p className="text-center text-sm">
                            No prediction timeline is available for this model yet. Got a data
                            provider in mind? We’d love your{" "}
                            <AppLink
                                className="text-info"
                                target="_blank"
                                rel="noopener"
                                href="https://github.com/gp-sehetna/sehetna"
                            >
                                contribution on GitHub.
                            </AppLink>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
