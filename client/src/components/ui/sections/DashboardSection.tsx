"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    BarProps,
} from "recharts"
import { MapPin, AlertCircle, TrendingUp, Activity, LucideIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "../shadcn/button"
import SectionEyebrow from "./SectionEyebrow"
import SectionShell from "./SectionShell"
import { fadeUp, homeViewport, staggerDelay } from "./motion"
import World from "./World"
import { PrimarySecondaryDecoration } from "../GlobalComponents/extras/BackgroundDecorations"

const forecastData = [
    { week: "1w", heatstroke: 34, respiratory: 81, cardiovascular: 28, vectorBorne: 12 },
    { week: "2w", heatstroke: 42, respiratory: 10, cardiovascular: 31, vectorBorne: 14 },
    { week: "3w", heatstroke: 58, respiratory: 55, cardiovascular: 36, vectorBorne: 18 },
    { week: "4w", heatstroke: 20, respiratory: 60, cardiovascular: 75, vectorBorne: 22 },
    { week: "5w", heatstroke: 65, respiratory: 57, cardiovascular: 38, vectorBorne: 20 },
    { week: "6w", heatstroke: 48, respiratory: 52, cardiovascular: 33, vectorBorne: 70 },
]

const radarData = [
    { metric: "Temp Anomaly", value: 78 },
    { metric: "Air Quality", value: 62 },
    { metric: "Humidity", value: 45 },
    { metric: "UV Index", value: 85 },
    { metric: "Precipitation", value: 30 },
    { metric: "PM2.5", value: 71 },
]

const alerts = [
    {
        level: "High",
        region: "Northern District",
        risk: "Heatstroke",
        probability: "78%",
        dotClassName: "bg-primary",
        badgeClassName: "bg-primary text-white",
        containerClassName: "border-primary/20 bg-primary-100/40",
        valueClassName: "text-primary",
    },
    {
        level: "Moderate",
        region: "Eastern Zone",
        risk: "Respiratory",
        probability: "54%",
        dotClassName: "bg-secondary",
        badgeClassName: "bg-secondary text-white",
        containerClassName: "border-secondary/20 bg-secondary-100/40",
        valueClassName: "text-secondary",
    },
    {
        level: "Low",
        region: "Southern Region",
        risk: "Vector-Borne",
        probability: "31%",
        dotClassName: "bg-success",
        badgeClassName: "bg-success text-white",
        containerClassName: "border-success-200 bg-success-100/40",
        valueClassName: "text-success",
    },
    {
        level: "Moderate",
        region: "Western Coast",
        risk: "Water-Borne",
        probability: "47%",
        dotClassName: "bg-earth",
        badgeClassName: "bg-earth text-white",
        containerClassName: "border-earth/20 bg-earth-100/60",
        valueClassName: "text-earth-400",
    },
]

const mapRegions = [
    {
        x: 1020,
        y: 300,
        r: 55,
        color: "var(--color-primary)",
        opacity: 0.35,
        label: "72% Heatstroke",
        delay: 0,
    },
    {
        x: 1080,
        y: 140,
        r: 45,
        color: "var(--color-secondary)",
        opacity: 0.28,
        label: "54% Respiratory",
        delay: 0.3,
    },
    {
        x: 600,
        y: 220,
        r: 60,
        color: "var(--color-primary)",
        opacity: 0.22,
        label: "48% Risk",
        delay: 0.6,
    },
    {
        x: 480,
        y: 100,
        r: 35,
        color: "var(--color-success)",
        opacity: 0.32,
        label: "31% Vector",
        delay: 0.9,
    },
    {
        x: 590,
        y: 430,
        r: 40,
        color: "var(--color-earth)",
        opacity: 0.25,
        label: "39% Water",
        delay: 1.2,
    },
    {
        x: 80,
        y: 200,
        r: 30,
        color: "var(--color-secondary)",
        opacity: 0.2,
        label: "28% Risk",
        delay: 1.5,
    },
]

const tabs = [
    { id: "map", label: "Risk Map", icon: MapPin },
    { id: "forecast", label: "Forecast", icon: TrendingUp },
    { id: "alerts", label: "Alerts", icon: AlertCircle },
    { id: "indicators", label: "Indicators", icon: Activity },
] as const

const miniStats = [
    { label: "Zones Monitored", value: "25", valueClassName: "text-primary" },
    { label: "Predictions Generated", value: "24K+", valueClassName: "text-secondary" },
    { label: "Active Risk Alerts", value: "8", valueClassName: "text-success" },
    { label: "Data Refresh Rate", value: "6 weeks", valueClassName: "text-earth-400" },
]

function DashboardTabButton({
    active,
    icon: Icon,
    label,
    onClick,
}: {
    active: boolean
    icon: LucideIcon
    label: string
    onClick: () => void
}) {
    return (
        <Button
            variant="text"
            size="sm"
            onClick={onClick}
            className={
                active
                    ? "bg-background text-neutral-1000 rounded-xl shadow-sm"
                    : "rounded-xl text-neutral-600 hover:text-neutral-900"
            }
        >
            <Icon size={13} strokeWidth={1.5} />
            {label}
        </Button>
    )
}

function DashboardMiniStat({
    label,
    value,
    valueClassName,
}: {
    label: string
    value: string
    valueClassName: string
}) {
    return (
        <div className="home-surface rounded-2xl p-4 text-center">
            <div className={`mb-1 text-2xl font-bold ${valueClassName}`}>{value}</div>
            <div className="text-xs text-neutral-600">{label}</div>
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null

    return (
        <div className="bg-background/90 rounded-2xl border border-white/60 p-3 text-xs shadow-lg backdrop-blur-xl">
            <p className="text-foreground mb-1.5 font-semibold">{label}</p>
            {payload.map((entry: any) => (
                <div key={entry.name} className="mb-0.5 flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-neutral-800 capitalize">{entry.name}:</span>
                    <span className="font-medium">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

function MapView() {
    return (
        <div className="bg-earth-100/70 relative h-85 overflow-hidden rounded-2xl">
            <svg className="absolute inset-0 h-full w-full opacity-15">
                {Array.from({ length: 12 }).map((_, index) => (
                    <line
                        key={index}
                        x1={`${(index / 12) * 100}%`}
                        y1="0"
                        x2={`${(index / 12) * 100}%`}
                        y2="100%"
                        stroke="var(--color-neutral-400)"
                        strokeWidth="0.5"
                    />
                ))}
                {Array.from({ length: 8 }).map((_, index) => (
                    <line
                        key={index}
                        x1="0"
                        y1={`${(index / 8) * 100}%`}
                        x2="100%"
                        y2={`${(index / 8) * 100}%`}
                        stroke="var(--color-neutral-400)"
                        strokeWidth="0.5"
                    />
                ))}
            </svg>

            <World>
                <defs>
                    {mapRegions.map((region, index) => (
                        <radialGradient key={index} id={`grad-${index}`}>
                            <stop
                                offset="0%"
                                stopColor={region.color}
                                stopOpacity={region.opacity * 2.5}
                            />
                            <stop offset="100%" stopColor={region.color} stopOpacity={0} />
                        </radialGradient>
                    ))}
                </defs>

                {mapRegions.map((region, index) => (
                    <g key={index}>
                        <motion.circle
                            cx={region.x}
                            cy={region.y}
                            r={region.r}
                            fill={`url(#grad-${index})`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: region.delay }}
                        />
                        <motion.circle
                            cx={region.x}
                            cy={region.y}
                            r={6}
                            fill={region.color}
                            animate={{ r: [6, 16, 6], opacity: [0.6, 0, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2.5, delay: index * 0.5 }}
                        />
                        <circle cx={region.x} cy={region.y} r={3} fill={region.color} />
                        <foreignObject x={region.x - 70} y={region.y + 10} width="140" height="40">
                            <div className="flex w-full items-center justify-center">
                                <div
                                    className="inline-block rounded-full px-2 py-0.5 text-center text-[9px] text-white"
                                    style={{ backgroundColor: region.color }}
                                >
                                    {region.label}
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </World>

            <div className="bg-background/70 absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl border border-white/60 px-3 py-1.5 backdrop-blur-sm">
                {[
                    { label: "Low", color: "var(--color-success)" },
                    { label: "Moderate", color: "var(--color-earth)" },
                    { label: "High", color: "var(--color-primary)" },
                ].map((legend) => (
                    <div key={legend.label} className="flex items-center gap-1">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: legend.color }}
                        />
                        <span className="text-[9px] text-neutral-800">{legend.label}</span>
                    </div>
                ))}
            </div>

            <div className="bg-background/70 absolute top-3 right-3 rounded-xl border border-white/60 px-3 py-1.5 backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                    <motion.div
                        className="bg-success-200 h-1.5 w-1.5 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <span className="text-[10px] font-medium text-neutral-800">
                        {format(new Date(), "EE, d MMM yyyy")}
                    </span>
                </div>
            </div>
        </div>
    )
}

function ForecastView() {
    type PartialBarProps = Omit<BarProps, "ref" | "dataKey">

    const axisProperties = {
        tick: { fontSize: 11, fill: "var(--color-neutral-500)" },
        axisLine: false,
        tickLine: false,
    }
    const barProperties: PartialBarProps = { radius: [3, 3, 0, 0], maxBarSize: 14 }
    return (
        <div className="flex h-85 flex-col">
            <p className="mb-3 text-xs text-neutral-500">Up to 6-Week Health Risk Forecast</p>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={forecastData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                    barGap={2}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-neutral-300)"
                        vertical={false}
                    />
                    <XAxis dataKey="week" {...axisProperties} />
                    <YAxis {...axisProperties} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="heatstroke"
                        name="Heatstroke"
                        fill="var(--color-primary)"
                        {...barProperties}
                    />
                    <Bar
                        dataKey="respiratory"
                        name="Respiratory"
                        fill="var(--color-secondary)"
                        {...barProperties}
                    />
                    <Bar
                        dataKey="cardiovascular"
                        name="Cardiovascular"
                        fill="var(--color-success)"
                        {...barProperties}
                    />
                    <Bar
                        dataKey="vectorBorne"
                        name="Vector-Borne"
                        fill="var(--color-earth)"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={14}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

function AlertsView() {
    return (
        <div className="h-85 space-y-3 overflow-y-auto pr-1">
            {alerts.map((alert, index) => (
                <motion.div
                    key={alert.region}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 rounded-2xl border p-3 ${alert.containerClassName}`}
                >
                    <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${alert.dotClassName}`}
                    >
                        <AlertCircle size={16} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-bold ${alert.badgeClassName}`}
                            >
                                {alert.level}
                            </span>
                            <span className="text-xs text-neutral-800">{alert.risk} Risk</span>
                        </div>
                        <p className="text-foreground text-sm font-medium">{alert.region}</p>
                    </div>
                    <div className="text-right">
                        <div className={`text-xl font-bold ${alert.valueClassName}`}>
                            {alert.probability}
                        </div>
                        <div className="text-xs text-neutral-500">probability</div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

function IndicatorsView() {
    return (
        <div className="flex h-85 flex-col">
            <p className="mb-2 text-xs text-neutral-500">
                Environmental Risk Indicators (Normalized 0-100)
            </p>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                    <PolarGrid stroke="var(--color-neutral-300)" />
                    <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fontSize: 10, fill: "var(--color-neutral-500)" }}
                    />
                    <Radar
                        name="Environment"
                        dataKey="value"
                        stroke="var(--color-primary)"
                        fill="var(--color-primary)"
                        fillOpacity={0.12}
                        strokeWidth={1.5}
                        dot={{ fill: "var(--color-primary)", r: 3 }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}

export function DashboardSection() {
    const ref = useRef(null)
    const inView = useInView(ref, homeViewport)
    const [activeTab, setActiveTab] = useState("map")

    return (
        <SectionShell decoration={<PrimarySecondaryDecoration />}>
            <div ref={ref} className="flex flex-col gap-6">
                <motion.div
                    initial={fadeUp.initial}
                    animate={inView ? fadeUp.whileInView : {}}
                    transition={fadeUp.transition}
                    className="mx-auto flex max-w-3xl flex-col gap-5 text-center"
                >
                    <SectionEyebrow
                        label="Live Intelligence"
                        className="glassy-chip mx-auto"
                        align="center"
                    />
                    <h2>Health Risk Dashboards</h2>
                    <p className="text-muted-foreground text-lg">
                        Explore a live-style monitoring experience with spatial risk views, forecast
                        trends, alert streams, and environmental indicators in one place.
                    </p>
                </motion.div>

                <motion.div
                    initial={fadeUp.initial}
                    animate={inView ? fadeUp.whileInView : {}}
                    transition={{ ...fadeUp.transition, delay: 0.1 }}
                    className="home-surface overflow-hidden rounded-3xl shadow-2xl shadow-black/8"
                >
                    <div className="flex items-center justify-between border-b border-neutral-200/60 px-6 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex gap-1.5">
                                <div className="bg-danger h-2.5 w-2.5 rounded-full" />
                                <div className="bg-warning h-2.5 w-2.5 rounded-full" />
                                <div className="bg-success-100 h-2.5 w-2.5 rounded-full" />
                            </div>
                            <span className="ml-2 text-xs font-medium text-neutral-500">
                                Demo Playground
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="bg-success-200 h-1.5 w-1.5 rounded-full"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            <span className="text-xs text-neutral-500">System Active</span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="bg-earth-100/70 mb-6 flex w-fit gap-1 rounded-2xl p-1">
                            {tabs.map((tab) => (
                                <DashboardTabButton
                                    key={tab.id}
                                    active={activeTab === tab.id}
                                    icon={tab.icon}
                                    label={tab.label}
                                    onClick={() => setActiveTab(tab.id)}
                                />
                            ))}
                        </div>

                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: fadeUp.transition.ease }}
                        >
                            {activeTab === "map" && <MapView />}
                            {activeTab === "forecast" && <ForecastView />}
                            {activeTab === "alerts" && <AlertsView />}
                            {activeTab === "indicators" && <IndicatorsView />}
                        </motion.div>
                    </div>
                </motion.div>

                <motion.div
                    initial={fadeUp.initial}
                    animate={inView ? fadeUp.whileInView : {}}
                    transition={{ ...fadeUp.transition, delay: 0.2 }}
                    className="grid grid-cols-2 gap-4 lg:grid-cols-4"
                >
                    {miniStats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 16 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            viewport={homeViewport}
                            transition={{ ...fadeUp.transition, delay: staggerDelay(index, 0.08) }}
                        >
                            <DashboardMiniStat {...stat} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </SectionShell>
    )
}
