import { AiModelService } from "@/features/aimodels/aimodels.service"
import { AuthService } from "@/features/auth/auth.service"
import { GoogleAuthService } from "@/features/auth/google-auth.service"
import { DataStoreService } from "@/features/datastores/datastore.service"
import { EngagementsService } from "@/features/engagements/engagements.service"
import { PredictionService } from "@/features/environment/prediction/prediction.service"
import { WeekService } from "@/features/environment/week/week.service"
import { LocationService } from "@/features/locations/location.service"
import { AiModelModel } from "@/shared/db/model/ai-model.model"
import { EngagementModel } from "@/shared/db/model/contact.model"
import { DataStoreModel } from "@/shared/db/model/data-store.model"
import { LocationModel } from "@/shared/db/model/location.model"
import { OtpModel } from "@/shared/db/model/otp.model"
import { PredictionModel } from "@/shared/db/model/prediction.model"
import { UserModel } from "@/shared/db/model/user.model"
import { connectMongodb } from "@/shared/db/mongodb.client"
import { AiModelRepository } from "@/shared/db/repository/ai-model.repository"
import { DataStoreRepository } from "@/shared/db/repository/data-store.repository"
import { EngagementRepository } from "@/shared/db/repository/engagement.repository"
import { LocationRepository } from "@/shared/db/repository/location.repository"
import { OtpRepository } from "@/shared/db/repository/otp.repository"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"
import { UserRepository } from "@/shared/db/repository/user.repository"
import { EmailService } from "@/shared/email/email.service"
import { ObservationRepository } from "./repository/observation.repository"
import { ObservationModel } from "./model/observation.model"

type MainServiceOptions = {
    db?: boolean
}

export class MainService {
    private static instance: MainService | null = null
    private static initialized = false
    private emailService = new EmailService()
    private userRepository = new UserRepository(UserModel)

    private aiModelRepository = new AiModelRepository(AiModelModel)
    private locationRepository = new LocationRepository(LocationModel)
    private predictionRepository = new PredictionRepository(PredictionModel)
    private observationRepository = new ObservationRepository(ObservationModel)

    public readonly authService = new AuthService(
        this.userRepository,
        new OtpRepository(OtpModel),
        this.emailService
    )
    public readonly googleAuthService = new GoogleAuthService(
        this.userRepository,
        this.emailService
    )
    public readonly weekService = new WeekService()
    public readonly engagementService = new EngagementsService(
        new EngagementRepository(EngagementModel),
        this.emailService
    )
    public readonly dataStoreService = new DataStoreService(new DataStoreRepository(DataStoreModel))
    public readonly aiModelService = new AiModelService(this.aiModelRepository)

    public readonly predictionService = new PredictionService(
        this.predictionRepository,
        this.aiModelRepository,
        this.locationRepository,
        this.observationRepository
    )

    public readonly locationService = new LocationService(this.locationRepository)

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
        const _connection = await connectMongodb()
        // logger.debug(`MongoDB connected: ${_connection.connection.host}`)
    }
}
