import { IOtp, OtpModel } from "@/shared/db/model/otp.model"
import { DatabaseRepository } from "@/shared/db/repository/database.repository"

export class OtpRepository extends DatabaseRepository<IOtp> {
    constructor(protected override readonly model: typeof OtpModel) {
        super(model)
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
}
