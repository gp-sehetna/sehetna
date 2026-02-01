import {
    ExpiredException,
    InternalServerException,
    NotFoundException,
    RateLimitException,
    UnauthorizedException,
} from "@/shared/http/errors"
import { randomInt } from "crypto"
import { AuthService } from "@/features/auth/auth.service"
import { JwtPayload, sign, verify } from "jsonwebtoken"
import { compare, hash } from "bcrypt"
import { EmailService } from "@/shared/email/email.service"
import { OtpRepository } from "@/shared/db/repository/otp.repository"

export class OTPService {
    private tokenSignature: string
    constructor(
        private readonly otpRepository: OtpRepository,
        protected readonly emailService: EmailService
    ) {
        if (!process.env.GLOBAL_TOKEN_SIGNATURE)
            throw new InternalServerException(
                "Missing GLOBAL_TOKEN_SIGNATURE environment variable."
            )

        this.tokenSignature = process.env.GLOBAL_TOKEN_SIGNATURE
    }

    private static generateOtp = () => {
        return String(randomInt(100000, 999999))
    }

    generateAndSendOtp = async (email: string) => {
        // Store email in server cookie with expiration date = 5 mins
        const emailToken = sign({ email }, this.tokenSignature, {
            expiresIn: "5m", // EMAIL_VERIFICATION_TOKEN
        })

        // Generate an OTP string of 6 numbers exactly,
        const otp = AuthService.generateOtp()
        const otpHash = await hash(otp, 10)
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // EMAIL_VERIFICATION_TOKEN

        await this.otpRepository.invalidatePrevious(email, "email_verification")
        await this.otpRepository.create({
            email,
            otpHash,
            purpose: "email_verification",
            expiresAt,
        })

        // Send it as an email to the user
        this.emailService.sendVerification(email, otp)
        return emailToken
    }

    getEmailByOtpId = async (id: string) => {
        const otpRecord = await this.otpRepository.getOtpById(id)
        if (!otpRecord) throw new NotFoundException("Otp record not found with the provided id")
        return otpRecord.email
    }

    verifyOtp = async (otp: string, emailToken: string) => {
        const { email } = verify(emailToken, this.tokenSignature) as JwtPayload & {
            email: string
        }

        const otpRecord = await this.otpRepository.findActiveOtp(email, "email_verification")

        if (!otpRecord) throw new ExpiredException("OTP expired or invalid")

        if (otpRecord.attempts >= 5) throw new RateLimitException("Too many attempts")

        const isValid = await compare(otp, otpRecord.otpHash)

        if (!isValid) {
            await this.otpRepository.incrementAttempts(otpRecord.id)
            throw new UnauthorizedException("Invalid OTP")
        }

        await this.otpRepository.markAsUsedAndVerified(otpRecord.id)
        return otpRecord.id
    }
}
