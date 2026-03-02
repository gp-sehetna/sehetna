import { AiModelModel, IAiModel } from "@/shared/db/model/ai-model.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { QueryFilter } from "mongoose"

export class AiModelRepository extends DatabaseRepository<IAiModel> {
    constructor(protected override readonly model: typeof AiModelModel) {
        super(model)
    }

    async findAiModels(filter: QueryFilter<IAiModel> = {}) {
        return await this.find(filter, {
            features: 0,
            training_data: 0,
            createdAt: 0,
        })
    }
}
