import { EngagementModel, IEngagement } from "@/shared/db/model/contact.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"

export class EngagementRepository extends DatabaseRepository<IEngagement> {
    constructor(protected override readonly model: typeof EngagementModel) {
        super(model)
    }
}
