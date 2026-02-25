import { Document, Schema, model, models } from "mongoose"
import {
    DataSourcesEnum,
    GranularityEnum,
    GeoLevelEnum,
    StatusEnum,
} from "../enums/data-store.enum"

export interface IDataStore extends Document {
    alias_name: string
    source: DataSourcesEnum
    description: string
    version: string
    granularity: GranularityEnum
    geographic_level: GeoLevelEnum
    variables: string[]
    date_range: {
        start: Date
        end: Date
    }
    file_path: string
    status: StatusEnum
    notes: string
    createdAt: Date
}

const DataStoreSchema = new Schema<IDataStore>(
    {
        alias_name: { type: String, required: true, unique: true, trim: true },
        source: { type: String, enum: DataSourcesEnum, required: true },
        description: { type: String, required: true, trim: true },
        version: { type: String, required: true, default: "1.0" },
        granularity: { type: String, enum: GranularityEnum, required: true },
        geographic_level: { type: String, enum: GeoLevelEnum, default: GeoLevelEnum.country },
        variables: {
            // not selected
            type: [String],
            required: true,
            validate: [(val: string[]) => val.length > 0, "At least one variable is required"],
        },
        date_range: {
            start: { type: Date, required: true },
            end: { type: Date, required: true },
        },
        file_path: { type: String, default: "" }, // not selected
        status: { type: String, enum: StatusEnum, default: StatusEnum.pending },
        notes: { type: String, trim: true, default: "" }, // not selected
    },
    { timestamps: { createdAt: true } }
)

DataStoreSchema.index({ source: 1, status: 1 })
DataStoreSchema.index({ alias_name: 1, version: 1 }, { unique: true })

export const DataStoresModel = models.DataStore || model<IDataStore>("DataStore", DataStoreSchema)
