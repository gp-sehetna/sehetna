"use client"

import {
    ArrowLeft,
    ArrowRight,
    BarChart3,
    BellRing,
    Brain,
    CheckCircle2,
    ChevronRight,
    Database,
    Layers,
    TrendingUp,
} from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import type { UseCase, UseCasesKey } from "./useCases.data"

type UseCaseDetailClientProps = {
    useCase: UseCase
    extended: {
        overview: string
        drivers: { label: string; weight: number }[]
        outputs: string[]
        institutionStory: { institution: string; region: string; outcome: string }
        chartData: { month: string; risk: number; observed: number }[]
        pipeline: string[]
    }
    nextUseCase: [UseCasesKey, UseCase]
}

function ChartTooltip({
    active,
    payload,
    label,
    accent,
}: {
    active?: boolean
    payload?: { dataKey: string; value: number }[]
    label?: string
    accent: string
}) {
    if (!active || !payload?.length) return null

    return (
        <div className="bg-background/90 rounded-2xl border px-4 py-3 text-xs shadow-lg backdrop-blur-xl">
            <p className="text-neutral-1000 mb-2 font-semibold">{label}</p>
            {payload.map((item) => (
                <div key={item.dataKey} className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor:
                                item.dataKey === "risk" ? accent : "var(--color-neutral-500)",
                        }}
                    />
                    <span className="text-neutral-800">
                        {item.dataKey === "risk" ? "Predicted" : "Observed"}:
                    </span>
                    <span className="text-neutral-1000 font-semibold">{item.value}</span>
                </div>
            ))}
        </div>
    )
}

