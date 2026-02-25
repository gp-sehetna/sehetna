import { IHealthOutcomes, mapHealthOutcomes } from "@/shared/config/health-outcomes"
import { Document, InferSchemaType, Schema, Types, model, models } from "mongoose"
import { PredictionTypeEnum } from "../enums/prediction.enum"
import { IntervalPrediction, nullableNumber } from "@/lib/utils/object"

const IntervalPredictionSchema = new Schema<IntervalPrediction>(
    {
        point: { type: Number, required: true },
        lower: nullableNumber,
        upper: nullableNumber,
    },
    { _id: false }
)
const IntervalPredictionObject = { type: IntervalPredictionSchema, required: true }

const HealthOutcomesWithIntervalsSchema = new Schema<
    IHealthOutcomes<InferSchemaType<typeof IntervalPredictionSchema>>
>(
    mapHealthOutcomes(() => IntervalPredictionObject),
    { _id: false }
)

export interface IPrediction extends Document {
    user_id: Schema.Types.ObjectId
    model_id: Schema.Types.ObjectId
    location_id: Types.ObjectId
    base_date: Date
    prediction_type: PredictionTypeEnum
    features_snapshot: Record<string, unknown>
    health_outcomes: IHealthOutcomes
    createdAt: Date
}

const PredictionSchema = new Schema<IPrediction>(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        model_id: { type: Schema.Types.ObjectId, ref: "AiModel", required: true },
        location_id: { type: Schema.Types.ObjectId, ref: "Location", required: true },
        base_date: { type: Date, required: true },
        prediction_type: {
            type: String,
            enum: PredictionTypeEnum,
            default: PredictionTypeEnum.forecasted,
        },
        features_snapshot: { type: Schema.Types.Mixed, default: () => ({}) },
        health_outcomes: { type: HealthOutcomesWithIntervalsSchema, required: true },
    },
    { timestamps: { createdAt: true } }
)

// create an index on model_id and location_id
PredictionSchema.index(
    { model_id: 1, location_id: 1 },
    { unique: true, name: "model_location_index" }
)

export const PredictionModel =
    models.Prediction || model<IPrediction>("Prediction", PredictionSchema)
