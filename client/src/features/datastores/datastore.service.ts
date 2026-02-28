import { DataStoreRepository } from "@/shared/db/repository/data-store.repository"
import { DataStoreModel, IDataStore } from "@/shared/db/model/data-store.model"

export class DataStoreService {
    private readonly dataStoreRepository = new DataStoreRepository(DataStoreModel)
    constructor() {}
    async findAll() {
        return await this.dataStoreRepository.find()
    }
    async createStore(store: IDataStore) {
        return await this.dataStoreRepository.create(store)
    }
    async deleteStore(id: string) {
        return await this.dataStoreRepository.deleteById(id)
    }
}
