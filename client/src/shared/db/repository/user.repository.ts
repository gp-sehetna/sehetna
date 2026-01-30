import { DUser } from "@/shared/db/model/user.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { BadRequestException } from "@/shared/http/errors"
import { Model } from "mongoose"

export class UserRepository extends DatabaseRepository<DUser> {
    constructor(protected override readonly model: Model<DUser>) {
        super(model)
    }

    async create(data: Partial<DUser>[]) {
        const users = await this.model.create(data, { validateBeforeSave: true })
        if (!users) throw new BadRequestException("Failed to create users")

        return users
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email }).exec()
    }
}
