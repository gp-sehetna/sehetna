"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { AlertTriangle, TrendingUp, Globe, Thermometer, LucideIcon } from "lucide-react"
import Image from "next/image"
import { useCounter } from "@/hooks/use-counter"
import Texture from "../textures"

type StatElement = {
    icon: LucideIcon
    value: number
    suffix: string
    label: string
    color: string
}

const stats: StatElement[] = [
    {
        icon: Thermometer,
        value: 250,
        suffix: "M+",
        label: "People at risk of heatstroke globally each year",
        color: "#ff5c02",
    },
    {
        icon: TrendingUp,
        value: 40,
        suffix: "%",
        label: "Rise in climate-linked respiratory illness since 2010",
        color: "#8c5aff",
    },
    {
        icon: Globe,
        value: 7,
        suffix: "M",
        label: "Premature deaths linked to air pollution annually (WHO)",
        color: "#6b8e7a",
    },
    {
        icon: AlertTriangle,
        value: 60,
        suffix: "%",
        label: "Of health systems lack real-time environmental risk data",
        color: "#c4a882",
    },
]

function StatCard({ stat, index, inView }: { stat: StatElement; index: number; inView: boolean }) {
    const count = useCounter(stat.value, 2200, inView)
    const Icon = stat.icon

    return (
        <motion.div
            initial={{ opacity: 0, x: 320 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative"
        >
            <div className="border-background/80 bg-background/60 relative overflow-hidden rounded-3xl border p-6 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-400 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8">
                {/* Subtle bg accent */}
                <div
                    className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-8 blur-2xl"
                    style={{ backgroundColor: stat.color }}
                />
                <div
                    className="mb-4 inline-flex rounded-2xl p-2.5"
                    style={{ backgroundColor: `${stat.color}15` }}
                >
                    <Icon size={20} style={{ color: stat.color, strokeWidth: 1.5 }} />
                </div>
                <div className="mb-2 flex items-end gap-0.5">
                    <span
                        className="text-4xl"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            color: stat.color,
                        }}
                    >
                        {count}
                    </span>
                    <span
                        className="pb-0.5 text-2xl"
                        style={{
                            fontFamily: "var(--font-heading)",
                            fontWeight: 700,
                            color: stat.color,
                        }}
                    >
                        {stat.suffix}
                    </span>
                </div>
                <p className="text-sm leading-snug text-neutral-800">{stat.label}</p>
            </div>
        </motion.div>
    )
}
export function ProblemContext() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <section ref={ref} className="bg-background relative overflow-hidden py-16 lg:py-24">
            <Texture texture="dots" />
            {/* TODO: Reuse these Organic gradient blobs */}
            <div className="from-primary/10 pointer-events-none absolute top-0 right-0 h-150 w-150 rounded-full bg-linear-to-bl via-[#c4a882]/4 to-transparent blur-3xl" />
            <div className="from-secondary/12 pointer-events-none absolute bottom-0 left-0 h-125 w-125 rounded-full bg-linear-to-tr via-[#6b8e7a]/4 to-transparent blur-3xl" />

            <div className="relative mx-auto max-w-7xl space-y-12 px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-2xl space-y-4"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-primary h-[0.5px] w-8" />
                        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                            The Challenge
                        </span>
                    </div>
                    <h2>A Critical Gap in Health Monitoring</h2>
                    <p className="text-base leading-relaxed text-neutral-800">
                        Environmental conditions — heat, air quality, humidity, rainfall — quietly
                        shape the health of communities every day. Yet most health systems operate{" "}
                        <span className="text-neutral-1000 font-medium">
                            without real-time environmental intelligence
                        </span>
                        , responding to crises after they{"'"}ve already formed. Sehetna bridges
                        this gap.
                    </p>
                </motion.div>

                {/* Stats grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
                    ))}
                </div>

                {/* Narrative + Chart */}
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left: narrative */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -32 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h5>Rising Health Burdens Tied to Our Environment</h5>
                        <div className="text-muted-foreground space-y-4 leading-relaxed">
                            <p>
                                Over the last decade, the incidence of{" "}
                                <span className="font-bold">climate-sensitive diseases</span> has
                                surged across the globe. Heatstroke cases, respiratory
                                hospitalizations, and cardiovascular events are increasingly
                                correlated with environmental extremes.
                            </p>
                            <p>
                                Traditional health surveillance systems track outcomes{" "}
                                <span className="font-bold">after they occur</span>. By the time an
                                outbreak is confirmed, resources are strained and preventive windows
                                have passed. Predictive intelligence changes everything.
                            </p>
                            <p>
                                Sehetna integrates{" "}
                                <span className="font-bold">
                                    satellite environmental data, meteorological feeds, demographic
                                    profiles, and historical health records
                                </span>{" "}
                                into a unified AI model — transforming reactive response into
                                proactive protection.
                            </p>
                        </div>

                        {/* Risk labels */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Heatstroke", color: "var(--color-neutral-300)" },
                                { label: "Respiratory Risk", color: "var(--color-secondary-300)" },
                                { label: "Cardiovascular", color: "var(--color-primary-200)" },
                                { label: "Vector-borne", color: "var(--color-success-100)" },
                                { label: "Water-borne", color: "var(--color-blue-200)" },
                            ].map((tag) => (
                                <span
                                    key={tag.label}
                                    className="bg-background/80 inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-900"
                                >
                                    <span
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                    />
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: image */}
                    <motion.div
                        initial={{ opacity: 0, x: 32, scale: 0.8 }}
                        animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
                        transition={{ duration: 2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full max-h-145 min-h-115 overflow-hidden rounded-4xl border p-6 shadow-lg shadow-black/5 backdrop-blur-xl"
                    >
                        <Image
                            alt="snapshot-1"
                            src="/images/snapshot-1.JPG"
                            fill
                            className="scale-105 border object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
