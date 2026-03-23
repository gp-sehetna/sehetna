import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Methodology",
    description:
        "Understand the methodology and data sources used by Sehetna to generate healthcare insights.",
    alternates: {
        canonical: "/methodology",
    },
}

import { useRef, useState } from "react"
import { motion, useInView } from "motion/react"
import {
    Database,
    Brain,
    BarChart3,
    Satellite,
    CloudRain,
    Users,
    HeartPulse,
    FlaskConical,
    GitMerge,
    Layers,
    CheckCircle2,
    ArrowRight,
    BookOpen,
    Globe,
    Microscope,
    TrendingUp,
    Zap,
    Shield,
    Activity,
} from "lucide-react"
import Link from "next/link"

function SectionHeader({
    label,
    title,
    subtitle,
    labelColor = "#6b8e7a",
}: {
    label: string
    title: string
    subtitle?: string
    labelColor?: string
}) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-60px" })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="mx-auto mb-16 max-w-2xl text-center"
        >
            <div className="mb-5 flex items-center justify-center gap-2">
                <div className="h-px w-8" style={{ backgroundColor: labelColor }} />
                <span
                    className="text-xs font-semibold tracking-widest uppercase"
                    style={{ color: labelColor }}
                >
                    {label}
                </span>
                <div className="h-px w-8" style={{ backgroundColor: labelColor }} />
            </div>
            <h2
                className="text-neutral-1000 mb-4 text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
            >
                {title}
            </h2>
            {subtitle && <p className="text-base leading-relaxed text-neutral-800">{subtitle}</p>}
        </motion.div>
    )
}

const dataSources = [
    {
        icon: Satellite,
        label: "Satellite & Remote Sensing",
        color: "#6b8e7a",
        bg: "#6b8e7a15",
        description:
            "NASA MODIS, Sentinel-2, and LANDSAT data for land surface temperature, NDVI, and surface reflectance indices.",
        providers: ["NASA EarthData", "ESA Copernicus", "USGS Earth Explorer"],
    },
    {
        icon: CloudRain,
        label: "Meteorological Data",
        color: "#c4a882",
        bg: "#c4a88215",
        description:
            "Hourly weather station data, ERA5 reanalysis, and GFS numerical forecasts for temperature, humidity, wind, and precipitation.",
        providers: ["ECMWF ERA5", "NOAA GFS", "WHO Climate Indicators"],
    },
    {
        icon: Users,
        label: "Demographic & Census",
        color: "#8c5aff",
        bg: "#8c5aff15",
        description:
            "Gridded population density (WorldPop), age-distribution records, urbanization indices, and socioeconomic vulnerability scores.",
        providers: ["WorldPop", "UN Population Division", "National Census APIs"],
    },
    {
        icon: HeartPulse,
        label: "Health Surveillance",
        color: "#ff5c02",
        bg: "#ff5c0215",
        description:
            "Hospital admission records, disease incidence databases, mortality registries, and WHO Flunet syndromic surveillance streams.",
        providers: ["WHO FLUNET", "National MOH Databases", "ECDC Surveillance"],
    },
    {
        icon: Globe,
        label: "Environmental Quality",
        color: "#6b8e7a",
        bg: "#6b8e7a15",
        description:
            "Air quality monitoring stations (PM2.5, PM10, NO2, O3), water quality samplings, and soil contamination indices.",
        providers: ["OpenAQ", "WHO AQUASTAT", "EEA Air Quality"],
    },
    {
        icon: Microscope,
        label: "Vector & Disease Ecology",
        color: "#c4a882",
        bg: "#c4a88215",
        description:
            "Entomological surveillance indices, habitat suitability models, and historical outbreak archives for dengue, malaria, and cholera.",
        providers: ["Global Health Observatory", "VectorBase", "ProMED-mail"],
    },
]

