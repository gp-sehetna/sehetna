import { nullableNumber } from "@/lib/utils/object"
import { IHealthOutcomes, mapHealthOutcomes } from "@/shared/config/health-outcomes"
import { InferSchemaType, Model, Require_id, Schema, model, models } from "mongoose"

const HealthOutcomesSchema = new Schema<IHealthOutcomes>(
    mapHealthOutcomes(() => nullableNumber),
    { _id: false }
)

const ObservationSchema = new Schema(
    {
        location_id: { type: Schema.Types.ObjectId, ref: "Location", required: true },
        base_date: { type: Date, required: true },
        climate: {
            temperature_celsius: nullableNumber,
            precipitation_mm: nullableNumber,
            heat_wave_days: nullableNumber,
            flood_indicator: nullableNumber,
        },
        air_quality: {
            pm25_ugm3: nullableNumber,
            aqi_pm: nullableNumber,
        },
        health_indicators: {
            healthcare_access_index: nullableNumber,
            food_security_index: nullableNumber,
            uhs_service_coverage_index: nullableNumber,
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
