import { connectMongodb } from "@/shared/db/mongodb.client"
import logger from "@/shared/logger"

import { UserModel } from "@/shared/db/model/user.model"
import { UserRepository } from "@/shared/db/repository/user.repository"

import { AuthService } from "@/features/auth/auth.service"
import { DataStoreService } from "@/features/datastores/datastore.service"
import { EngagementsService } from "@/features/engagements/engagements.service"
import { SimulateService } from "@/features/environment/simulate/simulate.service"
import { WeekService } from "@/features/environment/week/week.service"
import { OtpModel } from "@/shared/db/model/otp.model"
import { OtpRepository } from "@/shared/db/repository/otp.repository"
import { EmailService } from "@/shared/email/email.service"

type MainServiceOptions = {
    db?: boolean
}

export class MainService {
    private static instance: MainService | null = null
    private static initialized = false
    private static emailService = new EmailService()

    public readonly authService: AuthService = new AuthService(
        new UserRepository(UserModel),
        new OtpRepository(OtpModel),
        MainService.emailService
    )
    public readonly weekService: WeekService = new WeekService()
    public readonly simulateService: SimulateService = new SimulateService()
    public readonly engagementService = new EngagementsService(MainService.emailService)
    public readonly dataStoreService = new DataStoreService()

    private constructor() {}
    public static async getInstance(
        options: MainServiceOptions = { db: true }
    ): Promise<MainService> {
        if (!MainService.instance) {
            MainService.instance = new MainService()
            await MainService.instance.init(options)
            MainService.initialized = true
        }

        return MainService.instance
    }

    private async init(options: MainServiceOptions) {
        if (options.db) await this.initDatabase()
    }

    private async initDatabase() {
        const connection = await connectMongodb()
        logger.info(`MongoDB connected: ${connection.connection.host}`)
    }
}
