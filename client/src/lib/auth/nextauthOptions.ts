import { EXPIRE } from "@/lib/auth/token"
import { MainService } from "@/shared/db/main.service"
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
    // jwt: {
    // Can handle encryption and decryption of the JWT here if needed
    // },
    callbacks: {
        async signIn({ account: _, profile }) {
            if (!profile?.email) {
                throw new Error("No profile")
            }
            // Add user to database if not exist using mainService
            const mainService = await MainService.getInstance()

            await mainService.authService.addUserIfNotExists(profile)
            return true
        },
    },
}
