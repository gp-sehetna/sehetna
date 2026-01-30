import { Document, Model } from "mongoose"

export abstract class DatabaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T>[]) {
        return await this.model.create(data)
    }

    findById(id: string) {
        return this.model.findById(id).exec()
    }

    findAll() {
        return this.model.find().exec()
    }
}
