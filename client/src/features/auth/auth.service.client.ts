"use client"

import {
    EmailInputsDTO,
    ILoginInputsDTO,
    ManipulatedUserDataInputsDTO,
    PasswordAndNameInputsDTO,
    PasswordInputsDTO,
    PurposeAndEmailInputsDTO,
} from "@/features/auth/auth.dto"
import { api } from "@/shared/api"
import { LoginResponse, UserResponse } from "./auth.types"
import { BaseSuccessResponse } from "@/shared/http/response"

export class AuthClientService {
    updatePassword = async (json: PasswordInputsDTO) => {
        await api.post("api/auth/password/new", { json }).json()
    }
    updateUserData = async (json: ManipulatedUserDataInputsDTO) => {
        return await api.patch<UserResponse>("api/user/me", { json }).json()
    }
    checkEmail = async (json: EmailInputsDTO) => {
        await api.post("api/auth/password/forgot", { json }).json()
    }
    login = async (json: ILoginInputsDTO) => {
        return await api.post<LoginResponse>("api/auth/login", { json }).json()
    }
    logout = async () => {
        return await api.get<BaseSuccessResponse>("api/auth/invalidate").json()
    }
    signup = async (json: PasswordAndNameInputsDTO) => {
        await api.post("api/auth/signup", { json }).json()
    }
    generateAndFetchOtp = async (json: PurposeAndEmailInputsDTO | EmailInputsDTO) => {
        await api.post("api/auth/otp/generate", { json }).json()
    }

    verifyOtp = async (otp: string, purpose: string | null) => {
        return await api
            .post<{ destination: string; user?: UserResponse["user"] }>("api/auth/otp/verify", {
                json: { otp, purpose },
            })
            .json()
    }
}
