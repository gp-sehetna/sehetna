import { connectMongodb } from "@/shared/db/mongodb.client"
import logger from "@/shared/logger"

import { UserModel } from "@/shared/db/model/user.model"
import { UserRepository } from "@/shared/db/repository/user.repository"

import { AuthService } from "@/features/auth/auth.service"
import { DataStoreService } from "@/features/datastores/datastore.service"
import { EngagementsService } from "@/features/engagements/engagements.service"
import { ForecastService } from "@/features/environment/forecast/forecast.service"
import { WeekService } from "@/features/environment/week/week.service"
import { AiModelModel } from "@/shared/db/model/ai-model.model"
import { EngagementModel } from "@/shared/db/model/contact.model"
import { DataStoreModel } from "@/shared/db/model/data-store.model"
import { LocationModel } from "@/shared/db/model/location.model"
import { OtpModel } from "@/shared/db/model/otp.model"
import { PredictionModel } from "@/shared/db/model/prediction.model"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"
import { DataStoreRepository } from "@/shared/db/repository/data-store.repository"
import { EngagementRepository } from "@/shared/db/repository/engagement.repository"
import { LocationRepository } from "@/shared/db/repository/location.repository"
import { OtpRepository } from "@/shared/db/repository/otp.repository"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"
import { EmailService } from "@/shared/email/email.service"

type MainServiceOptions = {
    db?: boolean
}

export class MainService {
    private static instance: MainService | null = null
    private static initialized = false
    private static emailService = new EmailService()

    public readonly authService = new AuthService(
        new UserRepository(UserModel),
        new OtpRepository(OtpModel),
        MainService.emailService
    )
    public readonly weekService = new WeekService()
    public readonly engagementService = new EngagementsService(
        new EngagementRepository(EngagementModel),
        MainService.emailService
    )
    public readonly dataStoreService = new DataStoreService(new DataStoreRepository(DataStoreModel))
    public readonly forecastService = new ForecastService(
        new PredictionRepository(PredictionModel),
        new AiModelRepository(AiModelModel),
        new LocationRepository(LocationModel)
    )

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
