import { QueryFilter } from "mongoose"
import { DatabaseRepository } from "./database.repository"
import { IAiModel } from "../model/ai-model.model"

export class AiModelRepository extends DatabaseRepository<IAiModel> {
    constructor(protected override readonly model: any) {
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


