import { ScenarioQueryParams } from "@/features/scenarios/scenario.types"
import { IObservation, ObservationModel } from "@/shared/db/model/observation.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { ClientSession, Types } from "mongoose"

export class ObservationRepository extends DatabaseRepository<IObservation> {
    constructor(protected override readonly model: typeof ObservationModel) {
        super(model)
    }

    async insertOne(data: Partial<IObservation>, session?: ClientSession) {
        return await this.model.insertOne(data, { session })
    }

    async updateNote(id: string, note: string) {
        return this.model.updateOne({ _id: new Types.ObjectId(id) }, { $set: { note } })
    }

    async findAllScenarios(query: ScenarioQueryParams) {
        return (
            this.model
                .find()
                .sort({
                    [query.sortBy]: query.sortDirection === "asc" ? 1 : -1,
                })
                // When populating, rename location_id to location
                .populate([
                    { path: "location_id", select: { name: 1 } },
                    { path: "prediction_id", select: { health_outcomes: 1 } },
                ])
                .lean()
                .exec()
        )
        //! Critical: Paginate the result of the Scenarios. use reference in `prediction.repository.ts`
        // return this.paginate({
        //     filter: {},
        //     sort: { [query.sortBy]: query.sortDirection },
        //     populate: [
        //         { path: "location_id", select: { name: 1 } },
        //         { path: "prediction_id", select: { health_outcomes: 1 } },
        //     ],
        //     lean: true,
        // })
    }
}
