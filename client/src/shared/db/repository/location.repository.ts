import { ILocation, LocationModel } from "@/shared/db/model/location.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"

export class LocationRepository extends DatabaseRepository<ILocation> {
    constructor(protected override readonly model: typeof LocationModel) {
        super(model)
    }
    async getChildren(location: Partial<ILocation>) {
        return await this.find({ parent_id: location._id as any })
    }

    async insertMany(locations: ILocation[]) {
        return await this.model.insertMany(locations, { lean: true, throwOnValidationError: true })
    }

    /**
     * Uses name to get locations with name using LIKE operator: `%name%`
     * @todo For Scalability, add support for fuzzy search
     **/
    async findByName(name: string) {
        return await this.find({ name: { $regex: name, $options: "i" } })
    }

    async findByCode(code: string | null) {
        if (!code) return null
        const location = await this.model.findOne({ code }).lean().exec()
        return location
    }
}
