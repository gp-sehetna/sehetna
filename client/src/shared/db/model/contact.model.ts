import { Document, model, models, Schema } from "mongoose"
import { DESC_MAX_LENGTH, NAME_MAX_LENGTH as maxLength } from "@/features/auth/auth.validation"

export interface IEngagement extends Document {
    name: string
    email: string
    phone: string
    message: string
    createdAt: Date
}

const EngagementSchema = new Schema<IEngagement>(
    {
        name: { type: String, required: true, maxLength },
        email: { type: String, required: true },
        phone: { type: String, default: "" },
        message: { type: String, required: true, maxLength: DESC_MAX_LENGTH },
    },
    { timestamps: { createdAt: true } }
)

export const EngagementModel =
    models.Engagement || model<IEngagement>("Engagement", EngagementSchema)
