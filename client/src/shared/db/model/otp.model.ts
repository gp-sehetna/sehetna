import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

const OtpSchema = new Schema(
    {
        email: { type: String, required: true, index: true },
        otpHash: { type: String, required: true },
        purpose: { type: String, enum: PurposeEnum, required: true },
        expiresAt: { type: Date, required: true },
        used: { type: Boolean, default: false },
        verified: { type: Boolean, default: false },
        attempts: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export type IOtp = Require_id<InferSchemaType<typeof OtpSchema>>

// Auto-delete expired OTPs which are still not verified.
OtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0, partialFilterExpression: { verified: false } }
)

export const OtpModel: Model<IOtp> = models.Otp || model<IOtp>("Otp", OtpSchema)
