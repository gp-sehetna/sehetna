import type { IHealthOutcomes } from "@/shared/config/health-outcomes"
import { Document, Schema, model, models } from "mongoose"
import { PredictionTypeEnum } from "../enums/prediction.enum"
import { nullableNumber } from "@/lib/utils/object"

export const HealthOutcomesSchema = new Schema<IHealthOutcomes>(
    {
        respiratory_disease_rate: nullableNumber,
        cardio_mortality_rate: nullableNumber,
        vector_disease_risk_score: nullableNumber,
        waterborne_disease_incidents: nullableNumber,
        heat_related_admissions: nullableNumber,
    },
    { _id: false }
)

export interface IPrediction extends Document {
    user_id: Schema.Types.ObjectId
    model_id: Schema.Types.ObjectId
    location_id: string
    base_date: Date
    prediction_type: PredictionTypeEnum
    input_snapshot: Record<string, any>
    predicted_targets: IHealthOutcomes
    createdAt: Date
}

const PredictionSchema = new Schema<IPrediction>(
    {
        user_id: { type: Schema.Types.ObjectId, required: true },
        model_id: { type: Schema.Types.ObjectId, required: true, index: true },
        location_id: { type: String, required: true },
        base_date: { type: Date, required: true },
        prediction_type: { enum: PredictionTypeEnum, default: PredictionTypeEnum.forecasted },
        input_snapshot: { type: Schema.Types.Mixed, default: () => ({}) },
        predicted_targets: { type: HealthOutcomesSchema, default: () => ({}) },
    },
    { timestamps: { createdAt: true } }
)

// create an index on model_id and location_id
PredictionSchema.index(
    { model_id: 1, location_id: 1 },
    { unique: true, name: "model_location_index" }
)

export const PredictionsModel =
    models.Prediction || model<IPrediction>("Prediction", PredictionSchema)
