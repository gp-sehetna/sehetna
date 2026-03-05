import { DataStoreModel, IDataStore } from "@/shared/db/model/data-store.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { QueryFilter } from "mongoose"

export class DataStoreRepository extends DatabaseRepository<IDataStore> {
    constructor(protected override readonly model: typeof DataStoreModel) {
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
