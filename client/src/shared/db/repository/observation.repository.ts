import { IObservation,  IObservationPopulated,  ObservationModel } from "@/shared/db/model/observation.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { ClientSession } from "mongoose"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: typeof ObservationModel) {
        super(model)
    }

    async insertOne(data: Partial<IObservation>, session?: ClientSession) {
        return await this.model.insertOne(data, { session })
    }
    
    async findAllObservations() {
        return await this.model.find().populate("location_id" , "name").populate("prediction_id", "health_outcomes").lean<IObservationPopulated[]>().exec();
    }
}
