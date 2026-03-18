import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import { ModelSelector } from "@/components/ui/map/ModelSelector"
import { ForecastDashboard } from "@/components/ui/map/view/ForecastDashboard"
import { useForecasts } from "@/hooks/map/use-forecasts"
import { GeoJsonProperties } from "@/shared/config/map"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { MapDashboardProps } from "./MapDashboard"

export const LiveContent = ({
    onLayerSelect,
    zoneProperties,
}: Pick<MapDashboardProps, "onLayerSelect"> & {
    zoneProperties: GeoJsonProperties
}) => {
    const modelId = usePredictionsStore((s) => s.forecaster)
    console.log("LiveContent render", {
        modelId,
        iso: zoneProperties?.isoA3,
        zoneProperties,
    })
    const { data: forecasts, isLoading: isForecastsLoading } = useForecasts({
        modelId,
        iso: zoneProperties.isoA3,
    })
    return (
        <div className="space-y-2">
            <ModelSelector />
            {forecasts ? (
                <ForecastDashboard onCardClick={onLayerSelect} forecasts={forecasts} />
            ) : (
                <div className="flex h-full items-center justify-center">
                    {isForecastsLoading ? <AppLoader /> : <p>No data</p>}
                </div>
            )}
        </div>
    )
}
