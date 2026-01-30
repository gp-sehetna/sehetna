import { CreateOptions, Model } from "mongoose"
import { DatabaseRepository } from "./database.repository"

import { IUser as TDocument } from "./../model/user.model"
import { BadRequestException } from "@/shared/http/errors"

export class UserRepository extends DatabaseRepository<TDocument> {

    constructor(protected override readonly model: Model<TDocument>) {
        super(model)
    }

    async createUser({ data, options }: { data: Partial<TDocument>[]; options?: CreateOptions }) {
        const [user] = (await this.create({ data: data, options: options })) || []
        if (!user) {
            throw new BadRequestException("Fail to signup this user")
        }

        return user
    }
}

