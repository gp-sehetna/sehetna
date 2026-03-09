import { IUser } from "@/shared/db/model/user.model"
import { SuccessResponseWithData, BaseSuccessResponse } from "@/shared/http/response"

export type UserWithoutPassword = Omit<IUser, "password">
export type LoginResponse = SuccessResponseWithData<UserWithoutPassword>
export interface UserResponse extends BaseSuccessResponse {
    user: UserWithoutPassword
}
