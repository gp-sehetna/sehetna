import { QueryFilter } from "mongoose"
import { DatabaseRepository } from "./database.repository"
import { IPrediction } from "../model/prediction.model"
import { Pagination, PaginationResult } from "../types/pagination.type"

export class PredictionRepository extends DatabaseRepository<IPrediction> {
    constructor(protected override readonly model: any) {
        super(model)
    }

    async findPredictions(filter: QueryFilter<IPrediction> = {}) {
        return await this.find(filter, {
            base_date: 1,
            prediction_type: 1,
            features_snapshot: 1,
            health_outcomes: 1,
        })
    }

    async findUserRelatedPredictions(
        filter: QueryFilter<IPrediction> = {},
        pagination: Pagination = {}
    ): Promise<PaginationResult<IPrediction>> {
        return await this.paginate({
            filter,
            ...pagination,
            populate: [
                {
                    path: "user_id",
                    select: { firstName: 1, lastName: 1, _id: 0 },
                },
                {
                    path: "model_id",
                    select: { display_name: 1, task_type: 1, _id: 0 },
                },
            ],
        })
    }
}
