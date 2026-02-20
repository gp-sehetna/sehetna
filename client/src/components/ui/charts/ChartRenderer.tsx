import GroupPieChart from "@/components/ui/charts/PieChart"
import { WaterfallChart } from "@/components/ui/charts/WaterfallChart"
import { ExplanationMethod, Explanations, Prediction } from "@/features/environment/week/week.types"

type ChartRendererProps = {
    method: ExplanationMethod
    contributors: number
    explanations: Explanations
    healthOutcome: keyof Prediction
}

const ChartRenderer = ({
    method,
    contributors,
    healthOutcome,
    explanations,
}: ChartRendererProps) => {
    const chartMap: Record<ExplanationMethod, React.ReactNode> = {
        cumulative: (
            <WaterfallChart
                items={explanations.cumulative?.[healthOutcome].slice(0, contributors)}
                healthOutcome={healthOutcome}
            />
        ),
        group: (
            <GroupPieChart
                items={explanations.group?.[healthOutcome].slice(0, contributors)}
                healthOutcome={healthOutcome}
            />
        ),
    }

    return <>{chartMap[method]}</>
}

export default ChartRenderer
