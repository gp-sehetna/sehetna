"use client"

import { api } from "@/shared/api"

type LocationDataResponse = {
    data: Array<any>
    message: string
}

export class LocationClientService {
    useLocationData = async () => {
        const { data, message: _ } = await api.get<LocationDataResponse>("api/locations").json()
        return { data }
    }
}
