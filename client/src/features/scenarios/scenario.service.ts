import { ObservationRepository } from "@/shared/db/repository/observation.repository"
import { toScenarioObservation } from "./scenario.mapper"

export class ObservationService {
    constructor(private readonly observationRepository: ObservationRepository) {}

    async getObservations() {
        return (await this.observationRepository.findAllObservations()).map(toScenarioObservation)
    }

    async findByLocation(locationId: string) {
        return this.observationRepository.find({
            location_id: locationId,
        })
    }
}
