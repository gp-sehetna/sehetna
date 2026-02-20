import ChartRenderer from "@/components/ui/charts/ChartRenderer"
import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import PredictionsViewer from "@/components/ui/map/MapPredictionsViewer"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useSettingsStore } from "@/stores/use-settings"

const HealthOutcomeCharts = () => {
    const { explanationMethod, contributors } = useSettingsStore()
    const { loading, simulation, explanations, healthOutcome } = usePredictionsStore()

    const hasSimulation = simulation && simulation.predictions.length > 0

    if (!hasSimulation)
        return (
            <div className="flex h-screen items-center justify-center">
                {loading ? <AppLoader /> : <p>No data</p>}
            </div>
        )

    return (
        <div className="flex flex-col gap-4">
            <div className="glassy rounded-2xl">
                {explanations?.[explanationMethod] ? (
                    <ChartRenderer
                        method={explanationMethod}
                        contributors={contributors}
                        explanations={explanations}
                        healthOutcome={healthOutcome}
                    />
                ) : (
                    <div className="flex items-center justify-center">
                        <small>
                            Please click on a country to reload the {explanationMethod}{" "}
                            explanations.
                        </small>
                    </div>
                )}
            </div>
            <div className="glassy rounded-2xl">
                <PredictionsViewer />
            </div>
        </div>
    )
}
export default HealthOutcomeCharts
