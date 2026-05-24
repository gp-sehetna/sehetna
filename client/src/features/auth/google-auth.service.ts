import { createTokens } from "@/lib/auth/token"
import { ProviderEnum } from "@/shared/db/enums/auth.enum"
import { IUser } from "@/shared/db/model/user.model"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { EmailService } from "@/shared/email/email.service"
import { ConflictException, ValidationException } from "@/shared/http/errors"
import { HydratedDocument } from "mongoose"
import { Profile } from "next-auth"

export class GoogleAuthService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly emailService: EmailService
    ) {}

    login = async (profile: Profile) => {
        const email = profile.email
        if (!email) throw new ValidationException("Google profile email is missing")

        const existingUser = await this.userRepository.findByEmail(email)

        if (existingUser) {
            if (existingUser.provider !== ProviderEnum.GOOGLE)
                throw new ConflictException(
                    "The email is already registered. Please sign in with your credentials or use another email for Google sign-in."
                )

            return {
                user: this._extractSafeUser(existingUser),
                tokens: await createTokens(existingUser._id.toString(), existingUser.role),
            }
        }

        const user = this._mapProfileToUser({ ...profile, email })
        const createdUser = await this.userRepository.create(user)
        this.emailService.sendWelcome(user.email)

        return {
            user: this._extractSafeUser(createdUser),
            tokens: await createTokens(createdUser._id.toString(), createdUser.role),
        }
    }

    private _mapProfileToUser = (
        profile: Profile & { email: string }
    ): Pick<IUser, "firstName" | "lastName" | "email" | "provider"> => {
        const googleProfile = profile as Profile & {
            given_name?: string
            family_name?: string
        }
        const [fallbackFirstName, ...fallbackLastNameParts] = (profile.name || "")
            .trim()
            .split(/\s+/)
        const emailName = profile.email.split("@")[0]
        const firstName = this._normalizeName(
            googleProfile.given_name || fallbackFirstName || emailName,
            "Google"
        )
        const lastName = this._normalizeName(
            googleProfile.family_name || fallbackLastNameParts.join(" "),
            "User"
        )

        return {
            firstName,
            lastName,
            email: profile.email,
            provider: ProviderEnum.GOOGLE,
        }
    }

    private _normalizeName = (name: string | undefined, fallback: string) => {
        const normalized = name?.trim()
        return normalized && normalized.length >= 2 ? normalized : fallback
    }

    private _extractSafeUser = (user: HydratedDocument<IUser>) => {
        const { password, __v, ...safeUser } = user.toObject()
        return safeUser
    }
}
