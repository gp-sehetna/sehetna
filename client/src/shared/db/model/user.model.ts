import { Document, model, models, Schema } from "mongoose"
import { ProviderEnum, GenderEnum, RoleEnum } from "../enums/auth.enum"
import {
    NAME_MAX_LENGTH as maxLength,
    FIELD_REQUIRED as minLength,
} from "@/features/auth/auth.validation"

export interface IUser extends Document {
    firstName: string
    lastName: string
    email: string
    password: string
    provider: ProviderEnum
    gender: GenderEnum
    role: RoleEnum
    createdAt: Date
    updatedAt: Date
}

const userSchema = new Schema<IUser>(
    {
        firstName: { type: String, required: true, minLength, maxLength },
        lastName: { type: String, required: true, minLength, maxLength },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        provider: { type: String, enum: ProviderEnum, default: ProviderEnum.SYSTEM },
        gender: { type: String, enum: GenderEnum, default: GenderEnum.Male },
        role: { type: String, enum: RoleEnum, default: RoleEnum.user },
    },
    { timestamps: true }
)

export const UserModel = models.User || model<IUser>("User", userSchema)
