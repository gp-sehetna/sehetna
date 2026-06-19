import { ObservationQueryParams } from "@/features/observations/Observation.types"
import {
    IObservation,
    IObservationPopulated,
    ObservationModel,
} from "@/shared/db/model/observation.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { ClientSession, Types } from "mongoose"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: typeof ObservationModel) {
        super(model)
    }

    async insertOne(data: Partial<IObservation>, session?: ClientSession) {
        return await this.model.insertOne(data, { session })
    }

    async updateNote(id: string, note: string) {
        return this.model.updateOne({ _id: new Types.ObjectId(id) }, { $set: { note } })
    }

    async findAllObservations(query: ObservationQueryParams) {
        return this.model
            .find()
            .sort({
                [query.sortBy]: query.sortDirection === "asc" ? 1 : -1,
            })
            .populate("location_id", "name")
            .populate("prediction_id", "health_outcomes")
            .lean()
            .exec()
    }
}
