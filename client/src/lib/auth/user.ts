import "server-only"

import { UserWithoutPassword } from "@/features/auth/auth.types"
import { decodeToken } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
import { cookies } from "next/headers"

const ACCESS_TOKEN_COOKIE = "access_token"

export const getCurrentUserFromAccessToken = async (
    accessToken?: string | null
): Promise<UserWithoutPassword | null> => {
    if (!accessToken) return null

    try {
        const decoded = decodeToken(accessToken, process.env.JWT_ACCESS_SECRET)
        const mainService = await MainService.getInstance()
        const { user } = await mainService.authService.getUserById(decoded.sub)

        return user
    } catch {
        return null
    }
}

export const getCurrentUser = async (): Promise<UserWithoutPassword | null> => {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

    return getCurrentUserFromAccessToken(accessToken)
}
