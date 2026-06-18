import { IObservation, ObservationModel } from "@/shared/db/model/observation.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { ClientSession } from "mongoose"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: typeof ObservationModel) {
        super(model)
    }

    async insertOne(data: Partial<IObservation>, session?: ClientSession) {
        return await this.model.insertOne(data, { session })
    }
    async findAll() {
        return await this.model.find().lean().exec()
    }
}
