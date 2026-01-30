import {
    CreateOptions,
    FlattenMaps,
    HydratedDocument,
    Model,
    PopulateOptions,
    ProjectionType,
    QueryFilter,
    QueryOptions,
} from "mongoose"

export abstract class DatabaseRepository<TDocument> {
    constructor(protected readonly model: Model<TDocument>) {}

    async findOne({
        filter,
        select,
        options,
    }: {
        filter: QueryFilter<TDocument>
        select?: ProjectionType<TDocument>
        options?: QueryOptions<TDocument>
    }): Promise<HydratedDocument<FlattenMaps<TDocument>> | HydratedDocument<TDocument> | null> {
        const doc = this.model.findOne(filter).select(select || "")
        if (options?.lean) {
            doc.lean(options.lean)
        }
        if (options?.populate) {
            doc.populate(options.populate as PopulateOptions)
        }

        return await doc.exec()
    }


    async create({
        data,
        options,
    }: {
        data: Partial<TDocument>[]
        options?: CreateOptions | undefined
    }) : Promise<HydratedDocument<TDocument>[]> {
        return await this.model.create(data as any, options) 
    }


}
