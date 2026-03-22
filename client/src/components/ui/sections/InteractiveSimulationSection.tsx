"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Slider } from "@/components/ui/shadcn/slider"
import { Switch } from "@/components/ui/shadcn/switch"
import { Label } from "@/components/ui/shadcn/label"
import { Info } from "lucide-react"
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts"
import Divider from "../GlobalControls/Divider"
import { motion } from "motion/react"

interface SimulationState {
    temperature: number
    humidity: number
    aqi: number
    heatWave: boolean
    rainfall: boolean
    urbanHeatIsland: boolean
}

interface RiskOutcome {
    value: number
    trend: "Low" | "Moderate" | "High"
    color: string
    glowClass: string
    bgColor: string
}

interface Risks {
    heatRisk: number
    respRisk: number
    vectorRisk: number
    waterRisk: number
}

function calculateRisks(state: SimulationState): Risks {
    const { temperature, humidity, aqi, heatWave, rainfall, urbanHeatIsland } = state

    const heatRisk = Math.min(
        95,
        Math.max(
            5,
            Math.round(
                20 + (temperature - 20) * 1.8 + (urbanHeatIsland ? 10 : 0) + (heatWave ? 25 : 0)
            )
        )
    )

    const respRisk = Math.min(90, Math.max(5, Math.round(15 + aqi * 0.2 + (heatWave ? 10 : 0))))

    const vectorRisk = Math.min(
        85,
        Math.max(
            5,
            Math.round(30 + (humidity - 30) * 0.4 + (temperature - 25) * 0.5 + (rainfall ? 20 : 0))
        )
    )

    const waterRisk = Math.min(
        75,
        Math.max(5, Math.round(15 + (humidity - 40) * 0.3 + (rainfall ? 25 : 0)))
    )

    return { heatRisk, respRisk, vectorRisk, waterRisk }
}

function getRiskOutcome(value: number): RiskOutcome {
    if (value >= 60) {
        return {
            value,
            trend: "High",
            color: "text-[#f05500]",
            glowClass: "risk-glow-high",
            bgColor: "bg-[#f05500]/10",
        }
    } else if (value >= 40) {
        return {
            value,
            trend: "Moderate",
            color: "text-[#c9a88e]",
            glowClass: "risk-glow-medium",
            bgColor: "bg-[#c9a88e]/10",
        }
    } else {
        return {
            value,
            trend: "Low",
            color: "text-[#7a9e7e]",
            glowClass: "risk-glow-low",
            bgColor: "bg-[#7a9e7e]/10",
        }
    }
}

function generateRecommendation(
    heatRisk: number,
    respRisk: number,
    vectorRisk: number,
    waterRisk: number,
    rainfall: boolean
): string {
    const recommendations: string[] = []

    if (heatRisk > 60) {
        recommendations.push(
            "Activate cooling centers and increase water distribution in affected areas"
        )
    }
    if (respRisk > 50) {
        recommendations.push("Issue air quality advisories and prepare respiratory care facilities")
    }
    if (vectorRisk > 50) {
        recommendations.push("Intensify vector control measures and community awareness campaigns")
    }
    if (waterRisk > 40 && rainfall) {
        recommendations.push(
            "Monitor water quality and prepare waterborne disease response protocols"
        )
    }

    if (recommendations.length === 0) {
        return "Current conditions are within normal parameters. Continue routine monitoring and maintain preparedness protocols."
    }

    return recommendations.join(". ") + "."
}

function getGlowGradient(avgRisk: number): string {
    if (avgRisk > 60) {
        return "radial-gradient(circle, rgba(240,85,0,0.2) 0%, transparent 70%)"
    } else if (avgRisk > 40) {
        return "radial-gradient(circle, rgba(201,168,142,0.2) 0%, transparent 70%)"
    } else {
        return "radial-gradient(circle, rgba(122,158,126,0.2) 0%, transparent 70%)"
    }
}

function OutcomeCard({ label, outcome }: { label: string; outcome: RiskOutcome }) {
    return (
        <div
            className={`rounded-2xl p-4 text-center transition-all duration-500 ${outcome.bgColor} ${outcome.glowClass}`}
        >
            <div className="text-muted-foreground mb-2 text-xs">{label}</div>
            <div
                className={`font-heading text-3xl font-bold transition-all duration-500 ${outcome.color}`}
            >
                {outcome.value}%
            </div>
            <div className={`mt-1 text-xs transition-all duration-500 ${outcome.color}`}>
                {outcome.trend}
            </div>
        </div>
    )
}

