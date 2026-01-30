import { HydratedDocument, model, models, Schema, Types } from "mongoose"
export enum ProviderEnum {
    GOOGLE = "GOOGLE",
    SYSTEM = "SYSTEM",
}
export enum GenderEnum {
    Male = "Male",
    Female = "Female",
}

export enum RoleEnum {
    user = "user",
    admin = "admin",
}

export interface IUser {
    _id: Types.ObjectId
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

const userSchema = new Schema<IUser>(
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

// userSchema
//     .virtual("userName")
//     .set(function (value: string) {
//         const [firstName, lastName] = value.split(" ") || []

//         this.set({ firstName, lastName })
//     })
//     .get(function () {
//         return this.firstName + " " + this.lastName
//     })

export const UserModel = models.User || model<IUser>("User", userSchema)

export type HUserDocument = HydratedDocument<IUser>
