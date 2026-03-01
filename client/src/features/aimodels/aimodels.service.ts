import { AiModelModel, IAiModel } from "@/shared/db/model/ai-model.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"

export class AiModelsService {
    private readonly aiModelRepository = new AiModelRepository(AiModelModel)
    constructor() {}
    async findAll() {
        return await this.aiModelRepository.find()
    }
    async createModel(store: IAiModel) {
        return await this.aiModelRepository.create(store)
    }
    async deleteModel(id: string) {
        return await this.aiModelRepository.deleteById(id)
    }
}
