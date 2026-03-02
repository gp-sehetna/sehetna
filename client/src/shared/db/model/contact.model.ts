import { DESC_MAX_LENGTH, NAME_MAX_LENGTH as maxLength } from "@/features/auth/auth.validation"
import { InferSchemaType, Model, model, models, Require_id, Schema } from "mongoose"

const EngagementSchema = new Schema(
    {
        name: { type: String, required: true, maxLength },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        message: { type: String, required: true, maxLength: DESC_MAX_LENGTH },
    },
    { timestamps: { createdAt: true } }
)

export type IEngagement = Require_id<InferSchemaType<typeof EngagementSchema>>

export const EngagementModel: Model<IEngagement> =
    models.Engagement || model<IEngagement>("Engagement", EngagementSchema)
