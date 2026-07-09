import { ObservationRepository } from "@/shared/db/repository/observation.repository"
import { ScenarioQueryParams } from "./scenario.types"
import { Types } from "mongoose"

export class ObservationService {
    constructor(private readonly observationRepository: ObservationRepository) {}

    async getObservations(query: ScenarioQueryParams, userId: Types.ObjectId) {
        return this.observationRepository.findUserScenarios(query, userId)
    }

    async deleteObservation(id: string) {
        return this.observationRepository.deleteById(id)
    }

    async updateNote(id: string, note: string) {
        const result = await this.observationRepository.updateNote(id, note)

        return result.modifiedCount > 0
    }

    async findByLocation(locationId: string) {
        return this.observationRepository.find({
            location_id: locationId,
        })
    }
}