export default function UseCaseDetailClient({
    useCase,
    extended,
    nextUseCase,
}: UseCaseDetailClientProps) {
    return (
        <main className="bg-primary-50">
            <section className="relative overflow-hidden pt-24">
                <div className="relative h-112 overflow-hidden">
                    <Image
                        src={useCase.heroImage}
                        alt={useCase.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    <div className="from-primary-50 absolute inset-0 bg-linear-to-t via-black/30 to-black/55" />
                    <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-12 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex max-w-3xl flex-col gap-4"
                        >
                            <div className="text-background/70 flex items-center gap-2 text-xs">
                                <Link
                                    href="/use-cases"
                                    className="text-background/80 hover:text-background inline-flex items-center gap-1 transition-colors"
                                >
                                    <ArrowLeft size={12} />
                                    Use cases
                                </Link>
                                <ChevronRight size={12} />
                                <span>{useCase.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* <div className="bg-background/15 flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm">
                                    <Icon size={22} className="text-background" />
                                </div> */}
                                <span className="bg-background/10 text-background rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                                    {useCase.label}
                                </span>
                            </div>
                            <h1 className="text-background">{useCase.title}</h1>
                            <p className="text-background/85 max-w-2xl text-base">
                                {useCase.description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-16 pb-24">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.35fr_0.65fr] lg:px-8">
                    <div className="flex flex-col gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${useCase.accentSoft}`}
                                >
                                    <BarChart3 size={16} />
                                </div>
                                <h2 className="text-base">Module overview</h2>
                            </div>
                            <p className="text-sm text-neutral-800">{extended.overview}</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <div className="mb-6 flex items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-base">Annual risk profile</h2>
                                    <p className="mt-1 text-xs text-neutral-600">
                                        Predicted vs. observed validation behaviour.
                                    </p>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={extended.chartData}>
                                    <defs>
                                        <linearGradient
                                            id={`risk-${useCase.label}`}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={useCase.accent}
                                                stopOpacity={0.18}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={useCase.accent}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--color-neutral-200)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 10, fill: "var(--color-neutral-500)" }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: "var(--color-neutral-500)" }}
                                        axisLine={false}
                                        tickLine={false}
                                        domain={[0, 100]}
                                        width={30}
                                    />
                                    <Tooltip content={<ChartTooltip accent={useCase.accent} />} />
                                    <Area
                                        type="monotone"
                                        dataKey="risk"
                                        stroke={useCase.accent}
                                        strokeWidth={2.5}
                                        fill={`url(#risk-${useCase.label})`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="observed"
                                        stroke="var(--color-neutral-500)"
                                        strokeDasharray="4 3"
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${useCase.accentSoft}`}
                                >
                                    <TrendingUp size={16} />
                                </div>
                                <h2 className="text-base">Key predictive drivers</h2>
                            </div>
                            <div className="flex flex-col gap-4">
                                {extended.drivers.map((driver) => (
                                    <div
                                        key={driver.label}
                                        className="grid items-center gap-3 sm:grid-cols-[13rem_1fr_3rem]"
                                    >
                                        <span className="text-xs text-neutral-800">
                                            {driver.label}
                                        </span>
                                        <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${Math.min(driver.weight * 3, 95)}%`,
                                                    backgroundColor: useCase.accent,
                                                }}
                                            />
                                        </div>
                                        <span
                                            className="text-xs font-bold"
                                            style={{ color: useCase.accent }}
                                        >
                                            {driver.weight}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="rounded-3xl border p-7 shadow-md"
                            style={{
                                borderColor: `${useCase.accent}25`,
                                background: `linear-gradient(135deg, ${useCase.accent}08, transparent)`,
                            }}
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <div
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${useCase.accentSoft}`}
                                >
                                    <BellRing size={16} />
                                </div>
                                <h2 className="text-base">Institutional case study</h2>
                            </div>
                            <p className="text-neutral-1000 text-sm font-semibold">
                                {extended.institutionStory.institution}
                            </p>
                            <p className="mt-1 text-xs text-neutral-600">
                                {extended.institutionStory.region}
                            </p>
                            <p className="mt-4 text-sm text-neutral-800">
                                {extended.institutionStory.outcome}
                            </p>
                        </motion.div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <h3 className="mb-4 text-sm">Model metrics</h3>
                            <div className="flex flex-col gap-3">
                                {useCase.metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="flex items-center justify-between border-b py-2.5 last:border-0"
                                    >
                                        <span className="text-xs text-neutral-800">
                                            {metric.label}
                                        </span>
                                        <span
                                            className="text-sm font-bold"
                                            style={{ color: useCase.accent }}
                                        >
                                            {metric.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <Database size={14} style={{ color: useCase.accent }} />
                                <h3 className="text-sm">Model outputs</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                {extended.outputs.map((item) => (
                                    <div key={item} className="flex items-start gap-2.5">
                                        <CheckCircle2
                                            size={13}
                                            style={{ color: useCase.accent }}
                                            className="mt-0.5 shrink-0"
                                        />
                                        <span className="text-xs text-neutral-800">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <Brain size={14} style={{ color: useCase.accent }} />
                                <h3 className="text-sm">Module pipeline</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                {extended.pipeline.map((item, index) => (
                                    <div key={item} className="flex items-start gap-3">
                                        <div
                                            className="text-2xs flex h-5 w-5 shrink-0 items-center justify-center rounded-lg font-bold"
                                            style={{
                                                backgroundColor: `${useCase.accent}15`,
                                                color: useCase.accent,
                                            }}
                                        >
                                            {index + 1}
                                        </div>
                                        <span className="text-xs text-neutral-800">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-background/60 rounded-3xl border border-white/80 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <Layers size={14} style={{ color: useCase.accent }} />
                                <h3 className="text-sm">Target institutions</h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                {useCase.users.map((item) => (
                                    <div key={item} className="flex items-center gap-2">
                                        <span
                                            className="h-1.5 w-1.5 rounded-full"
                                            style={{ backgroundColor: useCase.accent }}
                                        />
                                        <span className="text-xs font-medium text-neutral-900">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                <div className="mx-auto mt-12 max-w-7xl px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-background/60 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/80 p-7 shadow-md shadow-black/5 backdrop-blur-xl sm:flex-row"
                    >
                        <div>
                            <p className="mb-1 text-xs font-medium tracking-wider text-neutral-500 uppercase">
                                Next use case
                            </p>
                            <h3 className="text-lg">{nextUseCase[1].title}</h3>
                        </div>
                        <Link
                            href={`/use-cases/${nextUseCase[0]}`}
                            className="text-background inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
                            style={{
                                background: `linear-gradient(135deg, ${nextUseCase[1].accent}, ${nextUseCase[1].accent})`,
                            }}
                        >
                            Explore case
                            <ArrowRight size={15} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
