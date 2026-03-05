"use client"

import { api } from "@/shared/api"

type HistoricalDataResponse = {
    data: Array<any>
    message: string
}

export class HistoricalDataClientService {
    useHistoricalData = async () => {
        const { data, message: _ } = await api
            .get<HistoricalDataResponse>("api/historicaldata")
            .json()
        return { data }
    }
}

/*
    1- Get historical Data 
    2- 
*/
