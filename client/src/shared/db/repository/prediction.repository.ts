import { QueryFilter } from "mongoose"
import { DatabaseRepository } from "./database.repository"
import { IPrediction } from "../model/prediction.model"

export class PredictionRepository extends DatabaseRepository<IPrediction> {
    constructor(protected override readonly model: any) {
        super(model)
    }

    async findPredictions(filter: QueryFilter<IPrediction> = {}) {
        
        return await this.find(filter, {
            variables: 0,
            file_path: 0,
            notes: 0,
            createdAt: 0,
        })

    }
}
