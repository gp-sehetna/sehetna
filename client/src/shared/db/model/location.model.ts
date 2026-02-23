import { Document, Schema, model, models } from "mongoose"

export type LocationLevel = "country" | "region" | "state" | "city"

export interface ILocation extends Document {
    level: LocationLevel
    code: string // ISO 3166-1 alpha-3 e.g. "EGY"
    name: string
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
}

const LocationSchema = new Schema<ILocation>(
    {
        level: {
            type: String,
            enum: ["country", "region", "state", "city"],
            required: true,
        },
        code: { type: String, required: true, uppercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        /** null = top-level country; ObjectId = child of another location */
        parent_id: { type: Schema.Types.ObjectId, ref: "Location", default: null },
        region: { type: String, required: true },
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
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

/**
 * Indexes
 * - code is unique only at country level; combined with level for safety
 * - parent_id index enables fast "get all children of X" queries
 */
LocationSchema.index({ code: 1, level: 1 }, { unique: true })
LocationSchema.index({ parent_id: 1 })

export const LocationModel = models.Location || model<ILocation>("Location", LocationSchema)
