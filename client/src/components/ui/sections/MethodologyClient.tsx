"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import {
    Activity,
    ArrowRight,
    BarChart3,
    BookOpen,
    Brain,
    CheckCircle2,
    CloudRain,
    Database,
    FlaskConical,
    GitMerge,
    Globe,
    HeartPulse,
    Layers,
    Microscope,
    Satellite,
    Shield,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react"
import Texture from "@/components/ui/textures"
import Gradient from "@/components/ui/GlobalComponents/extras/gradient"
import Divider from "@/components/ui/GlobalControls/Divider"
import SectionHeading from "./SectionHeading"

const dataSources = [
    {
        icon: Satellite,
        title: "Satellite & remote sensing",
        description:
            "MODIS, Sentinel, and LANDSAT layers for land temperature, reflectance, and vegetation indices.",
        providers: "NASA EarthData, Copernicus, USGS",
        accent: "text-success",
        surface: "bg-success-100/20",
    },
    {
        icon: CloudRain,
        title: "Meteorological data",
        description:
            "ERA5, GFS, and station observations for temperature, humidity, wind, and rainfall.",
        providers: "ECMWF, NOAA, WHO indicators",
        accent: "text-warning-200",
        surface: "bg-warning-100/20",
    },
    {
        icon: Users,
        title: "Demographic signals",
        description:
            "Population density, age structure, urbanisation, and vulnerability layers for exposure modeling.",
        providers: "WorldPop, UN Population Division",
        accent: "text-secondary-300",
        surface: "bg-secondary-100/40",
    },
    {
        icon: HeartPulse,
        title: "Health surveillance",
        description:
            "Admissions, incidence, and registry data used to calibrate and validate model outputs.",
        providers: "WHO, Ministries of Health, ECDC",
        accent: "text-primary",
        surface: "bg-primary-100/30",
    },
]

const pipelineSteps = [
    {
        step: "01",
        icon: Database,
        title: "Ingestion & validation",
        accent: "var(--color-warning-200)",
        detail: "Automated connectors fetch raw data on a fixed cadence, then run schema, completeness, and outlier checks before anything is transformed.",
    },
    {
        step: "02",
        icon: GitMerge,
        title: "Harmonization",
        accent: "var(--color-success-300)",
        detail: "Environmental, demographic, and health sources are aligned to a common spatial grid and temporal baseline so features remain comparable.",
    },
    {
        step: "03",
        icon: FlaskConical,
        title: "Feature engineering",
        accent: "var(--color-secondary-300)",
        detail: "Lag windows, interactions, and spatial spillover features are created to capture delayed and non-linear health effects.",
    },
    {
        step: "04",
        icon: Brain,
        title: "Model inference",
        accent: "var(--color-primary)",
        detail: "Disease-specific ensembles generate probabilistic forecasts with uncertainty bands and interpretable driver importance.",
    },
    {
        step: "05",
        icon: BarChart3,
        title: "Risk scoring",
        accent: "var(--color-success-300)",
        detail: "Outputs are aggregated into a district-level risk score that powers dashboards, alerting, and institutional delivery workflows.",
    },
]

const models = [
    {
        icon: Brain,
        title: "LSTM network",
        type: "Deep learning",
        use: "Heatstroke and respiratory forecasting",
        description: "Captures long-range seasonal patterns in climate-health time series.",
        accent: "text-secondary-300",
        surface: "bg-secondary-100/40",
    },
    {
        icon: TrendingUp,
        title: "XGBoost ensemble",
        type: "Gradient boosting",
        use: "Cardiovascular and vector-borne risk",
        description: "Performs strongly on structured demographic and socioeconomic features.",
        accent: "text-warning-200",
        surface: "bg-warning-100/20",
    },
    {
        icon: Zap,
        title: "Temporal fusion transformer",
        type: "Attention model",
        use: "Water-borne and multi-hazard use cases",
        description: "Provides interpretable variable selection across mixed feature types.",
        accent: "text-success",
        surface: "bg-success-100/20",
    },
    {
        icon: Layers,
        title: "Random forest classifier",
        type: "Ensemble learning",
        use: "Early-warning classification",
        description: "Offers robust classification and stable behaviour in sparse-data settings.",
        accent: "text-primary",
        surface: "bg-primary-100/30",
    },
]

