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
} from "recharts"
import { MapPin, AlertCircle, TrendingUp, Activity } from "lucide-react"
import { format } from "date-fns"
import World from "./World"
import { Button } from "../shadcn/button"

const forecastData = [
    { day: "Mon", heatstroke: 34, respiratory: 47, cardiovascular: 28, vectorBorne: 12 },
    { day: "Tue", heatstroke: 42, respiratory: 51, cardiovascular: 31, vectorBorne: 14 },
    { day: "Wed", heatstroke: 58, respiratory: 55, cardiovascular: 36, vectorBorne: 18 },
    { day: "Thu", heatstroke: 72, respiratory: 60, cardiovascular: 40, vectorBorne: 22 },
    { day: "Fri", heatstroke: 65, respiratory: 57, cardiovascular: 38, vectorBorne: 20 },
    { day: "Sat", heatstroke: 48, respiratory: 52, cardiovascular: 33, vectorBorne: 16 },
    { day: "Sun", heatstroke: 37, respiratory: 49, cardiovascular: 29, vectorBorne: 13 },
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
        color: "var(--color-primary)",
        bg: "#ff5c0212",
    },
    {
        level: "Moderate",
        region: "Eastern Zone",
        risk: "Respiratory",
        probability: "54%",
        color: "var(--color-secondary)",
        bg: "#8c5aff12",
    },
    {
        level: "Low",
        region: "Southern Region",
        risk: "Vector-Borne",
        probability: "31%",
        color: "#6b8e7a",
        bg: "#6b8e7a12",
    },
    {
        level: "Moderate",
        region: "Western Coast",
        risk: "Water-Borne",
        probability: "47%",
        color: "#c4a882",
        bg: "#c4a88212",
    },
]

// Pseudo-map heatmap regions
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
    { x: 480, y: 100, r: 35, color: "#6b8e7a", opacity: 0.32, label: "31% Vector", delay: 0.9 },
    { x: 590, y: 430, r: 40, color: "#c4a882", opacity: 0.25, label: "39% Water", delay: 1.2 },
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
]

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/90 rounded-2xl border border-white/60 p-3 text-xs shadow-lg backdrop-blur-xl">
                <p className="mb-1.5 font-semibold text-[#222]">{label}</p>
                {payload.map((p: any) => (
                    <div key={p.name} className="mb-0.5 flex items-center gap-2">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: p.color }}
                        />
                        <span className="text-neutral-800 capitalize">{p.name}:</span>
                        <span className="font-medium">{p.value}</span>
                    </div>
                ))}
            </div>
        )
    }
    return null
}

