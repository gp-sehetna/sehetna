import { EXPIRE } from "@/lib/auth/token"
import { Cookies } from "@/lib/auth/cookies"
import { MainService } from "@/shared/db/main.service"
import { ApplicationException } from "@/shared/http/errors"
import { cookies } from "next/headers"
import { NextAuthOptions } from "next-auth"

import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_SECRET_KEY || "",
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: EXPIRE.refresh,
    },
    pages: {
        signIn: "/authenticate/login",
        error: "/authenticate/login",
    },
    callbacks: {
        async signIn({ profile }) {
            try {
                if (!profile?.email) {
                    return "/authenticate/login?error=Google profile email is missing"
                }

                const mainService = await MainService.getInstance()
                const { tokens } = await mainService.googleAuthService.login(profile)
                const cookieStore = await cookies()

                cookieStore.set(
                    "access_token",
                    tokens.accessToken,
                    Cookies.createSecure(EXPIRE.access)
                )
                cookieStore.set(
                    "refresh_token",
                    tokens.refreshToken,
                    Cookies.createSecure(EXPIRE.refresh)
                )
                return true
            } catch (error) {
                if (error instanceof ApplicationException) {
                    return `/authenticate/login?error=${encodeURIComponent(error.message)}`
                }

                throw error
            }
        },
    },
}
