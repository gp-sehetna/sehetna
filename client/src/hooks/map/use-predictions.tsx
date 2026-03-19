import { ForecastResponse } from "@/features/environment/prediction/prediction.dto"
import { PredictionsAggregates } from "@/features/environment/prediction/prediction.types"
import { getDateRangeByGranularity } from "@/lib/utils/date"
import { api } from "@/shared/api"
import { useFilterDateStore } from "@/stores/map/use-filter-date"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useQuery } from "@tanstack/react-query"
import { isWithinInterval } from "date-fns"
import { useMemo } from "react"

const usePredictions = () => {
    const { granularity, date: selectedDate } = useFilterDateStore()
    const healthOutcome = usePredictionsStore((s) => s.healthOutcome)

    // const predictions = useMemo<ForecastResponse["predictions"]>(() => [], [])
    const { data: predictions, isLoading } = useQuery({
        queryKey: ["predictions"],
        queryFn: async () => {
            const { predictions } = await api
                .get<ForecastResponse>("api/environment/prediction")
                .json()
            return predictions
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
    })

    const predictionsMap = useMemo<PredictionsAggregates>(() => {
        if (!predictions?.length) return {}

        const { start, end } = getDateRangeByGranularity(selectedDate, granularity)
        const aggregates: PredictionsAggregates = {}

        for (const prediction of predictions) {
            if (!isWithinInterval(prediction.base_date, { start, end })) continue

            const code = prediction.location_id.code
            const value = prediction.health_outcomes[healthOutcome].point

            if (!aggregates[code]) aggregates[code] = { sum: 0, count: 0 }

            aggregates[code].sum += value
            aggregates[code].count++
        }

        return aggregates
    }, [granularity, healthOutcome, predictions, selectedDate])

    return { predictions, isLoading, predictionsMap }
}

export default usePredictions
