"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { AlertTriangle, Globe, Thermometer, TrendingUp, type LucideIcon } from "lucide-react"
import Image from "next/image"
import { useCounter } from "@/hooks/use-counter"
import SectionEyebrow from "./SectionEyebrow"
import SectionShell from "./SectionShell"
import { fadeUp, slideInLeft, slideInRight, staggerDelay } from "./motion"
import { PrimarySecondaryDecoration } from "../GlobalComponents/extras/BackgroundDecorations"

type StatElement = {
    icon: LucideIcon
    value: number
    suffix: string
    label: string
    accentClassName: string
    surfaceClassName: string
    dotColor: string
}

const stats: StatElement[] = [
    {
        icon: Thermometer,
        value: 250,
        suffix: "M+",
        label: "People at risk of heatstroke globally each year",
        accentClassName: "text-primary",
        surfaceClassName: "bg-primary-100/30",
        dotColor: "var(--color-primary)",
    },
    {
        icon: TrendingUp,
        value: 40,
        suffix: "%",
        label: "Rise in climate-linked respiratory illness since 2010",
        accentClassName: "text-secondary-300",
        surfaceClassName: "bg-secondary-100/40",
        dotColor: "var(--color-secondary-300)",
    },
    {
        icon: Globe,
        value: 7,
        suffix: "M",
        label: "Premature deaths linked to air pollution annually (WHO)",
        accentClassName: "text-success",
        surfaceClassName: "bg-success-100/20",
        dotColor: "var(--color-success-300)",
    },
    {
        icon: AlertTriangle,
        value: 60,
        suffix: "%",
        label: "Of health systems lack real-time environmental risk data",
        accentClassName: "text-earth",
        surfaceClassName: "bg-earth-100",
        dotColor: "var(--color-earth-300)",
    },
]

function StatCard({ stat, index, inView }: { stat: StatElement; index: number; inView: boolean }) {
    const count = useCounter(stat.value, 2200, inView)
    const Icon = stat.icon

    return (
        <motion.div
            initial={{ opacity: 0, x: 64 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: staggerDelay(index) }}
        >
            <div className="home-surface relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8">
                <div
                    className="absolute -top-8 -right-8 h-24 w-24 rounded-full opacity-10 blur-2xl"
                    style={{ backgroundColor: stat.dotColor }}
                />
                <div className={`mb-4 inline-flex rounded-2xl p-2.5 ${stat.surfaceClassName}`}>
                    <Icon size={20} className={stat.accentClassName} strokeWidth={1.5} />
                </div>
                <div className="mb-2 flex items-end gap-0.5">
                    <span className={`text-4xl ${stat.accentClassName}`}>{count}</span>
                    <span className={`pb-0.5 text-2xl ${stat.accentClassName}`}>{stat.suffix}</span>
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
        <SectionShell texture="dots" decoration={<PrimarySecondaryDecoration />}>
            <div ref={ref} className="flex flex-col gap-12">
                <motion.div
                    initial={fadeUp.initial}
                    animate={inView ? fadeUp.whileInView : {}}
                    transition={fadeUp.transition}
                    className="flex max-w-2xl flex-col gap-4"
                >
                    <SectionEyebrow label="The Challenge" className="text-primary" />
                    <h2>A Critical Gap in Health Monitoring</h2>
                    <p className="text-neutral-800">
                        Environmental conditions, heat, air quality, humidity, and rainfall quietly
                        shape the health of communities every day. Yet most health systems operate{" "}
                        <span className="text-neutral-1000 font-medium">
                            without real-time environmental intelligence
                        </span>
                        , responding to crises after they{"'"}ve already formed. Sehetna bridges
                        this gap.
                    </p>
                </motion.div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label} stat={stat} index={index} inView={inView} />
                    ))}
                </div>

                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <motion.div
                        initial={slideInLeft.initial}
                        animate={inView ? slideInLeft.whileInView : {}}
                        transition={{ ...slideInLeft.transition, delay: 0.2 }}
                        className="flex flex-col gap-6"
                    >
                        <h5>Rising Health Burdens Tied to Our Environment</h5>
                        <div className="text-muted-foreground flex flex-col gap-4">
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
                                into a unified AI model, transforming reactive response into
                                proactive protection.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Heatstroke", color: "var(--color-earth-300)" },
                                { label: "Respiratory Risk", color: "var(--color-secondary-300)" },
                                { label: "Cardiovascular", color: "var(--color-primary-200)" },
                                { label: "Vector-borne", color: "var(--color-success-100)" },
                                { label: "Water-borne", color: "var(--color-info-200)" },
                            ].map((tag) => (
                                <span
                                    key={tag.label}
                                    className="bg-background/80 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-neutral-900"
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

                    <motion.div
                        initial={{ ...slideInRight.initial, scale: 0.92 }}
                        animate={inView ? { ...slideInRight.whileInView, scale: 1 } : {}}
                        transition={{ ...slideInRight.transition, delay: 0.3 }}
                        className="home-surface relative min-h-115 overflow-hidden rounded-4xl"
                    >
                        <Image
                            alt="Environmental health dashboard snapshot"
                            src="/images/snapshot-1.JPG"
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                </div>
            </div>
        </SectionShell>
    )
}
