"use client"

import { api } from "@/shared/api"
import { IDataStore } from "@/shared/db/model/data-store.model"

type DataStoreResponse = {
    data: Array<IDataStore>
    message: string
}

export class DataStoreClientService {
    useDataStores = async () => {
        const { data, message: _ } = await api.get<DataStoreResponse>("api/datastores").json()

        return { data }
    }
}