const pipelineSteps = [
    {
        step: "01",
        color: "#c4a882",
        icon: Database,
        title: "Data Ingestion & Validation",
        detail: [
            "Automated API connectors and FTP schedulers fetch raw data on configurable cadence (hourly to monthly).",
            "Schema validation, completeness checks, and outlier detection flag anomalies before any transformation.",
            "Source-level provenance metadata is captured for full auditability.",
        ],
    },
    {
        step: "02",
        color: "#6b8e7a",
        icon: GitMerge,
        title: "Harmonization & Alignment",
        detail: [
            "Bilinear interpolation resamples raster data to a common 1 km² spatial grid using WGS84 projection.",
            "Time series are standardized to UTC and gap-filled using climatological means or Kriging interpolation.",
            "Multi-source fusion resolves conflicts using weighted reliability scores per source.",
        ],
    },
    {
        step: "03",
        color: "#8c5aff",
        icon: FlaskConical,
        title: "Feature Engineering",
        detail: [
            "Lagged variables (3-day, 7-day, 14-day rolling windows) capture delayed environmental exposure effects.",
            "Interaction terms and polynomial features encode non-linear climate-health relationships.",
            "Spatial lag features incorporate neighbouring district spillover effects via weight matrices.",
        ],
    },
    {
        step: "04",
        color: "#ff5c02",
        icon: Brain,
        title: "AI Model Inference",
        detail: [
            "Disease-specific model ensembles run in parallel across the 5 risk categories.",
            "Probabilistic outputs include point estimates, 80th and 95th percentile confidence bands.",
            "SHAP explainability values reveal which environmental drivers dominate each prediction.",
        ],
    },
    {
        step: "05",
        color: "#6b8e7a",
        icon: BarChart3,
        title: "Risk Scoring & Alerting",
        detail: [
            "Composite Risk Index (CRI) aggregates model outputs into a 0–100 scale per district.",
            "Threshold-based rules trigger tiered early warnings (Watch / Advisory / Emergency) automatically.",
            "Alert routing distributes notifications to subscribed institutional endpoints via REST webhooks.",
        ],
    },
]

const models = [
    {
        name: "LSTM Network",
        type: "Deep Learning",
        color: "#8c5aff",
        bg: "#8c5aff12",
        icon: Brain,
        use: "Heatstroke, Respiratory",
        rationale:
            "Long Short-Term Memory networks capture long-range temporal dependencies in climate-health time series, retaining seasonal patterns across 365-day lookback windows.",
        specs: ["Lookback: 365 days", "Hidden units: 256", "Layers: 4 stacked"],
        metrics: { rmse: "0.82", auc: "0.91", f1: "0.87" },
    },
    {
        name: "XGBoost Ensemble",
        type: "Gradient Boosting",
        color: "#c4a882",
        bg: "#c4a88212",
        icon: TrendingUp,
        use: "Cardiovascular, Vector-borne",
        rationale:
            "Gradient-boosted decision trees handle heterogeneous tabular features (demographics, socioeconomic) with natural feature importance, outperforming neural nets on structured inputs.",
        specs: ["Trees: 800 estimators", "Max depth: 7", "Learning rate: 0.01"],
        metrics: { rmse: "0.71", auc: "0.94", f1: "0.89" },
    },
    {
        name: "Temporal Fusion Transformer",
        type: "Attention-based DL",
        color: "#6b8e7a",
        bg: "#6b8e7a12",
        icon: Zap,
        use: "Water-borne, Multi-hazard",
        rationale:
            "TFT uses multi-head attention to model variable-selection across heterogeneous input types, providing interpretable static and time-varying covariate weights.",
        specs: ["Attention heads: 8", "Hidden: 512", "Dropout: 0.3"],
        metrics: { rmse: "0.68", auc: "0.93", f1: "0.88" },
    },
    {
        name: "Random Forest Classifier",
        type: "Ensemble Learning",
        color: "#ff5c02",
        bg: "#ff5c0212",
        icon: Layers,
        use: "Early-warning Classifier",
        rationale:
            "Bootstrap-aggregated decision trees provide robust binary risk classification with inherent uncertainty via out-of-bag estimates and low variance in sparse data regions.",
        specs: ["Estimators: 500", "Min samples leaf: 10", "Max features: sqrt"],
        metrics: { rmse: "—", auc: "0.90", f1: "0.85" },
    },
]

