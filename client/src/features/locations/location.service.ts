import { ILocation } from "@/shared/db/model/location.model"
import { LocationRepository } from "@/shared/db/repository/location.repository"

export class LocationService {
    constructor(private readonly locationRepository: LocationRepository) {}
    async insertLocations(locations: ILocation[]) {
        return await this.locationRepository.insertMany(locations)
    }
    async findAllLocations() {
        return await this.locationRepository.find()
    }
}
