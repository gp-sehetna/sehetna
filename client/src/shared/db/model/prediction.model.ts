import { IHealthOutcomes, mapHealthOutcomes } from "@/shared/config/health-outcomes"
import { PredictionType } from "@/shared/db/enums/prediction.enum"
import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose"

const IntervalPredictionSchema = new Schema(
    {
        point: { type: Number, required: true },
        lower: { type: Number, default: null },
        upper: { type: Number, default: null },
    },
    { _id: false }
)

type IIntervalPredictionSchema = InferSchemaType<typeof IntervalPredictionSchema>
export type IHealthOutcomesWithIntervals = IHealthOutcomes<IIntervalPredictionSchema>

const HealthOutcomesWithIntervalsSchema = new Schema(
    mapHealthOutcomes(() => ({ type: IntervalPredictionSchema, required: true })),
    { _id: false }
)

const PredictionSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        model_id: { type: Schema.Types.ObjectId, ref: "AiModel", default: null },
        location_id: { type: Schema.Types.ObjectId, ref: "Location", required: true },
        base_date: { type: Date, default: new Date() },
        prediction_type: { type: String, enum: PredictionType, default: PredictionType.forecasted },
        health_outcomes: { type: HealthOutcomesWithIntervalsSchema, required: true },
    },
    { timestamps: { createdAt: true } }
)

export type IPrediction = InferSchemaType<typeof PredictionSchema>
export type PredictionForeignKeys = {
    user_id: Types.ObjectId
    model_id: Types.ObjectId
    location_id: Types.ObjectId
}

PredictionSchema.index(
    { model_id: 1, location_id: 1, prediction_type: 1, base_date: 1 },
    { name: "model_location_type_date_index" }
)
PredictionSchema.index(
    { location_id: 1, prediction_type: 1, base_date: 1 },
    { name: "location_type_date_index" }
)
PredictionSchema.index({ user_id: 1, base_date: 1 }, { name: "user_base_date_index" })

export const PredictionModel: Model<IPrediction> =
    models.Prediction || model<IPrediction>("Prediction", PredictionSchema)
