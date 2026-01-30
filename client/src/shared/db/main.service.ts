import { AuthService } from "@/app/api/auth/auth.service"
import { connectMongodb } from "./mongodb.client"
import { UserRepository } from "./repository/user.repository"
import { UserModel } from "./model/user.model"

export class MainService {
    private static instance: MainService

    public authService!: AuthService

    private constructor() {}

    public static async getInstance() {
        if (!MainService.instance) {
            MainService.instance = new MainService()
            await MainService.instance.init()
        }
        return MainService.instance
    }

    private async init() { //  this funtion perform 3 initializations [dbConnection , userRepository , authService].
        // 1️⃣ Connect to MongoDB (only once)
        const connection = await connectMongodb()

        console.log("✅ MongoDB connection successful!")

        // 2️⃣ Print all registered models
        console.log("Models registered in this connection:")
        console.log(Object.keys(connection.models).join(", "))

        // 3️⃣ Initialize services
        const userRepository = new UserRepository(UserModel)
        this.authService = new AuthService(userRepository)
    }
}
