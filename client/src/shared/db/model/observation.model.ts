import { HealthOutcomesKeys } from "@/shared/config/health-outcomes"
import { InferSchemaType, Model, ObjectId, Require_id, Schema, model, models } from "mongoose"
const climateSchema = new Schema(
    {
        temperature_celsius: { type: Number, default: 0 },
        precipitation_mm: { type: Number, default: 0 },
        heat_wave_days: { type: Number, default: 0, enum: [0, 1, 2, 3, 4, 5, 6, 7] },
        flood_indicator: { type: Number, enum: [0, 1], default: 0 },
    },
    { _id: false }
)

const airQualitySchema = new Schema(
    {
        pm25_ugm3: { type: Number, default: 0 },
        aqi_pm: { type: Number, default: 0 },
    },
    { _id: false }
)

const healthIndicatorsSchema = new Schema(
    {
        gdp_per_capita_usd: { type: Number, default: 0 },
        food_production_index: { type: Number, default: null },
        // healthcare_access_index
    },
    { _id: false }
)

const ObservationSchema = new Schema(
    {
        prediction_id: { type: Schema.Types.ObjectId, ref: "Prediction" },
        location_id: { type: Schema.Types.ObjectId, ref: "Location", required: true },
        base_date: { type: Date, required: true },
        climate: { type: climateSchema, required: true },
        air_quality: { type: airQualitySchema, required: true },
        health_indicators: { type: healthIndicatorsSchema, required: true },
        note: { type: String, default: null },
    },
    { timestamps: true }
)

type ILocation = {
    _id: ObjectId
    name: string
}

type IPrediction = {
    _id: ObjectId
    health_outcomes: Record<HealthOutcomesKeys, {point: number}>
}

export type Binary = 0 | 1
export type WeekDaysCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type IObservation = Require_id<InferSchemaType<typeof ObservationSchema>>
export type IObservationPopulated = Omit<
    IObservation,
    "location_id" | "prediction_id"
> & {
    location_id: ILocation
    prediction_id: IPrediction
}

ObservationSchema.index({ location_id: 1 })

export const ObservationModel: Model<IObservation> =
    models.Observation || model<IObservation>("Observation", ObservationSchema)
