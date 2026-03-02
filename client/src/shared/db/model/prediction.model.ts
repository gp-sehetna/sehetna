import { IntervalPrediction, nullableNumber } from "@/lib/utils/object"
import { IHealthOutcomes, mapHealthOutcomes } from "@/shared/config/health-outcomes"
import { PredictionTypeEnum } from "@/shared/db/enums/prediction.enum"
import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

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

const PredictionSchema = new Schema(
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

export type IPrediction = Require_id<InferSchemaType<typeof PredictionSchema>>

PredictionSchema.index(
    { model_id: 1, location_id: 1 },
    { unique: true, name: "model_location_index" }
)
PredictionSchema.index({ user_id: 1 }, { unique: true, name: "user_model_index" })

export const PredictionModel: Model<IPrediction> =
    models.Prediction || model<IPrediction>("Prediction", PredictionSchema)
