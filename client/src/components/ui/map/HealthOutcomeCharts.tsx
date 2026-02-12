import { CurrHealthOutcomePreds } from "@/shared/types/map";
import AppPieChart from "../GlobalComponents/charts/PieChart";
import { usePredictionsStore } from "@/stores/usePredictions";
import AppLoader from "../GlobalComponents/Loaders/AppLoader";

const HealthOutcomeCharts = () => {
    const { loadingPredictions, currHealthOutcomePredictions } = usePredictionsStore()
    
    if (loadingPredictions) return <AppLoader/>

    if (!currHealthOutcomePredictions || !currHealthOutcomePredictions.contributors || currHealthOutcomePredictions.contributors.length === 0) return <p>No data</p>

    return <AppPieChart items={currHealthOutcomePredictions} />
}

export default HealthOutcomeCharts
