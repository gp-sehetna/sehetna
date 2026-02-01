import { DUser } from "@/shared/db/model/user.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Model } from "mongoose"

export class UserRepository extends DatabaseRepository<DUser> {
    constructor(protected override readonly model: Model<DUser>) {
        super(model)
    }

    async create(data: Partial<DUser>[]) {
        return await this.model.create(data, { validateBeforeSave: true })
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email }).exec()
    }

    async updateUserPasswordById(id: string, password: string) {
        return await this.model.findByIdAndUpdate(id, { password }, { new: true }).exec()
    }
}
