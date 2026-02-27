import { Document, Schema, model, models } from "mongoose"
import { GeoLevelEnum } from "../enums/data-store.enum"

export interface ILocation extends Document {
    geographic_level: GeoLevelEnum
    code: string // e.g. "EGY"
    name: string
    long_name: string
    parent_id: Schema.Types.ObjectId | null // null for top-level countries
    region: string // world-region grouping e.g. "MENA"
    coordinates: {
        lat: number
        lng: number
    }
    metadata: {
        income_level: string
        population_millions: number
        gdp_per_capita_usd: number
    }
    createdAt: Date
    updatedAt: Date
}

const LocationSchema = new Schema<ILocation>(
    {
        geographic_level: { type: String, enum: GeoLevelEnum, required: true },
        code: { type: String, uppercase: true, trim: true, required: true },
        name: { type: String, trim: true, required: true },
        long_name: { type: String, trim: true, default: "" },
        parent_id: { type: Schema.Types.ObjectId, ref: "Location", default: null },
        region: { type: String, trim: true, default: "" },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        metadata: {
            income_level: { type: String, default: "" },
            population_millions: { type: Number, default: 0 },
            gdp_per_capita_usd: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
)

/**
 * Indexes
 * - code is unique only at country level; combined with level for safety
 * - parent_id index enables fast "get all children of X" queries
 */
LocationSchema.index({ code: 1, geographic_level: 1 }, { unique: true })
LocationSchema.index({ parent_id: 1 })

export const LocationModel = models.Location || model<ILocation>("Location", LocationSchema)
