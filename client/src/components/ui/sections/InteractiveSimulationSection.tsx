"use client"

import { useCallback, useMemo, useState } from "react"
import { motion } from "motion/react"
import { Info } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/shadcn/card"
import { Label } from "@/components/ui/shadcn/label"
import { Slider } from "@/components/ui/shadcn/slider"
import { Switch } from "@/components/ui/shadcn/switch"
import SectionEyebrow from "./SectionEyebrow"
import SectionShell from "./SectionShell"
import { fadeUp } from "./motion"

interface SimulationState {
    temperature: number
    humidity: number
    aqi: number
    heatWave: boolean
    rainfall: boolean
    urbanHeatIsland: boolean
}

interface Risks {
    heatRisk: number
    respRisk: number
    vectorRisk: number
    waterRisk: number
}

type RiskTone = "high" | "moderate" | "low"

const riskToneMap: Record<
    RiskTone,
    { labelClassName: string; surfaceClassName: string; glowClass: string; glowColor: string }
> = {
    high: {
        labelClassName: "text-primary-500",
        surfaceClassName: "bg-primary-100/30",
        glowClass: "risk-glow-high",
        glowColor: "rgba(240,85,0,0.2)",
    },
    moderate: {
        labelClassName: "text-earth",
        surfaceClassName: "bg-earth-100",
        glowClass: "risk-glow-medium",
        glowColor: "rgba(196,168,130,0.2)",
    },
    low: {
        labelClassName: "text-success",
        surfaceClassName: "bg-success-100/20",
        glowClass: "risk-glow-low",
        glowColor: "rgba(112,188,133,0.2)",
    },
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

function getRiskTone(value: number): RiskTone {
    if (value >= 60) return "high"
    if (value >= 40) return "moderate"
    return "low"
}

function generateRecommendation(risks: Risks, rainfall: boolean) {
    const recommendations: string[] = []

    if (risks.heatRisk > 60) {
        recommendations.push(
            "Activate cooling centers and increase water distribution in affected areas"
        )
    }
    if (risks.respRisk > 50) {
        recommendations.push("Issue air quality advisories and prepare respiratory care facilities")
    }
    if (risks.vectorRisk > 50) {
        recommendations.push("Intensify vector control measures and community awareness campaigns")
    }
    if (risks.waterRisk > 40 && rainfall) {
        recommendations.push(
            "Monitor water quality and prepare waterborne disease response protocols"
        )
    }

    if (!recommendations.length) {
        return "Current conditions are within normal parameters. Continue routine monitoring and maintain preparedness protocols."
    }

    return `${recommendations.join(". ")}.`
}

function getGlowGradient(avgRisk: number) {
    const tone = riskToneMap[getRiskTone(avgRisk)]
    return `radial-gradient(circle, ${tone.glowColor} 0%, transparent 70%)`
}

function OutcomeCard({ label, value }: { label: string; value: number }) {
    const tone = riskToneMap[getRiskTone(value)]

    return (
        <div
            className={`rounded-2xl p-4 text-center transition-all duration-500 ${tone.surfaceClassName} ${tone.glowClass}`}
        >
            <div className="text-muted-foreground mb-2 text-xs">{label}</div>
            <div
                className={`text-3xl font-bold transition-all duration-500 ${tone.labelClassName}`}
            >
                {value}%
            </div>
            <div
                className={`mt-1 text-xs font-medium uppercase transition-all duration-500 ${tone.labelClassName}`}
            >
                {getRiskTone(value)}
            </div>
        </div>
    )
}

function RiskTimeline({ risks }: { risks: Risks }) {
    const data = useMemo(() => {
        const points = []

        for (let i = 0; i <= 14; i++) {
            const t = i / 14
            const base = 10 + risks.heatRisk * 0.3
            const trend = risks.heatRisk * 0.6 * t * 50
            const volatility = Math.sin(i * 1.5) * risks.respRisk * 8
            const lagSpike = risks.vectorRisk * 30 * Math.exp(-Math.pow(i - 10, 2) / 8)
            const jumps = Math.sin(i * 3 + risks.waterRisk) > 0.7 ? 15 : 0

            points.push({
                time: i,
                risk: Math.round((base + trend + volatility + lagSpike + jumps) / 10),
            })
        }

        return points
    }, [risks])

    return (
        <Card className="bg-background/50 rounded-2xl border-0 p-4 shadow-none">
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
                            formatter={(value) => `${value}% risk`}
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
        <div className="flex flex-col gap-3">
            <div className="flex justify-between">
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
            <div className="text-muted-foreground flex justify-between text-xs">
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
    const avgRisk = (risks.heatRisk + risks.respRisk + risks.vectorRisk + risks.waterRisk) / 4
    const recommendation = useMemo(
        () => generateRecommendation(risks, state.rainfall),
        [risks, state.rainfall]
    )

    return (
        <SectionShell
            decoration={
                <div className="from-earth-200/40 absolute inset-0 bg-linear-to-b via-transparent to-transparent" />
            }
        >
            <motion.div
                initial={fadeUp.initial}
                whileInView={fadeUp.whileInView}
                viewport={fadeUp.viewport}
                transition={fadeUp.transition}
                className="mx-auto flex max-w-3xl flex-col gap-6 text-center"
            >
                <SectionEyebrow
                    label="Interactive Simulation"
                    className="glassy-chip mx-auto"
                    align="center"
                />
                <h2>Explore What-If Scenarios</h2>
                <p className="text-muted-foreground text-lg">
                    Adjust environmental parameters and instantly see how projected health outcomes
                    change. Decision-makers can test intervention strategies before implementation.
                </p>
            </motion.div>

            <motion.div
                initial={fadeUp.initial}
                whileInView={fadeUp.whileInView}
                viewport={fadeUp.viewport}
                transition={{ ...fadeUp.transition, delay: 0.1 }}
                className="grid gap-8 lg:grid-cols-2"
            >
                <Card className="home-surface rounded-3xl shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
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
                                    onCheckedChange={(val) => updateState({ urbanHeatIsland: val })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="home-surface relative overflow-hidden rounded-3xl shadow-none">
                    <div
                        className="absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl transition-all duration-500"
                        style={{ background: getGlowGradient(avgRisk) }}
                    />

                    <CardHeader className="relative z-10">
                        <CardTitle className="text-xl font-semibold">Projected Outcomes</CardTitle>
                    </CardHeader>

                    <CardContent className="relative z-10 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <OutcomeCard label="Heatstroke Risk" value={risks.heatRisk} />
                            <OutcomeCard label="Respiratory Risk" value={risks.respRisk} />
                            <OutcomeCard label="Vector-Borne" value={risks.vectorRisk} />
                            <OutcomeCard label="Water-Borne" value={risks.waterRisk} />
                        </div>

                        <RiskTimeline risks={risks} />

                        <div className="border-success-200/30 bg-success-100/20 rounded-xl border p-4">
                            <div className="flex items-start gap-3">
                                <Info className="text-success mt-0.5 h-5 w-5 shrink-0" />
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
        </SectionShell>
    )
}
