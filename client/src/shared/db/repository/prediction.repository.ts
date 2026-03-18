import { IPrediction, PredictionModel } from "@/shared/db/model/prediction.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Pagination, PaginationResult } from "@/shared/db/types/pagination.type"
import { ClientSession, QueryFilter } from "mongoose"
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
                health_outcomes: 1,
            })
            .sort({ base_date: 1, createdAt: 1 })
            .lean()
            .exec()
    }

    async insertMany(predictions: Partial<IPrediction>[], session?: ClientSession) {
        return await this.model.insertMany(predictions, {
            session,
            lean: true,
            throwOnValidationError: true,
        })
    }

    async deleteAllForecasted(query: QueryFilter<IPrediction> = {}, session?: ClientSession) {
        return await this.model.deleteMany(
            {
                prediction_type: PredictionType.forecasted,
                ...query,
            },
            { session }
        )
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

    async findPredictionsGroupedByLoc() {
        return this.model.aggregate([
            {
                $lookup: {
                    from: "locations",
                    localField: "location_id",
                    foreignField: "_id",
                    as: "location",
                },
            },
            {
                $unwind: "$location",
            },
            {
                $project: {
                    _id: 0,
                    location_id: 1,
                    code: "$location.code",
                    prediction_type: 1,
                    base_date: 1,

                    respiratory_disease_rate: "$health_outcomes.respiratory_disease_rate.point",
                    waterborne_disease_incidents: "$health_outcomes.waterborne_disease_incidents.point",
                    cardio_mortality_rate: "$health_outcomes.cardio_mortality_rate.point",
                    vector_disease_risk_score: "$health_outcomes.vector_disease_risk_score.point",
                    heat_related_admissions: "$health_outcomes.heat_related_admissions.point",

                },
            },
        ])
    }
}