function RiskTimeline({ risks }: { risks: Risks }) {
    const data = useMemo(() => {
        const points = []

        for (let i = 0; i <= 14; i++) {
            const t = i / 14

            // --- 1. Base level (starting point)
            const base = 10 + risks.heatRisk * 0.3

            // --- 2. Trend (heat → gradual increase)
            const trend = risks.heatRisk * 0.6 * t * 50

            // --- 3. Volatility (resp → noisy air quality effect)
            const volatility = Math.sin(i * 1.5) * risks.respRisk * 8

            // --- 4. Lagged spike (vector diseases → delayed impact)
            const lagSpike = risks.vectorRisk * 30 * Math.exp(-Math.pow(i - 10, 2) / 8)

            // --- 5. Sudden jumps (water → instability)
            const jumps = Math.sin(i * 3 + risks.waterRisk) > 0.7 ? 15 : 0

            const risk = base + trend + volatility + lagSpike + jumps

            points.push({
                time: i,
                risk: Math.round(risk / 10),
            })
        }

        return points
    }, [risks])

    return (
        <Card className="rounded-2xl bg-white/50 p-4">
            <div className="text-muted-foreground mb-4 text-xs">2-Week Risk</div>

            <div className="h-32 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="0%"
                                    stopColor="var(--color-primary)"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="var(--color-primary)"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10 }}
                            tickFormatter={(t) =>
                                t === 0
                                    ? "Now"
                                    : t === 2
                                      ? "2d"
                                      : t === 7
                                        ? "1w"
                                        : t === 14
                                          ? "2w"
                                          : ""
                            }
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis hide domain={[0, 100]} />

                        <Tooltip
                            formatter={(value: number) => `${value}% risk`}
                            labelFormatter={(label) => (label === 0 ? "Now" : `${label}d`)}
                        />

                        <Area
                            type="monotone"
                            dataKey="risk"
                            stroke="var(--color-primary)"
                            strokeWidth={2}
                            fill="url(#riskGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}

function ParameterSlider({
    label,
    value,
    onChange,
    min,
    max,
    unit,
    minLabel,
    maxLabel,
}: {
    label: string
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    unit?: string
    minLabel: string
    maxLabel: string
}) {
    return (
        <div>
            <div className="mb-3 flex justify-between">
                <Label className="text-foreground text-sm font-medium">{label}</Label>
                <span className="text-primary text-sm font-semibold">
                    {value}
                    {unit}
                </span>
            </div>
            <Slider
                value={[value]}
                onValueChange={([val]) => onChange(val)}
                min={min}
                max={max}
                step={1}
                className="gradient-slider"
                aria-label={label}
            />
            <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        </div>
    )
}

function ScenarioToggle({
    label,
    checked,
    onCheckedChange,
}: {
    label: string
    checked: boolean
    onCheckedChange: (checked: boolean) => void
}) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">{label}</span>
            <Switch
                className="data-[state=checked]:bg-success-200/60"
                checked={checked}
                onCheckedChange={onCheckedChange}
                aria-label={`Toggle ${label}`}
            />
        </div>
    )
}