const validationItems = [
    {
        icon: Shield,
        label: "Cross-Validation",
        text: "5-fold walk-forward cross-validation on 2010–2023 historical data respects temporal ordering and prevents data leakage.",
    },
    {
        icon: Activity,
        label: "Calibration",
        text: "Probability calibration via Platt scaling ensures predicted risk percentages match observed frequencies across 1,000 bootstrapped samples.",
    },
    {
        icon: CheckCircle2,
        label: "Bias Audit",
        text: "Subgroup performance parity checks across income decile, age band, and urban/rural classification prevent discriminatory risk allocation.",
    },
    {
        icon: BookOpen,
        label: "Peer Benchmarking",
        text: "Models are benchmarked against WHO Climate Change and Health reports and CDC Environmental Public Health Tracking baselines.",
    },
]

function DataSourceCard({ source, index }: { source: (typeof dataSources)[0]; index: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-40px" })
    const Icon = source.icon
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            className="group rounded-3xl border border-white/80 bg-white/60 p-6 shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-black/8"
        >
            <div
                className="mb-4 inline-flex rounded-2xl p-3"
                style={{ backgroundColor: source.bg }}
            >
                <Icon size={22} style={{ color: source.color, strokeWidth: 1.5 }} />
            </div>
            <h3
                className="text-neutral-1000 mb-2 text-base"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
            >
                {source.label}
            </h3>
            <p className="mb-4 text-xs leading-relaxed text-neutral-800">{source.description}</p>
            <div className="flex flex-col gap-1.5">
                {source.providers.map((p) => (
                    <div key={p} className="flex items-center gap-2">
                        <div
                            className="h-1 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: source.color }}
                        />
                        <span className="text-2xs font-medium text-neutral-600">{p}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function ModelCard({ model, index }: { model: (typeof models)[0]; index: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-40px" })
    const Icon = model.icon
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className="rounded-3xl border border-white/80 bg-white/60 p-7 shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div className="mb-4 flex items-start justify-between">
                <div className="inline-flex rounded-2xl p-3" style={{ backgroundColor: model.bg }}>
                    <Icon size={22} style={{ color: model.color, strokeWidth: 1.5 }} />
                </div>
                <span
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: model.bg, color: model.color }}
                >
                    {model.type}
                </span>
            </div>
            <h3
                className="text-neutral-1000 mb-1 text-lg"
                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
            >
                {model.name}
            </h3>
            <p className="mb-4 text-xs font-medium text-neutral-600">Applied to: {model.use}</p>
            <p className="mb-5 text-xs leading-relaxed text-neutral-800">{model.rationale}</p>
            <div className="mb-5 flex flex-wrap gap-2">
                {model.specs.map((s) => (
                    <span
                        key={s}
                        className="text-2xs rounded-lg bg-[#f5f0eb] px-2.5 py-1 font-mono font-medium text-neutral-700"
                    >
                        {s}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-[#f0ece8] pt-4">
                {[
                    { label: "RMSE", val: model.metrics.rmse },
                    { label: "AUC-ROC", val: model.metrics.auc },
                    { label: "F1 Score", val: model.metrics.f1 },
                ].map((m) => (
                    <div key={m.label} className="text-center">
                        <div
                            className="text-base"
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontWeight: 700,
                                color: model.color,
                            }}
                        >
                            {m.val}
                        </div>
                        <div className="text-2xs text-neutral-500">{m.label}</div>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default function Methodology() {
    const heroRef = useRef(null)
    const [activeStep, setActiveStep] = useState(0)

    return (
        <>
            {/* Hero */}
            <section
                className="relative overflow-hidden pt-40 pb-24"
                style={{
                    background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 50%, #f0f4f1 100%)",
                }}
            >
                <div className="pointer-events-none absolute -top-40 right-0 h-125 w-150 rounded-full bg-linear-to-bl from-[#c4a882]/12 to-transparent blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-75 w-100 rounded-full bg-linear-to-tr from-[#6b8e7a]/10 to-transparent blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #222 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div ref={heroRef} className="relative mx-auto max-w-7xl px-6 text-center lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl">
                            <BookOpen size={13} className="text-[#6b8e7a]" strokeWidth={2} />
                            <span className="text-xs font-semibold text-neutral-800">
                                Scientific Methodology
                            </span>
                        </div>
                        <h1
                            className="text-neutral-1000 mb-6 text-5xl leading-[1.05] lg:text-7xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            How Sehetna Turns{" "}
                            <span
                                className="relative inline-block"
                                style={{
                                    background: "linear-gradient(135deg, #c4a882, #6b8e7a)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Environmental Data
                            </span>{" "}
                            Into Health Foresight
                        </h1>
                        <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-neutral-800 lg:text-lg">
                            An inside look at the data sources, preprocessing workflows, AI
                            architectures, and validation frameworks that power Sehetna{"'"}s
                            multi-risk health prediction system.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            {[
                                { val: "12+", label: "Data Sources" },
                                { val: "4", label: "AI Architectures" },
                                { val: "5", label: "Disease Categories" },
                                { val: "92%", label: "Avg. AUC-ROC" },
                            ].map((s) => (
                                <div key={s.label} className="text-center">
                                    <div
                                        className="text-neutral-1000 text-3xl"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {s.val}
                                    </div>
                                    <div className="text-xs font-medium text-neutral-600">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Data Sources */}
            <section className="relative overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeader
                        label="Data Sources"
                        title="What Sehetna Ingests"
                        subtitle="A curated multi-domain dataset spanning environmental, climatic, demographic, ecological, and epidemiological signals — updated at cadences from hourly to annual."
                    />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {dataSources.map((src, i) => (
                            <DataSourceCard key={src.label} source={src} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Preprocessing Pipeline */}
            <section
                className="relative overflow-hidden py-24 lg:py-32"
                style={{
                    background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 100%)",
                }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeader
                        label="Preprocessing Pipeline"
                        title="From Raw Signal to Clean Features"
                        subtitle="Five rigorous stages transform noisy, heterogeneous data streams into model-ready feature tensors — ensuring reproducibility and scientific integrity."
                        labelColor="#c4a882"
                    />

                    {/* Step tabs */}
                    <div className="mb-10 flex flex-wrap justify-center gap-2">
                        {pipelineSteps.map((s, i) => (
                            <button
                                key={s.step}
                                onClick={() => setActiveStep(i)}
                                className={`rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                                    activeStep === i
                                        ? "text-white shadow-lg"
                                        : "border border-white/60 bg-white/60 text-neutral-800 hover:bg-white/80"
                                }`}
                                style={
                                    activeStep === i
                                        ? {
                                              background: `linear-gradient(135deg, ${s.color}, ${s.color}cc)`,
                                              boxShadow: `0 6px 20px ${s.color}30`,
                                          }
                                        : {}
                                }
                            >
                                <span className="mr-1.5 text-xs font-bold opacity-60">
                                    {s.step}
                                </span>
                                {s.title.split(" ").slice(0, 2).join(" ")}
                            </button>
                        ))}
                    </div>

                    {/* Active step */}
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="grid gap-6 lg:grid-cols-5"
                    >
                        <div className="rounded-3xl border border-white/80 bg-white/60 p-8 shadow-md shadow-black/5 backdrop-blur-xl lg:col-span-2">
                            {(() => {
                                const step = pipelineSteps[activeStep]
                                const Icon = step.icon
                                return (
                                    <>
                                        <div
                                            className="mb-5 inline-flex rounded-2xl p-3"
                                            style={{ backgroundColor: `${step.color}15` }}
                                        >
                                            <Icon
                                                size={24}
                                                style={{ color: step.color, strokeWidth: 1.5 }}
                                            />
                                        </div>
                                        <div
                                            className="mb-1 text-xs font-bold tracking-widest uppercase"
                                            style={{ color: step.color }}
                                        >
                                            Stage {step.step}
                                        </div>
                                        <h3
                                            className="text-neutral-1000 mb-6 text-xl"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {step.title}
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            {step.detail.map((d, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div
                                                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                                                        style={{
                                                            backgroundColor: `${step.color}20`,
                                                        }}
                                                    >
                                                        <span
                                                            className="text-2xs font-bold"
                                                            style={{ color: step.color }}
                                                        >
                                                            {i + 1}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-neutral-800">
                                                        {d}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )
                            })()}
                        </div>

                        {/* Visual steps list */}
                        <div className="flex flex-col gap-3 lg:col-span-3">
                            {pipelineSteps.map((s, i) => {
                                const Icon = s.icon
                                const isActive = i === activeStep
                                const isPast = i < activeStep
                                return (
                                    <button
                                        key={s.step}
                                        onClick={() => setActiveStep(i)}
                                        className={`flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 ${
                                            isActive
                                                ? "border bg-white/80 shadow-md"
                                                : isPast
                                                  ? "border border-white/60 bg-white/40 opacity-70"
                                                  : "border border-white/40 bg-white/30 opacity-50"
                                        }`}
                                        style={
                                            isActive
                                                ? {
                                                      borderColor: `${s.color}30`,
                                                      boxShadow: `0 4px 20px ${s.color}15`,
                                                  }
                                                : {}
                                        }
                                    >
                                        <div
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: isActive
                                                    ? s.color
                                                    : `${s.color}20`,
                                            }}
                                        >
                                            <Icon
                                                size={16}
                                                strokeWidth={1.5}
                                                style={{ color: isActive ? "white" : s.color }}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div
                                                className="mb-0.5 text-xs font-bold"
                                                style={{ color: s.color }}
                                            >
                                                Stage {s.step}
                                            </div>
                                            <div
                                                className="text-neutral-1000 truncate text-sm"
                                                style={{
                                                    fontFamily: "var(--font-heading)",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {s.title}
                                            </div>
                                        </div>
                                        {isPast && (
                                            <CheckCircle2
                                                size={16}
                                                style={{ color: s.color }}
                                                strokeWidth={1.5}
                                            />
                                        )}
                                        {isActive && (
                                            <div
                                                className="h-2 w-2 shrink-0 animate-pulse rounded-full"
                                                style={{ backgroundColor: s.color }}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* AI Models */}
            <section className="relative overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeader
                        label="AI Architecture"
                        title="Models, and Why We Chose Them"
                        subtitle="Each model is selected not for novelty, but for proven performance on the specific statistical structure of its target disease-environment relationship."
                        labelColor="#8c5aff"
                    />
                    <div className="grid gap-6 md:grid-cols-2">
                        {models.map((m, i) => (
                            <ModelCard key={m.name} model={m} index={i} />
                        ))}
                    </div>

                    {/* Ensemble strategy note */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="from-secondary-300/8 to-primary/8 mt-8 rounded-3xl border border-white/80 bg-linear-to-r via-[#6b8e7a]/6 p-8 backdrop-blur-xl"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-secondary-300/15 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                <Layers size={18} style={{ color: "#8c5aff", strokeWidth: 1.5 }} />
                            </div>
                            <div>
                                <h4
                                    className="text-neutral-1000 mb-2 text-base"
                                    style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                                >
                                    Ensemble Strategy
                                </h4>
                                <p className="text-sm leading-relaxed text-neutral-800">
                                    Disease predictions are produced by a stacked ensemble: base
                                    model outputs are concatenated as meta-features and fed to a
                                    lightweight ridge regression meta-learner. This consistently
                                    outperforms any single model by 4–7% AUC on held-out test sets,
                                    while hedging against individual model failure modes.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Validation */}
            <section
                className="relative overflow-hidden py-24 lg:py-32"
                style={{ background: "linear-gradient(160deg, #f0f4f1 0%, #faf9f7 100%)" }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-neutral-200 to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <SectionHeader
                        label="Validation & Ethics"
                        title="Rigorous, Transparent, Accountable"
                        subtitle="Scientific credibility requires more than accuracy metrics. Sehetna applies systematic validation practices grounded in epidemiological standards."
                        labelColor="#6b8e7a"
                    />
                    <div className="mb-12 grid gap-5 sm:grid-cols-2">
                        {validationItems.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="flex items-start gap-4 rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6b8e7a]/12">
                                        <Icon
                                            size={18}
                                            style={{ color: "#6b8e7a", strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <div>
                                        <h4
                                            className="text-neutral-1000 mb-1.5 text-sm"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {item.label}
                                        </h4>
                                        <p className="text-xs leading-relaxed text-neutral-800">
                                            {item.text}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center"
                    >
                        <Link
                            href="/use-cases"
                            className="inline-flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background: "linear-gradient(135deg, #6b8e7a, #8aae9a)",
                                boxShadow: "0 10px 30px rgba(107,142,122,0.25)",
                            }}
                        >
                            See Real-World Use Cases
                            <ArrowRight size={16} strokeWidth={1.5} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
