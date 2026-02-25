import { QueryFilter } from "mongoose"
import { IDataStore } from "./../model/data-store.model"
import { DatabaseRepository } from "./database.repository"

export class DataStoreRepository extends DatabaseRepository<IDataStore> {
    constructor(protected override readonly model: any) {
        super(model)
    }

    async findDataStores(filter: QueryFilter<IDataStore> = {}) {
        return await this.find(filter, {
            variables: 0,
            file_path: 0,
            notes: 0,
            createdAt: 0,
        })
    }
}
