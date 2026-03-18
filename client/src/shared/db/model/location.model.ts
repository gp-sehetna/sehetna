import { InferSchemaType, Model, model, models, Require_id, Schema } from "mongoose"

const LocationSchema = new Schema(
    {
        code: { type: String, uppercase: true, trim: true, required: true },
        name: { type: String, trim: true, required: true },
        parent_id: { type: Schema.Types.ObjectId, ref: "Location", default: null },
        region: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
)

export type ILocation = Require_id<InferSchemaType<typeof LocationSchema>>
export type SimpleLocation = Pick<ILocation, "name" | "code">

LocationSchema.index({ code: 1 }, { unique: true })
LocationSchema.index({ parent_id: 1 })

export const LocationModel: Model<ILocation> =
    models.Location || model<ILocation>("Location", LocationSchema)
