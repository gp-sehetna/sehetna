import { ILocation } from "@/shared/db/model/location.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Model } from "mongoose"

export class LocationRepository extends DatabaseRepository<ILocation> {
    constructor(protected override readonly model: Model<ILocation>) {
        super(model)
    }
    async getRecursiveLocations(location: Partial<ILocation>) {
        const children = await this.model.find({ parent_id: location._id as any }).exec()
        return [location, ...children]
    }
    async getLocationsByLevel(level: ILocation["geographic_level"]) {
        return await this.model.find({ geographic_level: level }).exec()
    }
    /**
     * Uses name to get locations with name using LIKE operator: `%name%`
     * @todo For Scalability, add support for fuzzy search
     **/
    async getLocationsByName(name: string) {
        return await this.model.find({ name: { $regex: name, $options: "i" } }).exec()
    }
}
