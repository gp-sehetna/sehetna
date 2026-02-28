import { IObservation } from "../model/observation.model"
import { DatabaseRepository } from "./database.repository"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: any) {
        super(model)
    }

    async createPrediction(data: Partial<IObservation>) {
        return await this.create(data)
    }

    async createForecast(data: Partial<IObservation>[]) {
        return await this.bulkUpsert(data, "_id")
    }
}
