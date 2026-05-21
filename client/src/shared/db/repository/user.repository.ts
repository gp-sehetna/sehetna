import { ManipulatedUserDataInputsDTO } from "@/features/auth/auth.dto"
import { IUser, UserModel } from "@/shared/db/model/user.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Pagination, PaginationResult } from "@/shared/db/types/pagination.type"
import { QueryFilter } from "mongoose"

export class UserRepository extends DatabaseRepository<IUser> {
    constructor(protected override readonly model: typeof UserModel) {
        super(model)
    }

    async create(data: Partial<IUser>) {
        return await this.model.create(data)
    }
    async upsert(data: Partial<IUser>) {
        const filter = { email: data.email }
        const update = { $set: data }
        const options = { upsert: true, new: true }
        // TODO: Remove try/catch logic to be consistent with other repositories, this is just temporary.
        try {
            const createdUser = await this.model.findOneAndUpdate(filter, update, options).exec()
            return createdUser
        } catch (error) {
            console.error("Error in upsert user:", error)
            throw error
        }
    }

    async findByEmail(email: string) {
        return await this.model.findOne({ email })
    }

    async updateUserPasswordByEmail(email: string, password: string) {
        return await this.model.findOneAndUpdate({ email }, { password }, { new: true }).exec()
    }

    async updateUserById(id: string, userData: ManipulatedUserDataInputsDTO) {
        return this.model
            .findByIdAndUpdate(
                id,
                { $set: userData },
                {
                    new: true,
                    runValidators: true,
                    omitUndefined: true,
                }
            )
            .exec()
    }

    async updateUserEmailById(id: string, email: string) {
        return this.model
            .findByIdAndUpdate(
                id,
                { $set: { email } },
                {
                    new: true,
                    runValidators: true,
                }
            )
            .exec()
    }

    async findUsers(
        filter: QueryFilter<IUser> = {},
        pagination: Pagination = {}
    ): Promise<PaginationResult<IUser>> {
        return await this.paginate({ filter, ...pagination })
    }
}
