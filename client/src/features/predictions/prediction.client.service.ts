"use client"

import { api } from "@/shared/api"
import { IPrediction } from "@/shared/db/model/prediction.model"

type TempResponse = {
    data: Array<any>
    message: string
}

type PredictionDataResponse = IPrediction

export class PredictionClientService {
    usePredictions = async () => {
        const { data, message: _ } = await api.get<TempResponse>("api/predictions").json()
        return { data }
    }
}
