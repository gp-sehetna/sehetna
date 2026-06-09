import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

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
        healthcare_access_index: { type: Number, default: 0 },
        food_security_index: { type: Number, default: 0 },
        gdp_per_capita_usd: { type: Number, default: 0 },
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
    },
    { timestamps: { createdAt: true } }
)

export type Binary = 0 | 1
export type WeekDaysCount = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export type IObservation = Require_id<InferSchemaType<typeof ObservationSchema>>

/**
 * Indexes
 * - Primary pattern: fetch a country's full timeline in order
 * - Temporal range with country filter
 */
ObservationSchema.index({ location_id: 1, base_date: 1 }, { unique: true })

export const ObservationModel: Model<IObservation> =
    models.Observation || model<IObservation>("Observation", ObservationSchema)
