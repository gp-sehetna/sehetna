import { Document, model, models, Schema } from "mongoose"
import { ProviderEnum, GenderEnum, RoleEnum } from "../enums/auth.enum"
import {
    NAME_MAX_LENGTH as maxLength,
    FIELD_REQUIRED as minLength,
} from "@/features/auth/auth.validation"

export interface DUser extends Document {
    firstName: string
    lastName: string
    fullName: string
    email: string
    password: string
    provider: ProviderEnum
    gender: GenderEnum
    role: RoleEnum
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<DUser>(
    {
        firstName: { type: String, required: true, minLength, maxLength },
        lastName: { type: String, required: true, minLength, maxLength },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        provider: { type: String, enum: ProviderEnum, default: ProviderEnum.SYSTEM },
        gender: { type: String, enum: GenderEnum, default: GenderEnum.Male },
        role: { type: String, enum: RoleEnum, default: RoleEnum.user },
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// TODO: Ensure virtual field is fetched
userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
})

export const UserModel = models.User || model<DUser>("User", userSchema)
