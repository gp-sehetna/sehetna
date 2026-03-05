import { PaginationOptions, PaginationResult } from "@/shared/db/types/pagination.type"
import { Model, ProjectionType, QueryFilter, QueryOptions, UpdateQuery } from "mongoose"

export abstract class DatabaseRepository<T extends Record<string, any>> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>) {
        return await this.model.create(data)
    }

    async findById(id: string) {
        return await this.model.findById(id).exec()
    }

    async findOne(filter: QueryFilter<T>) {
        return await this.model.findOne(filter).exec()
    }

    async find(filter: QueryFilter<T> = {}, projection?: ProjectionType<T>) {
        return await this.model.find(filter, projection).exec()
    }

    async updateById(id: string, update: UpdateQuery<T>, options: QueryOptions = { new: true }) {
        return await this.model.findByIdAndUpdate(id, update, options).exec()
    }

    async deleteById(id: string) {
        const result = await this.model.findByIdAndDelete(id).exec()
        return !!result
    }

    async paginate(options: PaginationOptions<T> = {}): Promise<PaginationResult<T>> {
        const {
            page = 1,
            limit = 10,
            filter = {},
            sort = { createdAt: "desc" },
            select,
            populate,
            lean = true,
        } = options

        const skip = (page - 1) * limit

        const query = this.model.find(filter).sort(sort).skip(skip).limit(limit)

        if (select) query.select(select)
        if (populate) query.populate(populate)
        if (lean) query.lean()

        const [data, total] = await Promise.all([query.exec(), this.model.countDocuments(filter)])

        const totalPages = Math.ceil(total / limit)

        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        }
    }
}
