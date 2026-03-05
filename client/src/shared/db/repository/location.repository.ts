import { ILocation, LocationModel } from "@/shared/db/model/location.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { NotFoundException } from "@/shared/http/errors"

export class LocationRepository extends DatabaseRepository<ILocation> {
    constructor(protected override readonly model: typeof LocationModel) {
        super(model)
    }
    async getChildren(location: Partial<ILocation>) {
        return await this.find({ parent_id: location._id as any })
    }

    /**
     * Uses name to get locations with name using LIKE operator: `%name%`
     * @todo For Scalability, add support for fuzzy search
     **/
    async findByName(name: string) {
        return await this.find({ name: { $regex: name, $options: "i" } })
    }

    async findByCode(code: string) {
        const location = await this.model.findOne({ code }).lean().exec()
        if (!location) throw new NotFoundException("Location not found")
        return location
    }
}
