import { connectMongodb } from "@/shared/db/mongodb.client"
import logger from "@/shared/logger"

import { UserModel } from "@/shared/db/model/user.model"
import { UserRepository } from "@/shared/db/repository/user.repository"

import { EmailService } from "@/shared/email/email.service"
import { AuthService } from "@/features/auth/auth.service"
import { WeekService } from "@/features/environment/week/week.service"
import { OtpRepository } from "./repository/otp.repository"
import { OtpModel } from "@/shared/db/model/otp.model"

type MainServiceOptions = {
    db?: boolean
}

export class MainService {
    private static instance: MainService | null = null

    public authService!: AuthService
    public weekService!: WeekService

    private constructor() {}

    public static async getInstance(
        options: MainServiceOptions = { db: true }
    ): Promise<MainService> {
        if (!MainService.instance) {
            const service = new MainService()
            await service.init(options)
            MainService.instance = service
        }
        return MainService.instance
    }

    private async init(options: MainServiceOptions) {
        if (options.db) await this.initDatabase()

        // initialize AFTER DB + AFTER module graph settles
        this.authService = new AuthService(
            new UserRepository(UserModel),
            new OtpRepository(OtpModel),
            new EmailService()
        )

        this.weekService = new WeekService()
    }

    private async initDatabase() {
        const connection = await connectMongodb()
        logger.info(`MongoDB connected: ${connection.connection.host}`)
    }
}
