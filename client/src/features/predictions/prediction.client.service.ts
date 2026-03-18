"use client"

import { api } from "@/shared/api"

type TempResponse = {
    data: Array<any>
    message: string
}

export class PredictionClientService {
    usePredictions = async () => {
        const { data, message: _ } = await api.get<TempResponse>("api/predictions").json()
        return { data }
    }
}