export function InteractiveScenarioSimulationSection() {
    const [state, setState] = useState<SimulationState>({
        temperature: 35,
        humidity: 45,
        aqi: 75,
        heatWave: false,
        rainfall: false,
        urbanHeatIsland: true,
    })

    const updateState = useCallback((updates: Partial<SimulationState>) => {
        setState((prev) => ({ ...prev, ...updates }))
    }, [])

    const risks = useMemo(() => calculateRisks(state), [state])
    const outcomes = useMemo(
        () => ({
            heat: getRiskOutcome(risks.heatRisk),
            resp: getRiskOutcome(risks.respRisk),
            vector: getRiskOutcome(risks.vectorRisk),
            water: getRiskOutcome(risks.waterRisk),
        }),
        [risks]
    )

    const avgRisk = (risks.heatRisk + risks.respRisk + risks.vectorRisk + risks.waterRisk) / 4
    const recommendation = useMemo(
        () =>
            generateRecommendation(
                risks.heatRisk,
                risks.respRisk,
                risks.vectorRisk,
                risks.waterRisk,
                state.rainfall
            ),
        [risks, state.rainfall]
    )

    return (
        <section className="relative overflow-hidden py-8 md:py-32">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-[#e8dfd5]/30 via-transparent to-transparent" />

            <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 md:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto flex max-w-3xl flex-col gap-6 text-center"
                >
                    <Divider hideDecorations>
                        <p className="glassy-chip">Interactive Simulation</p>
                    </Divider>
                    <h2 className="font-heading text-foreground mb-6 text-3xl font-bold text-balance md:text-5xl">
                        Explore What-If Scenarios
                    </h2>
                    <p className="text-muted-foreground text-lg text-pretty">
                        Adjust environmental parameters and instantly see how projected health
                        outcomes change. Decision-makers can test intervention strategies before
                        implementation.
                    </p>
                </motion.div>

                {/* Main content grid */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="grid gap-8 lg:grid-cols-2"
                >
                    {/* Controls Panel */}
                    <Card className="rounded-3xl border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className="font-heading text-xl font-semibold">
                                Environmental Parameters
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            <ParameterSlider
                                label="Average Temperature"
                                value={state.temperature}
                                onChange={(val) => updateState({ temperature: val })}
                                min={20}
                                max={50}
                                unit="°C"
                                minLabel="20°C"
                                maxLabel="50°C"
                            />

                            <ParameterSlider
                                label="Relative Humidity"
                                value={state.humidity}
                                onChange={(val) => updateState({ humidity: val })}
                                min={10}
                                max={90}
                                unit="%"
                                minLabel="10%"
                                maxLabel="90%"
                            />

                            <ParameterSlider
                                label="Air Quality Index (AQI)"
                                value={state.aqi}
                                onChange={(val) => updateState({ aqi: val })}
                                min={0}
                                max={300}
                                minLabel="Good"
                                maxLabel="Hazardous"
                            />

                            {/* Toggle Options */}
                            <div className="border-border/50 border-t pt-4">
                                <h4 className="text-foreground mb-4 text-sm font-medium">
                                    Scenario Factors
                                </h4>
                                <div className="space-y-4">
                                    <ScenarioToggle
                                        label="Extreme Heat Wave Event"
                                        checked={state.heatWave}
                                        onCheckedChange={(val) => updateState({ heatWave: val })}
                                    />
                                    <ScenarioToggle
                                        label="Heavy Rainfall Period"
                                        checked={state.rainfall}
                                        onCheckedChange={(val) => updateState({ rainfall: val })}
                                    />
                                    <ScenarioToggle
                                        label="Urban Heat Island Effect"
                                        checked={state.urbanHeatIsland}
                                        onCheckedChange={(val) =>
                                            updateState({ urbanHeatIsland: val })
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Results Panel */}
                    <Card className="relative overflow-hidden rounded-3xl border-0 shadow-none">
                        {/* Ambient Glow */}
                        <div
                            className="absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl transition-all duration-500"
                            style={{ background: getGlowGradient(avgRisk) }}
                        />

                        <CardHeader className="relative z-10">
                            <CardTitle className="font-heading text-xl font-semibold">
                                Projected Outcomes
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="relative z-10 space-y-6">
                            {/* Outcome Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <OutcomeCard label="Heatstroke Risk" outcome={outcomes.heat} />
                                <OutcomeCard label="Respiratory Risk" outcome={outcomes.resp} />
                                <OutcomeCard label="Vector-Borne" outcome={outcomes.vector} />
                                <OutcomeCard label="Water-Borne" outcome={outcomes.water} />
                            </div>

                            {/* Risk Timeline */}
                            <RiskTimeline risks={risks} />

                            {/* Recommendation */}
                            <div className="rounded-xl border border-[#9fb5a0]/30 bg-[#9fb5a0]/20 p-4">
                                <div className="flex items-start gap-3">
                                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#7a9e7e]" />
                                    <div>
                                        <div className="text-foreground text-sm font-medium">
                                            AI Recommendation
                                        </div>
                                        <p className="text-muted-foreground mt-1 text-xs">
                                            {recommendation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    )
}
