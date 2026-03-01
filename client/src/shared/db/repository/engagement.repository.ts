import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Model } from "mongoose"
import { IEngagement } from "../model/contact.model"

export class EngagementRepository extends DatabaseRepository<IEngagement> {
    constructor(protected override readonly model: Model<IEngagement>) {
        super(model)
    }
}
