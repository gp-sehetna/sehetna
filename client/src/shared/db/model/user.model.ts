import {
    NAME_MAX_LENGTH as maxLength,
    FIELD_REQUIRED as minLength,
} from "@/features/auth/auth.validation"
import { GenderEnum, ProviderEnum, RoleEnum } from "@/shared/db/enums/auth.enum"
import { InferSchemaType, Require_id, Model, model, models, Schema } from "mongoose"

const userSchema = new Schema(
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

userSchema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
})

export type IUser = Require_id<InferSchemaType<typeof userSchema>>

export const UserModel: Model<IUser> = models.User || model<IUser>("User", userSchema)
