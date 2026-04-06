import ChartRenderer from "@/components/ui/charts/ChartRenderer"
import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import PredictionsViewer from "@/components/ui/map/MapPredictionsViewer"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useSettingsStore } from "@/stores/use-settings"
import AppLink from "../GlobalControls/AppLink"
import { NoPredictionsFallback } from "./view/LiveContent"

const HealthOutcomeCharts = () => {
    const { explanationMethod, contributors } = useSettingsStore()
    const { loading, simulation, setModifying, explanations, healthOutcome } = usePredictionsStore()

    const hasSimulation = simulation && simulation.predictions.length > 0

    if (!hasSimulation)
        return (
            <div className="flex h-full items-center justify-center">
                {loading ? (
                    <AppLoader />
                ) : (
                    <NoPredictionsFallback addLink={false} text="No data is available yet." />
                )}
            </div>
        )

    return (
        <div className="flex flex-col gap-2">
            <div
                onClick={() => setModifying(true)}
                className="glassy base-transition flex cursor-pointer items-center justify-center rounded-2xl hover:scale-101"
            >
                <small className="text-center">
                    Click this section to modify the simulation inputs.
                </small>
            </div>
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
