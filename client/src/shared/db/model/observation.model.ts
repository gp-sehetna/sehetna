import { Document, InferSchemaType, Schema, Types, model, models } from "mongoose"
import { nullableNumber } from "@/lib/utils/object"
import { HealthOutcomesSchema } from "./prediction.model"

export interface IObservation extends Document {
    location_id: Types.ObjectId
    base_date: Date
    climate: {
        temperature_celsius: number | null
        precipitation_mm: number | null
        heat_wave_days: number | null
        flood_indicator: number | null
    }
    air_quality: {
        pm25_ugm3: number | null
        aqi_pm: number | null
    }
    health_indicators: {
        healthcare_access_index: number | null
        food_security_index: number | null
        uhs_service_coverage_index: number | null
    }
    targets: InferSchemaType<typeof HealthOutcomesSchema>
    data_source_tags: string[]
    createdAt: Date
}

const ObservationSchema = new Schema<IObservation>(
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

/**
 * Indexes
 * - Primary pattern: fetch a country's full timeline in order
 * - datasource_id: provenance — all rows from a given source
 * - Temporal range with country filter
 */
ObservationSchema.index({ location_code: 1, date: 1 }, { unique: true })
ObservationSchema.index({ datasource_id: 1 })
ObservationSchema.index({ year: 1, week: 1, location_code: 1 })

export const ObservationModel =
    models.Observation || model<IObservation>("Observation", ObservationSchema)