function MapView() {
    return (
        <div className="relative h-85 overflow-hidden rounded-2xl bg-[#f0ece4]">
            {/* GRID */}
            <svg className="absolute inset-0 h-full w-full opacity-15">
                {Array.from({ length: 12 }).map((_, i) => (
                    <line
                        key={i}
                        x1={`${(i / 12) * 100}%`}
                        y1="0"
                        x2={`${(i / 12) * 100}%`}
                        y2="100%"
                        stroke="#8e8e8e"
                        strokeWidth="0.5"
                    />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={`${(i / 8) * 100}%`}
                        x2="100%"
                        y2={`${(i / 8) * 100}%`}
                        stroke="#8e8e8e"
                        strokeWidth="0.5"
                    />
                ))}
            </svg>

            {/* Stylized map polygons */}
            <World>
                {/* GRADIENTS */}
                <defs>
                    {mapRegions.map((r, i) => (
                        <radialGradient key={i} id={`grad-${i}`}>
                            <stop offset="0%" stopColor={r.color} stopOpacity={r.opacity * 2.5} />
                            <stop offset="100%" stopColor={r.color} stopOpacity={0} />
                        </radialGradient>
                    ))}
                </defs>

                {/* HEAT BLOBS + MARKERS */}
                {mapRegions.map((region, i) => (
                    <g key={i}>
                        {/* HEATMAP */}
                        <motion.circle
                            cx={region.x}
                            cy={region.y}
                            r={region.r}
                            fill={`url(#grad-${i})`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, delay: region.delay }}
                        />

                        {/* PULSE */}
                        <motion.circle
                            cx={region.x}
                            cy={region.y}
                            r={6}
                            fill={region.color}
                            animate={{ r: [6, 16, 6], opacity: [0.6, 0, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.5 }}
                        />

                        {/* CORE DOT */}
                        <circle cx={region.x} cy={region.y} r={3} fill={region.color} />

                        {/* LABEL */}
                        <foreignObject x={region.x - 70} y={region.y + 10} width="140" height="40">
                            <div className="flex w-full items-center justify-center">
                                <div
                                    style={{
                                        backgroundColor: region.color,
                                        padding: "2px 8px",
                                        borderRadius: "999px",
                                        color: "white",
                                        fontSize: "9px",
                                        textAlign: "center",
                                        display: "inline-block",
                                    }}
                                >
                                    {region.label}
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                ))}
            </World>

            {/* Scale bar and legend */}
            <div className="bg-background/70 absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl border border-white/60 px-3 py-1.5 backdrop-blur-sm">
                {[
                    { label: "Low", color: "#6b8e7a" },
                    { label: "Moderate", color: "#c4a882" },
                    { label: "High", color: "var(--color-primary)" },
                ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: l.color }}
                        />
                        <span className="text-[9px] text-neutral-800">{l.label}</span>
                    </div>
                ))}
            </div>

            {/* Timestamp */}
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
    return (
        <div className="flex h-85 flex-col">
            <p className="mb-3 text-xs text-neutral-500">
                7-Day Health Risk Forecast (Probability Index)
            </p>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={forecastData}
                    margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                    barGap={2}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" vertical={false} />
                    <XAxis
                        dataKey="day"
                        tick={{ fontSize: 11, fill: "var(--color-neutral-500)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "var(--color-neutral-500)" }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="heatstroke"
                        name="Heatstroke"
                        fill="var(--color-primary)"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={14}
                    />
                    <Bar
                        dataKey="respiratory"
                        name="Respiratory"
                        fill="var(--color-secondary)"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={14}
                    />
                    <Bar
                        dataKey="cardiovascular"
                        name="Cardiovascular"
                        fill="#6b8e7a"
                        radius={[3, 3, 0, 0]}
                        maxBarSize={14}
                    />
                    <Bar
                        dataKey="vectorBorne"
                        name="Vector-Borne"
                        fill="#c4a882"
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
            {alerts.map((alert, i) => (
                <motion.div
                    key={alert.region}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 rounded-2xl border p-2"
                    style={{ backgroundColor: alert.bg, borderColor: alert.color }} //TODO: opacity 25%
                >
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ backgroundColor: alert.color }}
                    >
                        <AlertCircle size={16} className="text-white" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                            <span
                                className="rounded-full px-2 py-0.5 text-xs font-bold text-white"
                                style={{ backgroundColor: alert.color }}
                            >
                                {alert.level}
                            </span>
                            <span className="text-xs text-neutral-800">{alert.risk} Risk</span>
                        </div>
                        <p className="text-sm font-medium text-[#222]">{alert.region}</p>
                    </div>
                    <div className="text-right">
                        <div
                            className="text-xl font-bold"
                            style={{ fontFamily: "var(--font-heading)", color: alert.color }}
                        >
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
                    <PolarGrid stroke="#e8e8e8" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#777" }} />
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
    const inView = useInView(ref, { once: true, margin: "-80px" })
    const [activeTab, setActiveTab] = useState("map")

    return (
        <section ref={ref} className="bg-background relative overflow-hidden py-8 lg:py-16">
            <div className="from-secondary-300/5 pointer-events-none absolute top-0 right-1/4 h-75 w-125 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
            <div className="from-primary/20 pointer-events-none absolute bottom-0 left-1/4 h-75 w-100 rounded-full bg-linear-to-tr to-transparent blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="mb-12 items-end gap-8"
                >
                    <div className="mb-5 flex items-center gap-2">
                        <div className="bg-secondary-300 h-px w-8" />
                        <span className="text-secondary-300 text-xs font-semibold tracking-widest uppercase">
                            Live Intelligence
                        </span>
                    </div>
                    <h2>Health Risk Dashboards</h2>
                </motion.div>

                {/* Dashboard card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-background/60 overflow-hidden rounded-3xl border border-white/80 shadow-2xl shadow-black/8 backdrop-blur-2xl"
                >
                    {/* Dashboard header bar */}
                    <div className="flex items-center justify-between border-b border-neutral-200/60 px-6 py-4">
                        <div className="flex items-center gap-2.5">
                            <div className="flex gap-1.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#ff5c5c]" />
                                <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
                                <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
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
                        {/* Tabs */}
                        <div className="mb-6 flex w-fit gap-1 rounded-2xl bg-[#f5f0eb]/60 p-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                return (
                                    <Button
                                        variant="text"
                                        size="sm"
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`rounded-xl text-xs font-medium transition-all duration-400 ${
                                            activeTab === tab.id
                                                ? "text-neutral-1000 bg-background shadow-sm"
                                                : "text-neutral-600 hover:text-neutral-900"
                                        }`}
                                    >
                                        <Icon size={13} strokeWidth={1.5} />
                                        {tab.label}
                                    </Button>
                                )
                            })}
                        </div>

                        {/* Tab content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                        >
                            {activeTab === "map" && <MapView />}
                            {activeTab === "forecast" && <ForecastView />}
                            {activeTab === "alerts" && <AlertsView />}
                            {activeTab === "indicators" && <IndicatorsView />}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom mini stats */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4"
                >
                    {[
                        { label: "Zones Monitored", value: "25", color: "var(--color-primary)" },
                        {
                            label: "Predictions Generated",
                            value: "24K+",
                            color: "var(--color-secondary)",
                        },
                        { label: "Active Risk Alerts", value: "8", color: "#6b8e7a" },
                        { label: "Data Refresh Rate", value: "6 weeks", color: "#c4a882" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-background/60 rounded-2xl border border-white/80 p-4 text-center backdrop-blur-xl"
                        >
                            <div
                                className="mb-1 text-2xl"
                                style={{
                                    fontFamily: "var(--font-heading)",
                                    fontWeight: 700,
                                    color: stat.color,
                                }}
                            >
                                {stat.value}
                            </div>
                            <div className="text-xs text-neutral-600">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
