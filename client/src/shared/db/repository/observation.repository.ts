import { IObservation, ObservationModel } from "@/shared/db/model/observation.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: typeof ObservationModel) {
        super(model)
    }

    async createPrediction(data: Partial<IObservation>) {
        return await this.create(data)
    }

    async createForecast(data: Partial<IObservation>[]) {
        return await this.bulkUpsert(data, "_id")
    }
}
