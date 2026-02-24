import { ILoginInputsDTO, PasswordAndNameInputsDTO } from "@/features/auth/auth.dto"
import { OTPService } from "@/features/otp/otp.service"
import { createTokens } from "@/lib/auth/token"
import { OtpRepository } from "@/shared/db/repository/otp.repository"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { EmailService } from "@/shared/email/email.service"
import { UserNotFoundException, ValidationException } from "@/shared/http/errors"
import { compare, hash } from "bcrypt"
import { NextRequest, userAgent } from "next/server"

export class AuthService extends OTPService {
    constructor(
        private readonly userRepository: UserRepository,
        otpRepository: OtpRepository,
        emailService: EmailService
    ) {
        super(otpRepository, emailService)
    }

    updateUserPassword = async (email: string, newPassword: string, req: NextRequest) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, isPasswordSame] = await this.getUserAndComparePassword(email, newPassword)
        if (isPasswordSame) throw new ValidationException("Password is same as before")

        const hashedPassword = await hash(newPassword, 10)
        const updatedUser = await this.userRepository.updateUserPasswordByEmail(
            email,
            hashedPassword
        )
        if (!updatedUser) throw new UserNotFoundException()
        // Send an email to the user
        const ua = userAgent(req)
        this.emailService.sendPasswordChanged(
            email,
            updatedUser.updatedAt?.toISOString() ?? "",
            ua.device.type || ua.device.model || "Unknown Device"
        )
        return updatedUser
    }

    getUserByEmail = async (email: string) => {
        return await this.userRepository.findByEmail(email)
    }

    checkUserExistsByEmail = async (email: string) => {
        return await this.userRepository.findByEmail(email)
    }

    signup = async ({ firstName, lastName, password }: PasswordAndNameInputsDTO, otpId: string) => {
        const email = await this.getEmailByOtpId(otpId)
        const hashedPassword = await hash(password, 10)
        const user = { firstName, lastName, email, password: hashedPassword }
        const createdUser = await this.userRepository.create(user)
        this.emailService.sendWelcome(email)

        return createdUser
    }

    getUserAndComparePassword = async (email: string, password: string) => {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new UserNotFoundException()
        const isPasswordValid = await compare(password, user.password)
        return [user, isPasswordValid] as const
    }

    login = async ({ email, password }: ILoginInputsDTO) => {
        const [user, isPasswordValid] = await this.getUserAndComparePassword(email, password)
        if (!isPasswordValid) throw new ValidationException("Invalid credentials")

        return await createTokens(user)
    }

    checkOldPassword = async (userId: string, password: string) => {
        const user = await this.userRepository.findById(userId)
        if (!user) throw new UserNotFoundException()
        return compare(password, user.password)
    }
}
