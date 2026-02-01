import { Document, Model } from "mongoose"

export abstract class DatabaseRepository<T extends Document> {
    constructor(protected readonly model: Model<T>) {}
}
