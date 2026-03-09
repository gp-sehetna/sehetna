import { buildSteps } from "@/lib/utils/array"
import { nullableNumber, numberWithDefault } from "@/lib/utils/object"
import { IHealthOutcomes, mapHealthOutcomes } from "@/shared/config/health-outcomes"
import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

const Binary = [0, 1]
const WeekDaysCount = buildSteps(0, 7, 1)

const HealthOutcomesSchema = new Schema<IHealthOutcomes>(
    mapHealthOutcomes(() => nullableNumber),
    { _id: false }
)

const ObservationSchema = new Schema(
    {
        location_id: { type: Schema.Types.ObjectId, ref: "Location", required: true },
        base_date: { type: Date, required: true },
        climate: {
            temperature_celsius: numberWithDefault,
            precipitation_mm: numberWithDefault,
            heat_wave_days: { type: WeekDaysCount, default: 0 },
            flood_indicator: { type: Binary, default: 0 },
        },
        air_quality: {
            pm25_ugm3: numberWithDefault,
            aqi_pm: numberWithDefault,
        },
        health_indicators: {
            healthcare_access_index: numberWithDefault,
            food_security_index: numberWithDefault,
            uhs_service_coverage_index: numberWithDefault,
        },
        targets: { type: HealthOutcomesSchema, required: true },

        data_source_tags: { type: [String], default: [] },
    },
    { timestamps: { createdAt: true } }
)

export type IObservation = Require_id<InferSchemaType<typeof ObservationSchema>>

/**
 * Indexes
 * - Primary pattern: fetch a country's full timeline in order
 * - Temporal range with country filter
 */
ObservationSchema.index({ location_id: 1, base_date: 1 }, { unique: true })
ObservationSchema.index({ data_source_tags: 1 })

export const ObservationModel: Model<IObservation> =
    models.Observation || model<IObservation>("Observation", ObservationSchema)
