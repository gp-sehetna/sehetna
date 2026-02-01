import { IOtp } from "@/shared/db/model/otp.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"
import { Model } from "mongoose"

export class OtpRepository extends DatabaseRepository<IOtp> {
    constructor(model: Model<IOtp>) {
        super(model)
    }

    async create(data: Partial<IOtp>) {
        return await this.model.create(data)
    }

    async invalidatePrevious(email: string, purpose: IOtp["purpose"]) {
        return await this.model.updateMany({ email, purpose, used: false }, { used: true }).exec()
    }

    async findActiveOtp(email: string, purpose: IOtp["purpose"]) {
        return await this.model
            .findOne({
                email,
                purpose,
                used: false,
                expiresAt: { $gt: new Date() },
            })
            .exec()
    }

    async incrementAttempts(id: string) {
        return await this.model
            .findByIdAndUpdate(id, { $inc: { attempts: 1 } }, { new: true })
            .exec()
    }

    async markAsUsedAndVerified(id: string) {
        return await this.model
            .findByIdAndUpdate(id, { used: true, verified: true }, { new: true })
            .exec()
    }

    async getOtpById(id: string) {
        return await this.model.findById(id).exec()
    }
}
