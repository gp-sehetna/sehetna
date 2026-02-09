import { HealthOutcomePredictions } from "@/shared/types/map"
import AppPieChart from "../GlobalComponents/charts/PieChart"

const HealthOutcomeCharts = (clickedZonePredictions : HealthOutcomePredictions) => {
    console.log("see pred", clickedZonePredictions);
    
    return <AppPieChart />
}

export default HealthOutcomeCharts
