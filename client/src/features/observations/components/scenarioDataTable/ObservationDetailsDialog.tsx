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
} from "@/features/observations/Observation.formatters"
import type { ScenarioObservation } from "@/features/observations/Observation.types"
import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import DetailSection from "./DetailSection"
import DetailRow from "./DetailRow"

const ObservationDetailsDialog = ({
    observation,
    onOpenChange,
}: {
    observation: ScenarioObservation | null
    onOpenChange: (open: boolean) => void
}) => (
    <Dialog open={!!observation} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Observation Details</DialogTitle>
                <DialogDescription>
                    {observation && observation.locationName
                        ? `${observation.locationName} on ${formatScenarioDate(observation.baseDate)}`
                        : "Scenario observation details"}
                </DialogDescription>
            </DialogHeader>
            {observation && (
                <div className="grid gap-4 md:grid-cols-2">
                    <DetailSection title="General">
                        <DetailRow label="Date" value={formatScenarioDate(observation.baseDate)} />
                        <DetailRow
                            label="Location"
                            value={observation.locationName ?? missingValue("Unknown")}
                        />
                    </DetailSection>
                    <DetailSection title="Climate">
                        <DetailRow
                            label="Temperature"
                            value={
                                formatNumber(observation.climate.temperatureCelsius, "°C") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Precipitation"
                            value={
                                formatNumber(observation.climate.precipitationMm, "mm") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Heat Wave Days"
                            value={
                                formatInteger(observation.climate.heatWaveDays, "days") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="Flood Indicator"
                            value={
                                <SeverityBadge
                                    severity={getFloodSeverity(observation.climate.floodIndicator)}
                                />
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Air Quality">
                        <DetailRow
                            label="PM2.5"
                            value={
                                formatNumber(observation.airQuality.pm25Ugm3, "µg/m³") ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="AQI"
                            value={
                                <SeverityBadge
                                    severity={getAqiSeverity(observation.airQuality.aqiPm)}
                                />
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Socioeconomic">
                        <DetailRow
                            label="Food Production Index"
                            value={
                                formatNumber(observation.healthIndicators.foodProductionIndex) ??
                                missingValue()
                            }
                        />
                        <DetailRow
                            label="GDP Per Capita"
                            value={
                                formatCurrency(observation.healthIndicators.gdpPerCapitaUsd) ??
                                missingValue()
                            }
                        />
                    </DetailSection>
                    <DetailSection title="Health Outcomes">
                        {HEALTH_OUTCOMES_KEYS.map((key) => {
                            console.log("KEY", key, observation.healthOutcomes)
                            return (
                                <DetailRow
                                    key={key}
                                    label={key.replaceAll("_", " ")}
                                    value={
                                        formatNumber(observation.healthOutcomes![key]) ??
                                        missingValue()
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

export default ObservationDetailsDialog
