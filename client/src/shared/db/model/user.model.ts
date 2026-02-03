import { Document, model, models, Schema } from "mongoose"
import { ProviderEnum, GenderEnum, RoleEnum } from "../enums/enums.db"

export interface DUser extends Document {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmEmailOtp?: string

    changeCredentialTime?: Date
    createdAt: Date
    updatedAt?: Date
    provider: ProviderEnum

    gender?: GenderEnum
    role?: RoleEnum
}

const userSchema = new Schema<DUser>(
    {
        firstName: { type: String, required: true, minLength: 2, maxLength: 20 },
        lastName: { type: String, required: true, minLength: 2, maxLength: 20 },

        email: { type: String, required: true, unique: true },

        password: { type: String, required: true },

        confirmEmailOtp: String,

        changeCredentialTime: Date,

        provider: { type: String, enum: ProviderEnum, default: ProviderEnum.SYSTEM },

        gender: { type: String, enum: GenderEnum, default: GenderEnum.Male },

        role: { type: String, enum: RoleEnum, default: RoleEnum.user },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

export const UserModel = models.User || model<DUser>("User", userSchema)
