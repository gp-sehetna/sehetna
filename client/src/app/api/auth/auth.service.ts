import { generateHash } from "@/lib/auth/hash"
import { ISignupInputsDTO } from "@/lib/modules/auth/auth.dto"
import { UserModel } from "@/shared/db/model/user.model"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { ConflictException } from "@/shared/http/errors"

export class AuthService {
    constructor() {}
    private userModel = new UserRepository(UserModel)

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
            data: [{ firstName, lastName, email, password : await generateHash({plainText : password}) }],
            options: { validateBeforeSave: true },
        })

        return user
    }
}
