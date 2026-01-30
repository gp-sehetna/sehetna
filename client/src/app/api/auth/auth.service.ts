import { compareHash, generateHash } from "@/lib/auth/hash"
import { createCredentials } from "@/lib/auth/token"
import { ILoginInputsDTO, ISignupInputsDTO } from "@/lib/modules/auth/auth.dto"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { ConflictException, NotFoundException } from "@/shared/http/errors"

export class AuthService {
    constructor(private readonly userModel: UserRepository) {}
    // private userModel = new UserRepository(UserModel)

    signup = async ({
        data: { firstName, lastName, email, password },
    }: {
        data: ISignupInputsDTO
    }) => {
        const checkUserExist = await this.userModel.findOne({
            filter: { email },
        })

        if (checkUserExist) {
            throw new ConflictException("Email already exist")
        }

        const user = this.userModel.createUser({
            data: [
                {
                    firstName,
                    lastName,
                    email,
                    password: await generateHash({ plainText: password }),
                },
            ],
            options: { validateBeforeSave: true },
        })

        return user
    }

    login = async ({ data: { email, password } }: { data: ILoginInputsDTO }) => {
        const user = await this.userModel.findOne({
            filter: { email: email },
        })
        if (!user) {
            throw new NotFoundException("In-valid login data ")
        }
        if (!(await compareHash({ plainText: password, hash: user.password }))) {
            throw new NotFoundException("In-valid login data")
        }

        const credentials = await createCredentials({ user: user })

        return credentials
    }
}
