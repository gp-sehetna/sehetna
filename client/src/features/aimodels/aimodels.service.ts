import { IAiModel } from "@/shared/db/model/ai-model.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"

export class AiModelService {
    constructor(private readonly aiModelRepository: AiModelRepository) {}
    async findAll() {
        return await this.aiModelRepository.find()
    }
    async createModel(aiModel: IAiModel) {
        return await this.aiModelRepository.create(aiModel)
    }
    async deleteModel(id: string) {
        return await this.aiModelRepository.deleteById(id)
    }
}
