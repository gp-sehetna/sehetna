import {
    NAME_MAX_LENGTH as maxLength,
    FIELD_REQUIRED as minLength,
} from "@/features/auth/auth.validation"
import { GenderEnum, ProviderEnum, RoleEnum } from "@/shared/db/enums/auth.enum"
import { Document, Model, model, models, Schema } from "mongoose"

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

export const UserModel: Model<IUser> = models.User || model<IUser>("User", userSchema)