const validationItems = [
    {
        icon: Shield,
        title: "Cross-validation",
        text: "Walk-forward validation preserves temporal order and reduces leakage risk.",
    },
    {
        icon: Activity,
        title: "Calibration",
        text: "Probability calibration keeps forecast percentages aligned with observed outcomes.",
    },
    {
        icon: CheckCircle2,
        title: "Bias review",
        text: "Subgroup checks help surface uneven performance across regions and populations.",
    },
    {
        icon: BookOpen,
        title: "Benchmarking",
        text: "Outputs are compared against public-health and climate-health baselines.",
    },
]

export default function MethodologyClient() {
    const [activeStep, setActiveStep] = useState(0)
    const step = pipelineSteps[activeStep]
    const StepIcon = step.icon

    return (
        <main className="bg-primary-50">
            <section className="relative overflow-hidden py-24">
                <Texture texture="dots" />
                <div className="from-warning-100/40 pointer-events-none absolute -top-32 right-0 h-80 w-96 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
                <div className="from-success-100/30 pointer-events-none absolute bottom-0 left-0 h-64 w-80 rounded-full bg-linear-to-tr to-transparent blur-3xl" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
                    <div className="flex flex-col gap-6">
                        <div className="bg-background/80 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 shadow-sm backdrop-blur-xl">
                            <BookOpen size={13} className="text-success" strokeWidth={2} />
                            <span className="text-xs font-semibold text-neutral-800">
                                Scientific Methodology
                            </span>
                        </div>
                        <h1>
                            How Sehetna turns{" "}
                            <span className="from-warning-200 to-success bg-linear-to-r bg-clip-text text-transparent">
                                environmental data
                            </span>{" "}
                            into health foresight
                        </h1>
                        <p className="max-w-3xl text-lg text-neutral-800">
                            A closer look at the sources, preprocessing workflow, model stack, and
                            validation standards behind Sehetna&apos;s health intelligence system.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-4">
                            {[
                                ["12+", "Data sources"],
                                ["4", "Model families"],
                                ["5", "Risk categories"],
                                ["92%", "Avg. AUC-ROC"],
                            ].map(([value, label]) => (
                                <div
                                    key={label}
                                    className="bg-background/70 rounded-2xl border px-5 py-4 text-center backdrop-blur-xl"
                                >
                                    <div className="text-neutral-1000 text-3xl">{value}</div>
                                    <div className="text-xs font-medium text-neutral-600">
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-background/60 rounded-[2rem] border border-white/80 p-6 shadow-xl shadow-black/5 backdrop-blur-xl">
                        <Divider hideDecorations className="justify-start">
                            <span className="text-success text-xs font-semibold tracking-widest uppercase">
                                System view
                            </span>
                        </Divider>
                        <div className="mt-6 grid gap-4">
                            {[
                                "Ingestion",
                                "Alignment",
                                "Feature engineering",
                                "Inference",
                                "Alerting",
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className="bg-background/80 flex items-center gap-4 rounded-2xl px-4 py-4"
                                >
                                    <div className="bg-success-100/30 text-success flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold">
                                        {index + 1}
                                    </div>
                                    <div className="text-sm font-medium text-neutral-900">
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative py-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
                    <SectionHeading
                        label="Data Sources"
                        title="What Sehetna ingests"
                        subtitle="A multi-domain dataset spanning environmental, climatic, demographic, and epidemiological signals."
                        labelClassName="text-success"
                    />
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {dataSources.map((source) => {
                            const Icon = source.icon
                            return (
                                <motion.div
                                    key={source.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="bg-background/60 rounded-3xl border border-white/80 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                                >
                                    <div
                                        className={`mb-4 inline-flex rounded-2xl p-3 ${source.surface}`}
                                    >
                                        <Icon
                                            size={20}
                                            className={source.accent}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-base">{source.title}</h3>
                                    <p className="mt-2 text-sm text-neutral-800">
                                        {source.description}
                                    </p>
                                    <p className="mt-4 text-xs font-medium text-neutral-600">
                                        {source.providers}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="from-primary-50 to-background relative overflow-hidden bg-linear-to-b py-24">
                <Gradient
                    where="top"
                    className="opacity-20"
                    tint="from-warning-100 to-transparent"
                />
                <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-8">
                    <SectionHeading
                        label="Preprocessing Pipeline"
                        title="From raw signal to clean features"
                        subtitle="Five stages transform heterogeneous inputs into model-ready features."
                        labelClassName="text-warning-200"
                    />
                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
                        <div className="bg-background/70 rounded-3xl border border-white/80 p-8 shadow-md shadow-black/5 backdrop-blur-xl">
                            <div
                                className="inline-flex rounded-2xl p-3"
                                style={{ backgroundColor: `${step.accent}15` }}
                            >
                                <StepIcon
                                    size={22}
                                    style={{ color: step.accent }}
                                    strokeWidth={1.5}
                                />
                            </div>
                            <div
                                className="mt-5 text-xs font-bold tracking-widest uppercase"
                                style={{ color: step.accent }}
                            >
                                Stage {step.step}
                            </div>
                            <h3 className="mt-2">{step.title}</h3>
                            <p className="mt-4 text-sm text-neutral-800">{step.detail}</p>
                        </div>
                        <div className="grid gap-3">
                            {pipelineSteps.map((item, index) => {
                                const Icon = item.icon
                                const active = index === activeStep
                                return (
                                    <button
                                        key={item.step}
                                        onClick={() => setActiveStep(index)}
                                        className={`flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${
                                            active
                                                ? "bg-background border-transparent shadow-md shadow-black/5"
                                                : "bg-background/40 border-white/60"
                                        }`}
                                        style={
                                            active
                                                ? { boxShadow: `0 10px 24px ${item.accent}15` }
                                                : undefined
                                        }
                                    >
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: active
                                                    ? item.accent
                                                    : `${item.accent}15`,
                                            }}
                                        >
                                            <Icon
                                                size={18}
                                                style={{ color: active ? "white" : item.accent }}
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                                            <span
                                                className="text-xs font-bold tracking-widest uppercase"
                                                style={{ color: item.accent }}
                                            >
                                                Stage {item.step}
                                            </span>
                                            <span className="text-neutral-1000 truncate text-sm font-semibold">
                                                {item.title}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative py-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
                    <SectionHeading
                        label="AI Architecture"
                        title="Models and why we chose them"
                        subtitle="Each model is matched to the statistical structure of its target health signal."
                        labelClassName="text-secondary-300"
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                        {models.map((model) => {
                            const Icon = model.icon
                            return (
                                <motion.div
                                    key={model.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="bg-background/60 rounded-3xl border border-white/80 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div
                                            className={`inline-flex rounded-2xl p-3 ${model.surface}`}
                                        >
                                            <Icon
                                                size={20}
                                                className={model.accent}
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${model.surface} ${model.accent}`}
                                        >
                                            {model.type}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-lg">{model.title}</h3>
                                    <p className="mt-1 text-xs font-medium text-neutral-600">
                                        {model.use}
                                    </p>
                                    <p className="mt-4 text-sm text-neutral-800">
                                        {model.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="from-success-100/15 to-background relative overflow-hidden bg-linear-to-b py-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
                    <SectionHeading
                        label="Validation & Ethics"
                        title="Rigorous, transparent, accountable"
                        subtitle="Scientific credibility depends on validation, calibration, benchmarking, and ethical review."
                        labelClassName="text-success"
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                        {validationItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="bg-background/60 flex items-start gap-4 rounded-3xl border border-white/80 p-6 shadow-sm backdrop-blur-xl"
                                >
                                    <div className="bg-success-100/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                        <Icon
                                            size={18}
                                            className="text-success"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm">{item.title}</h3>
                                        <p className="mt-1 text-sm text-neutral-800">{item.text}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                    <div className="text-center">
                        <Link
                            href="/use-cases"
                            className="from-success to-success-300 inline-flex items-center gap-2.5 rounded-2xl bg-linear-to-r px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                        >
                            See real-world use cases
                            <ArrowRight size={16} strokeWidth={1.5} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
