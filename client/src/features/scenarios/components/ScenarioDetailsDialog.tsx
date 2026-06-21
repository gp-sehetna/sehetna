"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/shadcn/dialog"
import {
    formatCurrency,
    formatInteger,
    formatNumber,
    formatScenarioDate,
    getAqiSeverity,
    getFloodSeverity,
    missingValue,
    SeverityBadge,
} from "@/features/scenarios/scenario.formatters"
import type { Scenario } from "@/features/scenarios/scenario.types"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import DetailSection from "./DetailSection"
import DetailRow from "./DetailRow"

const ScenarioDetailsDialog = ({
    observation,
    onOpenChange,
}: {
    observation: Scenario | null
    onOpenChange: (open: boolean) => void
}) => (
    <Dialog open={!!observation} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Observation Details</DialogTitle>
                <DialogDescription>
                    {observation && observation.location_id.name
                        ? `${observation.location_id.name} on ${formatScenarioDate(observation.base_date)}`
                        : "Scenario observation details"}
                </DialogDescription>
            </DialogHeader>
            {observation && (
                <div className="grid gap-4 md:grid-cols-2">
                    <DetailSection title="General">
                        <DetailRow label="Date" value={formatScenarioDate(observation.base_date)} />
                        <DetailRow
                            label="Location"
                            value={observation.location_id.name ?? missingValue("Unknown")}
                        />
                    </DetailSection>
                    <DetailSection title="Climate">
                        <DetailRow
                            label="Temperature"
                            value={
                                formatNumber(observation.climate.temperature_celsius, "°C") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Precipitation"
                            value={
                                formatNumber(observation.climate.precipitation_mm, "mm") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Heat Wave Days"
                            value={
                                formatInteger(observation.climate.heat_wave_days, "days") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Flood Indicator"
                            value={
                                <SeverityBadge
                                    severity={getFloodSeverity(observation.climate.flood_indicator)}
                                />
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Air Quality">
                        <DetailRow
                            label="PM2.5"
                            value={
                                formatNumber(observation.air_quality.pm25_ugm3, "µg/m³") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="AQI"
                            value={
                                <SeverityBadge
                                    severity={getAqiSeverity(observation.air_quality.aqi_pm)}
                                />
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Socioeconomic">
                        <DetailRow
                            label="Food Production Index"
                            value={
                                formatNumber(observation.health_indicators.food_production_index) ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="GDP Per Capita"
                            value={
                                formatCurrency(observation.health_indicators.gdp_per_capita_usd) ??
                                missingValue()
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Health Outcomes">
                        {HEALTH_OUTCOMES_KEYS.map((key) => {
                            console.log("KEY", key, observation.prediction_id.health_outcomes[key])
                            return (
                                <DetailRow
                                    key={key}
                                    label={key.replaceAll("_", " ")}
                                    value={
                                        formatNumber(
                                            observation.prediction_id.health_outcomes[key].point
                                        ) ?? missingValue()
                                    }
                                />
                            )
                        })}
                    </DetailSection>
                    <DetailSection title="Notes">
                        <DetailRow
                            label="Current Note"
                            value={observation.note || missingValue()}
                        />
                    </DetailSection>
                </div>
            )}
        </DialogContent>
    </Dialog>
)

export default ScenarioDetailsDialog
