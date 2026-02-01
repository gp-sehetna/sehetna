import { ILoginInputsDTO, PasswordAndNameInputsDTO } from "@/features/auth/auth.dto"
import { createTokens } from "@/lib/auth/token"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { EmailService } from "@/shared/email/email.service"
import { ConflictException, NotFoundException, ValidationException } from "@/shared/http/errors"
import { compare, hash } from "bcrypt"
import { OTPService } from "@/features/otp/otp.service"
import { OtpRepository } from "@/shared/db/repository/otp.repository"

export class AuthService extends OTPService {
    constructor(
        private readonly userRepository: UserRepository,
        otpRepository: OtpRepository,
        emailService: EmailService
    ) {
        super(otpRepository, emailService)
    }

    updateUserPassword = async (id: string, password: string) => {
        const updatedUser = await this.userRepository.updateUserPasswordById(id, password)
        if (!updatedUser)
            throw new NotFoundException(`User by ID (${id}) not found in the Database`)
        return updatedUser.id
    }

    getUserIdByEmail = async (email: string) => {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new NotFoundException(`User by email (${email}) not found in the Database`)
        return user.id
    }

    signup = async ({ firstName, lastName, password }: PasswordAndNameInputsDTO, otpId: string) => {
        const email = await this.getEmailByOtpId(otpId)
        const checkUserExist = await this.userRepository.findByEmail(email)
        if (checkUserExist) throw new ConflictException("Email already exists")

        const hashedPassword = await hash(password, 10)
        const user = { firstName, lastName, password: hashedPassword }
        const createdUser = await this.userRepository.create([user])
        this.emailService.sendWelcome(email)

        return createdUser
    }

    login = async ({ email, password }: ILoginInputsDTO) => {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new NotFoundException("User not found with the provided email")
        const isPasswordValid = await compare(password, user.password)

        if (!isPasswordValid) throw new ValidationException("Invalid credentials")

        return await createTokens(user)
    }
}
