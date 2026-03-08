import { DUser } from "@/shared/db/model/user.model"
import { SuccessResponseWithData } from "@/shared/http/response"

export type UserWithoutPassword = Omit<DUser, "password">
export type LoginResponse = SuccessResponseWithData<UserWithoutPassword>
