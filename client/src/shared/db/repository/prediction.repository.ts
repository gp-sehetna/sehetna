import { IPrediction, PredictionModel } from "@/shared/db/model/prediction.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Pagination, PaginationResult } from "@/shared/db/types/pagination.type"
import { QueryFilter } from "mongoose"
import { PredictionType } from "../enums/prediction.enum"

export class PredictionRepository extends DatabaseRepository<IPrediction> {
    constructor(protected override readonly model: typeof PredictionModel) {
        super(model)
    }

    async findPredictions(filter: QueryFilter<IPrediction> = {}) {
        return await this.model
            .find(filter, {
                base_date: 1,
                prediction_type: 1,
                features_snapshot: 1,
                health_outcomes: 1,
            })
            .lean()
            .exec()
    }

    async insertMany(predictions: IPrediction[]): Promise<IPrediction[]> {
        return await this.model.insertMany(predictions, {
            lean: true,
            throwOnValidationError: true,
        })
    }

    async deleteAllHistorical() {
        const predictions = await this.model
            .find({ prediction_type: PredictionType.historical }, { _id: 1 })
            .lean()
        const isDeleted = await this.model.deleteMany({
            _id: { $in: predictions.map((p) => p._id) },
        })
        return isDeleted.deletedCount
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
