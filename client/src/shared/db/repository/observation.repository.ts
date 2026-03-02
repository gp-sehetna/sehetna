import { IObservation, ObservationModel } from "@/shared/db/model/observation.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: typeof ObservationModel) {
        super(model)
    }
}
