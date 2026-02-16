import { usePredictionsStore } from "@/stores/usePredictions"
import AppPieChart from "@/components/ui/GlobalComponents/charts/PieChart"
import AppLoader from "@/components/ui/GlobalComponents/Loaders/AppLoader"
import MapPredictionsViewer from "@/components/ui/map/MapPredictionsViewer"
import Divider from "@/components/ui/GlobalControls/Divider"

const HealthOutcomeCharts = () => {
    const { loading, contributors, healthOutcome } = usePredictionsStore()

    if (!contributors || contributors.length === 0)
        return (
            <div className="flex flex-1 items-center justify-center">
                {loading ? <AppLoader /> : <p>No data</p>}
            </div>
        )

    return (
        <>
            <AppPieChart contributors={contributors} healthOutcome={healthOutcome} />
            <Divider className="mb-4 w-full bg-black/10" />
            <MapPredictionsViewer />
        </>
    )
}

export default HealthOutcomeCharts
