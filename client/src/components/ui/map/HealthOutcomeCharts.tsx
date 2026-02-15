import { usePredictionsStore } from "@/stores/usePredictions"
import AppPieChart from "../GlobalComponents/charts/PieChart"
import AppLoader from "../GlobalComponents/Loaders/AppLoader"

const HealthOutcomeCharts = () => {
    const { loading, contributors, healthOutcome } = usePredictionsStore()

    if (loading) return <AppLoader />

    if (!contributors || contributors.length === 0) return <p>No data</p>

    return <AppPieChart contributors={contributors} healthOutcome={healthOutcome} />
}

export default HealthOutcomeCharts
