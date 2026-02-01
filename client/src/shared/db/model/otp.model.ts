import { Document, Schema, model, models } from "mongoose"

export interface IOtp extends Document {
    email: string
    otpHash: string
    purpose: "email_verification" | "password_reset"
    expiresAt: Date
    used: boolean
    attempts: number
    createdAt: Date
}

const OtpSchema = new Schema<IOtp>(
    {
        email: { type: String, required: true, index: true },
        otpHash: { type: String, required: true },
        purpose: {
            type: String,
            enum: ["email_verification", "password_reset"],
            required: true,
        },
        expiresAt: { type: Date, required: true },
        used: { type: Boolean, default: false },
        attempts: { type: Number, default: 0 },
    },
    { timestamps: true }
)

// Auto-delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const OtpModel = models.Otp || model<IOtp>("Otp", OtpSchema)
