import { PredictionClientService } from "@/features/predictions/prediction.client.service"
import { useFilterDateStore } from "@/stores/map/use-filter-date"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useMemo } from "react"

interface PredictionResponse {
    prediction_type: string
    base_date: string
    location_id: string
    code: string
    respiratory_disease_rate: number
    waterborne_disease_incidents: number
    cardio_mortality_rate: number
    vector_disease_risk_score: number
    heat_related_admissions: number
}

type PredictionsType = PredictionResponse[]

const usePredictions = () => {
    const predictionService = useMemo(() => new PredictionClientService(), [])

    const { granularity, date: selectedDate } = useFilterDateStore()
    const healthOutcome = usePredictionsStore((s) => s.healthOutcome)
    const setPredictionMap = usePredictionsStore((s) => s.setPredictionMap)

    const {
        data: predictions = [],
        isPending: isPredictionsLoading,
        error: predictionsError,
    } = useQuery<PredictionsType>({
        queryKey: ["predictions"],
        queryFn: async () => {
            const { data } = await predictionService.usePredictions()
            return data
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
    })

    const aggregatedPredictions = useMemo(() => {
        if (!predictions.length || !selectedDate) return []

        const date = new Date(selectedDate)

        /* 
            @TODO: Convert date operations to use date-fns instead
        */
        let start: Date
        let end: Date
        if (granularity === "weekly") {
            const day = date.getDay()
            start = new Date(date)
            start.setDate(date.getDate() - day)
            start.setHours(0, 0, 0, 0)

            end = new Date(start)
            end.setDate(start.getDate() + 6)
            end.setHours(23, 59, 59, 999)
        } else if (granularity === "monthly") {
            start = new Date(date.getFullYear(), date.getMonth(), 1)
            end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
            end.setHours(23, 59, 59, 999)
        } else {
            start = new Date(date.getFullYear(), 0, 1)
            end = new Date(date.getFullYear(), 11, 31)
            end.setHours(23, 59, 59, 999)
        }

        const startTime = start.getTime()
        const endTime = end.getTime()

        const result: { location_id: string; code: string; prediction: number }[] = []

        const groupedPredictions = Object.groupBy(predictions, (p) => p.location_id)

        for (const [location_id, locationPredictions] of Object.entries(groupedPredictions)) {
            if (!locationPredictions) continue
            const code = locationPredictions[0].code // all instances share the same code
            const { sum, count } = locationPredictions.reduce(
                (acc, prediction) => {
                    const time = new Date(prediction.base_date).getTime()

                    if (time >= startTime && time <= endTime) {
                        acc.sum += prediction[healthOutcome]
                        acc.count++
                    }

                    return acc
                },
                { sum: 0, count: 0 }
            )

            if (count > 0) {
                result.push({
                    location_id,
                    code,
                    prediction: sum / count,
                })
            }
        }

        return result
    }, [predictions, selectedDate, granularity, healthOutcome])

    useEffect(() => {
        const map = Object.fromEntries(aggregatedPredictions.map((p) => [p.code, p.prediction]))

        setPredictionMap(map)
    }, [aggregatedPredictions, setPredictionMap])

    return {
        predictions: aggregatedPredictions,
        isPredictionsLoading,
        predictionsError,
    }
}

export default usePredictions
