import { IUser } from "@/shared/db/model/user.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Model, QueryFilter } from "mongoose"
import { Pagination, PaginationResult } from "../types/pagination.type"

export class UserRepository extends DatabaseRepository<IUser> {
    constructor(protected override readonly model: Model<IUser>) {
        super(model)
    }

    async create(data: Partial<IUser>) {
        return await this.model.create(data)
    }

    async findByEmail(email: string) {
        return await this.findOne({ email })
    }

    async updateUserPasswordByEmail(email: string, password: string) {
        return await this.model.findOneAndUpdate({ email }, { password }, { new: true }).exec()
    }

    async findUsers(
        filter: QueryFilter<IUser> = {},
        pagination: Pagination = {}
    ): Promise<PaginationResult<IUser>> {
        return await this.paginate({ filter, ...pagination })
    }
}
