import { IPrediction } from "@/shared/db/model/prediction.model"
import { PredictionRepository } from "@/shared/db/repository/prediction.repository"

export class PredictionService {
    constructor(private readonly predictionRepository: PredictionRepository) {}
    async insertMany(predictions: IPrediction[]) {
        return await this.predictionRepository.insertMany(predictions)
    }

    async createPrediction(prediction: IPrediction) {
        return await this.predictionRepository.create(prediction)
    }

    async findHistoricalDelete() {
        return await this.predictionRepository.deleteAllHistorical()
    }

    async findAllPredictions() {
        return await this.predictionRepository.findPredictionsGroupedByLoc()
    }
}
