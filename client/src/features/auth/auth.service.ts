import { ILoginInputsDTO, ISignupInputsDTO } from "@/features/auth/auth.dto"
import { createCredentials } from "@/lib/auth/token"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { ConflictException, NotFoundException, ValidationException } from "@/shared/http/errors"
import { compare as compareHash, hash as generateHash } from "bcrypt"

export class AuthService {
    constructor(private readonly userRepository: UserRepository) {}

    signup = async ({ firstName, lastName, email, password }: ISignupInputsDTO) => {
        const checkUserExist = await this.userRepository.findByEmail(email)
        if (checkUserExist) throw new ConflictException("Email already exists")

        const hashedPassword = await generateHash(password, 10)
        const user = { firstName, lastName, email, password: hashedPassword }

        return this.userRepository.create([user])
    }

    login = async ({ email, password }: ILoginInputsDTO) => {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new NotFoundException("User not found with the provided email")
        const isPasswordValid = await compareHash(password, user.password)

        if (!isPasswordValid) throw new ValidationException("Invalid credentials")

        return await createCredentials(user)
    }
}
