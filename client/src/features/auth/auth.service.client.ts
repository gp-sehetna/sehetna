"use client"

import { api } from "@/shared/api"
import {
    PasswordAndNameInputsDTO,
    ILoginInputsDTO,
    EmailInputsDTO,
    PasswordInputsDTO,
} from "@/features/auth/auth.dto"

export class AuthClientService {
    updatePassword = async (json: PasswordInputsDTO) => {
        await api.post("api/auth/password/new", { json }).json()
    }
    checkEmail = async (json: EmailInputsDTO) => {
        await api.post("api/auth/password/forgot", { json }).json()
    }
    login = async (json: ILoginInputsDTO) => {
        await api.post("api/auth/login", { json }).json()
    }
    signup = async (json: PasswordAndNameInputsDTO) => {
        await api.post("api/auth/signup", { json }).json()
    }
    generateAndFetchOtp = async (json: EmailInputsDTO) => {
        await api.post("api/auth/otp/generate", { json }).json()
    }

    verifyOtp = async (otp: string) => {
        await api.post<{ data: string }>("api/auth/otp/verify", { json: { otp } }).json()
    }
}
