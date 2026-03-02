import { IDataStore } from "@/shared/db/model/data-store.model"
import { DataStoreRepository } from "@/shared/db/repository/data-store.repository"

export class DataStoreService {
    constructor(private readonly dataStoreRepository: DataStoreRepository) {}
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
