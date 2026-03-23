import { Metadata } from "next"

const useCaseMap: Record<string, { title: string; description: string }> = {
    "health-monitoring": {
        title: "Health Monitoring",
        description:
            "Monitor your health and well-being with Sehetna's healthcare analytics and insights.",
    },
    "health-preparedness": {
        title: "Health Preparedness",
        description:
            "Prepare for potential health issues with Sehetna's health preparedness tools and resources.",
    },
    "policy-planning": {
        title: "Policy Planning",
        description:
            "Plan and implement healthcare policies with Sehetna's policy planning tools and resources.",
    },
    "research-insights": {
        title: "Research Insights",
        description:
            "Gain insights into healthcare research and innovations with Sehetna's research insights and resources.",
    },
}

type UseCasePageProps = {
    params: { case: string }
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
    const { case: useCase } = await params
    if (!useCase || !useCaseMap?.[useCase]) return {}

    return {
        title: `${useCaseMap[useCase]?.title} · Sehetna`,
        description: useCaseMap[useCase]?.description,
        alternates: {
            canonical: `/use-cases/${useCase}`,
        },
    }
}

// export default async function UseCasePage({ params }: UseCasePageProps) {
//     const { case: useCase } = await params
//     if (!useCase || !useCaseMap?.[useCase])
//         return <ComingSoon title="Use Cases" description="Learn about Sehetna's use cases" />

//     return (
//         <ComingSoon
//             title={useCaseMap[useCase].title}
//             description={useCaseMap[useCase].description}
//         />
//     )
// }

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    BarChart3,
    Database,
    Brain,
    BellRing,
    ChevronRight,
    Layers,
    TrendingUp,
} from "lucide-react"
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts"

/* ── Per-case extended data ─────────────────────────── */

const extendedData: Record<
    string,
    {
        fullDesc: string
        drivers: { label: string; weight: number }[]
        outputs: string[]
        institutionStory: {
            institution: string
            region: string
            outcome: string
        }
        chartData: { month: string; risk: number; observed: number }[]
        pipeline: string[]
    }
> = {
    heatstroke: {
        fullDesc:
            "Extreme heat is the leading weather-related cause of death globally, with the greatest burden falling on the elderly, outdoor workers, and urban residents in low-income neighbourhoods. Sehetna's heatstroke module integrates land surface temperature (LST) from MODIS satellite retrievals, wet-bulb globe temperature calculations, urban heat island intensity, and population vulnerability scores to generate district-level probabilistic forecasts up to 14 days ahead.",
        drivers: [
            { label: "Land Surface Temperature (LST)", weight: 28 },
            { label: "Humidity (Wet-Bulb)", weight: 22 },
            { label: "Urban Heat Island Index", weight: 18 },
            { label: "Age-65+ Population Share", weight: 16 },
            { label: "Greenspace Coverage (NDVI)", weight: 10 },
            { label: "Socioeconomic Vulnerability", weight: 6 },
        ],
        outputs: [
            "Daily heat stress index (0–100) per district",
            "Probability of Heat Emergency threshold exceedance",
            "Affected population estimates by age cohort",
            "7-day rolling heat accumulation anomaly map",
        ],
        institutionStory: {
            institution: "Cairo Governorate Health Directorate",
            region: "Greater Cairo, Egypt",
            outcome:
                "Deployed Sehetna's thermal alerts during the 2024 summer season. Emergency cooling centre activation was pre-positioned 72 hours before peak events, reducing hospital admissions by an estimated 14% compared to 2023.",
        },
        chartData: [
            { month: "Jan", risk: 12, observed: 10 },
            { month: "Feb", risk: 14, observed: 15 },
            { month: "Mar", risk: 22, observed: 20 },
            { month: "Apr", risk: 38, observed: 35 },
            { month: "May", risk: 58, observed: 55 },
            { month: "Jun", risk: 78, observed: 80 },
            { month: "Jul", risk: 91, observed: 89 },
            { month: "Aug", risk: 88, observed: 85 },
            { month: "Sep", risk: 65, observed: 62 },
            { month: "Oct", risk: 42, observed: 40 },
            { month: "Nov", risk: 24, observed: 22 },
            { month: "Dec", risk: 14, observed: 12 },
        ],
        pipeline: [
            "Ingest MODIS LST + ERA5 reanalysis → hourly",
            "Compute Wet-Bulb Globe Temperature (WBGT) per grid cell",
            "Apply urban morphology correction factors",
            "Extract demographic vulnerability overlay",
            "Run LSTM ensemble → 14-day probabilistic forecast",
            "Surface district-level risk alerts + GIS export",
        ],
    },
    respiratory: {
        fullDesc:
            "Air pollution is responsible for 7 million premature deaths annually. Sehetna's respiratory module fuses ground-station PM2.5/PM10 readings with satellite-derived aerosol optical depth (AOD), modelled NO2 and O3 columns, and wildfire smoke plume trajectories to forecast acute and chronic respiratory disease incidence at sub-district resolution, with particular attention to paediatric and asthma-prone populations.",
        drivers: [
            { label: "PM2.5 Concentration (24-hr avg)", weight: 32 },
            { label: "Ozone (O3) 8-hr Peak", weight: 20 },
            { label: "NO2 Column Density", weight: 18 },
            { label: "Aerosol Optical Depth (AOD)", weight: 15 },
            { label: "Baseline Respiratory Prevalence", weight: 10 },
            { label: "Wind Speed / Dispersion", weight: 5 },
        ],
        outputs: [
            "Air Quality Health Index (AQHI) per sub-district",
            "Probability of ED visit surge (>20% above baseline)",
            "Paediatric vs. elderly exposure-response breakdown",
            "Pollutant source attribution (traffic, industry, fire)",
        ],
        institutionStory: {
            institution: "Lebanese Ministry of Environment",
            region: "Greater Beirut & Mount Lebanon",
            outcome:
                "Integrated Sehetna respiratory forecasts into the national air quality warning system in 2024. School closures and outdoor activity advisories were issued proactively on 8 occasions, avoiding an estimated 2,200 avoidable asthma exacerbations.",
        },
        chartData: [
            { month: "Jan", risk: 55, observed: 52 },
            { month: "Feb", risk: 48, observed: 50 },
            { month: "Mar", risk: 42, observed: 44 },
            { month: "Apr", risk: 36, observed: 34 },
            { month: "May", risk: 30, observed: 28 },
            { month: "Jun", risk: 24, observed: 26 },
            { month: "Jul", risk: 20, observed: 18 },
            { month: "Aug", risk: 22, observed: 24 },
            { month: "Sep", risk: 34, observed: 32 },
            { month: "Oct", risk: 46, observed: 44 },
            { month: "Nov", risk: 58, observed: 56 },
            { month: "Dec", risk: 62, observed: 60 },
        ],
        pipeline: [
            "Ingest OpenAQ ground stations + Sentinel-5P NO2/O3",
            "Fuse satellite AOD with CAMS chemical transport model",
            "Apply wildfire smoke plume trajectory correction",
            "Overlay demographic exposure vulnerability",
            "Run XGBoost + TFT ensemble → 10-day forecast",
            "Output AQHI map + alert routing to health authorities",
        ],
    },
    cardiovascular: {
        fullDesc:
            "Cold spells and extreme heat events significantly elevate short-term cardiovascular mortality, particularly in populations over 65 with pre-existing conditions. Sehetna's cardiovascular module models the non-linear temperature-mortality relationship using distributed lag non-linear models (DLNM) as ground truth, trained against 12 years of mortality registries across MENA. Outputs include excess mortality estimates, ICU pressure projections, and demographic-specific risk scores.",
        drivers: [
            { label: "Daily Temperature Deviation from Mean", weight: 30 },
            { label: "Age-65+ Population Density", weight: 24 },
            { label: "Cardiorespiratory Comorbidity Prevalence", weight: 18 },
            { label: "Humidity Stress Index", weight: 14 },
            { label: "Air Pollution Co-exposure (PM2.5)", weight: 10 },
            { label: "Healthcare Access Index", weight: 4 },
        ],
        outputs: [
            "Excess mortality probability per 1,000 residents (weekly)",
            "ICU bed demand surge probability",
            "Age-stratified cardiovascular stress scores",
            "Comparison against seasonal historical baseline",
        ],
        institutionStory: {
            institution: "Jordanian Royal Medical Services",
            region: "Amman & Zarqa Governorates",
            outcome:
                "Used Sehetna's cardiovascular forecasts to pre-position cardiac emergency resources during the 2025 January cold snap. ICU capacity was expanded 48 hours in advance, and cardiac mortality excess was 11% below the modelled counterfactual.",
        },
        chartData: [
            { month: "Jan", risk: 75, observed: 72 },
            { month: "Feb", risk: 68, observed: 65 },
            { month: "Mar", risk: 55, observed: 58 },
            { month: "Apr", risk: 40, observed: 38 },
            { month: "May", risk: 30, observed: 32 },
            { month: "Jun", risk: 28, observed: 25 },
            { month: "Jul", risk: 45, observed: 42 },
            { month: "Aug", risk: 52, observed: 50 },
            { month: "Sep", risk: 38, observed: 35 },
            { month: "Oct", risk: 42, observed: 44 },
            { month: "Nov", risk: 60, observed: 62 },
            { month: "Dec", risk: 72, observed: 70 },
        ],
        pipeline: [
            "Ingest ERA5 daily temperature + humidity fields",
            "Apply DLNM distributed lag framework per region",
            "Overlay age structure and comorbidity prevalence",
            "Run Random Forest + LSTM meta-ensemble",
            "Compute excess mortality probability vs. baseline",
            "Output ICU demand forecast + demographic breakdown",
        ],
    },
    "vector-borne": {
        fullDesc:
            "Climate change is expanding the geographic and seasonal range of disease vectors. Sehetna's vector-borne module uses temperature, precipitation, and standing water satellite indices to drive entomological models of Aedes aegypti (dengue), Anopheles gambiae (malaria), and Culex pipiens (West Nile) habitat suitability, combined with human mobility and immunological naïvety factors to produce transmission risk forecasts.",
        drivers: [
            { label: "Precipitation Anomaly (30-day)", weight: 26 },
            { label: "Mean Temperature (Degree-Days)", weight: 22 },
            { label: "Standing Water / NDWI Index", weight: 20 },
            { label: "Vector Habitat Suitability Model", weight: 18 },
            { label: "Population Immunological Naïvety", weight: 9 },
            { label: "Human Mobility Index", weight: 5 },
        ],
        outputs: [
            "Weekly transmission intensity index per district",
            "Epidemic threshold exceedance probability (21-day)",
            "Vector breeding site density heatmap",
            "Forecast uncertainty band by species",
        ],
        institutionStory: {
            institution: "Sudan Federal Ministry of Health — Malaria Control Unit",
            region: "Blue Nile & Sennar States",
            outcome:
                "Sehetna's vector forecast guided pre-positioning of indoor residual spraying (IRS) campaigns before seasonal rains in 2025. Malaria case counts were 23% below comparable prior-year totals in targeted districts.",
        },
        chartData: [
            { month: "Jan", risk: 20, observed: 18 },
            { month: "Feb", risk: 18, observed: 20 },
            { month: "Mar", risk: 25, observed: 22 },
            { month: "Apr", risk: 40, observed: 42 },
            { month: "May", risk: 62, observed: 58 },
            { month: "Jun", risk: 78, observed: 75 },
            { month: "Jul", risk: 85, observed: 88 },
            { month: "Aug", risk: 80, observed: 82 },
            { month: "Sep", risk: 65, observed: 60 },
            { month: "Oct", risk: 45, observed: 48 },
            { month: "Nov", risk: 30, observed: 28 },
            { month: "Dec", risk: 22, observed: 20 },
        ],
        pipeline: [
            "Ingest CHIRPS precipitation + MODIS NDWI water index",
            "Compute temperature degree-days for vector development",
            "Run entomological suitability model per vector species",
            "Overlay mobility and immunological susceptibility",
            "Run TFT + ensemble → 21-day transmission forecast",
            "Output epidemic alert map + larviciding priority zones",
        ],
    },
    "water-borne": {
        fullDesc:
            "Flood events and heavy rainfall contaminate drinking water sources and overwhelm sanitation infrastructure, creating acute windows of elevated water-borne disease risk. Sehetna's hydro-health module integrates hydrological flood extent estimates, WASH coverage data, and rainfall-faecal coliform concentration transfer functions to forecast cholera, typhoid, and cryptosporidiosis outbreak probability in the 0–14-day window following precipitation events.",
        drivers: [
            { label: "Extreme Rainfall Event Magnitude", weight: 28 },
            { label: "Flood Inundation Extent (SAR)", weight: 24 },
            { label: "WASH Coverage Index", weight: 20 },
            { label: "Baseline Sanitation Access Rate", weight: 14 },
            { label: "Historical Outbreak Proximity", weight: 8 },
            { label: "Population Displacement Risk", weight: 6 },
        ],
        outputs: [
            "Post-flood cholera outbreak probability (0–14 days)",
            "Contaminated water source risk index per catchment",
            "ORS and antibiotic pre-positioning demand estimate",
            "Priority intervention zone map",
        ],
        institutionStory: {
            institution: "UNICEF WASH Programme — Sudan & South Sudan",
            region: "Greater Khartoum & Upper Nile",
            outcome:
                "Sehetna alerts triggered pre-positioning of water purification tablets and ORS supplies 72 hours before a September 2024 flooding event. Diarrhoeal disease cases in targeted camps were 31% below expected levels based on historical flood-disease relationships.",
        },
        chartData: [
            { month: "Jan", risk: 18, observed: 16 },
            { month: "Feb", risk: 14, observed: 12 },
            { month: "Mar", risk: 22, observed: 20 },
            { month: "Apr", risk: 38, observed: 40 },
            { month: "May", risk: 55, observed: 52 },
            { month: "Jun", risk: 68, observed: 65 },
            { month: "Jul", risk: 80, observed: 82 },
            { month: "Aug", risk: 85, observed: 80 },
            { month: "Sep", risk: 72, observed: 70 },
            { month: "Oct", risk: 48, observed: 50 },
            { month: "Nov", risk: 28, observed: 26 },
            { month: "Dec", risk: 20, observed: 18 },
        ],
        pipeline: [
            "Ingest CHIRPS rainfall + Sentinel-1 SAR flood extent",
            "Apply rainfall–contamination transfer function per watershed",
            "Overlay WASH coverage and sanitation access scores",
            "Run XGBoost ensemble → 14-day outbreak probability",
            "Flag high-risk catchments for humanitarian pre-positioning",
            "Export GIS layers for field coordination teams",
        ],
    },
}

/* ── Custom Tooltip ─────────────────────────── */
function CustomTooltip({ active, payload, label, color }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-2xl border border-[#e8e8e8] bg-white/90 px-4 py-3 text-xs shadow-lg backdrop-blur-xl">
            <p className="mb-1.5 font-semibold text-[#222]">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center gap-2">
                    <div
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{
                            backgroundColor: p.dataKey === "risk" ? color : "#a4a4a4",
                            opacity: p.dataKey === "observed" ? 0.7 : 1,
                        }}
                    />
                    <span className="text-[#606060]">
                        {p.dataKey === "risk" ? "Predicted Risk" : "Observed Risk"}:
                    </span>
                    <span className="font-bold text-[#222]">{p.value}</span>
                </div>
            ))}
        </div>
    )
}

/* ── Driver Bar ─────────────────────────────── */
function DriverBar({
    driver,
    color,
    index,
}: {
    driver: { label: string; weight: number }
    color: string
    index: number
}) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-20px" })
    return (
        <div ref={ref} className="flex items-center gap-3">
            <span className="w-44 flex-shrink-0 truncate text-right text-xs text-[#606060]">
                {driver.label}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#f0ece8]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${driver.weight * 3}%` } : { width: 0 }}
                    transition={{ duration: 0.9, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color, maxWidth: "95%" }}
                />
            </div>
            <span className="w-8 flex-shrink-0 text-xs font-bold" style={{ color }}>
                {driver.weight}%
            </span>
        </div>
    )
}

export default function UseCaseDetail() {
    const { caseSlug } = useParams<{ caseSlug: string }>()
    const uc = useCaseList.find((u) => u.slug === caseSlug)
    const ext = caseSlug ? extendedData[caseSlug] : null

    if (!uc || !ext) {
        return (
            <main className="min-h-screen bg-[#faf9f7] pt-40 pb-24">
                <div className="mx-auto max-w-3xl px-6 text-center">
                    <h1
                        className="mb-4 text-4xl text-[#222]"
                        style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                    >
                        Use case not found
                    </h1>
                    <Link
                        to="/use-cases"
                        className="flex items-center justify-center gap-1.5 text-sm text-[#ff5c02] hover:underline"
                    >
                        <ArrowLeft size={14} /> Back to Use Cases
                    </Link>
                </div>
            </main>
        )
    }

    const Icon = uc.icon
    const currentIdx = useCaseList.findIndex((u) => u.slug === caseSlug)
    const nextUc = useCaseList[(currentIdx + 1) % useCaseList.length]

    return (
        <main className="bg-[#faf9f7]">
            {/* Hero */}
            <section className="relative overflow-hidden pt-32 pb-0">
                <div className="relative h-[480px] overflow-hidden">
                    <img src={uc.heroImage} alt={uc.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f7] via-black/30 to-black/50" />
                    <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 lg:px-0">
                        <div className="mx-auto w-full max-w-7xl lg:px-8">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                {/* Breadcrumb */}
                                <div className="mb-4 flex items-center gap-2 text-xs text-white/60">
                                    <Link
                                        to="/use-cases"
                                        className="flex items-center gap-1 transition-colors hover:text-white"
                                    >
                                        <ArrowLeft size={12} />
                                        Use Cases
                                    </Link>
                                    <ChevronRight size={12} />
                                    <span className="text-white/80">{uc.title}</span>
                                </div>

                                <div className="mb-3 flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm"
                                        style={{
                                            backgroundColor: `${uc.color}30`,
                                            border: `1px solid ${uc.color}40`,
                                        }}
                                    >
                                        <Icon
                                            size={22}
                                            style={{ color: "white", strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <span
                                        className="rounded-full px-3 py-1.5 text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
                                        style={{
                                            backgroundColor: `${uc.color}25`,
                                            color: "white",
                                            border: `1px solid ${uc.color}30`,
                                        }}
                                    >
                                        {uc.label}
                                    </span>
                                </div>

                                <h1
                                    className="mb-2 text-4xl leading-[1.08] text-white lg:text-6xl"
                                    style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                                >
                                    {uc.title}
                                </h1>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="relative py-16 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* LEFT: main content */}
                        <div className="flex flex-col gap-8 lg:col-span-2">
                            {/* Overview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <div className="mb-4 flex items-center gap-2.5">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: uc.bg }}
                                    >
                                        <BarChart3
                                            size={15}
                                            style={{ color: uc.color, strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <h2
                                        className="text-base text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Module Overview
                                    </h2>
                                </div>
                                <p className="text-sm leading-relaxed text-[#606060]">
                                    {ext.fullDesc}
                                </p>
                            </motion.div>

                            {/* Risk Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h2
                                            className="text-base text-[#222]"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            Annual Risk Profile
                                        </h2>
                                        <p className="mt-0.5 text-xs text-[#8e8e8e]">
                                            Predicted vs. observed risk index (2024 validation run)
                                        </p>
                                    </div>
                                    <div className="text-2xs flex items-center gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="h-px w-3 rounded"
                                                style={{ backgroundColor: uc.color }}
                                            />
                                            <span className="text-[#606060]">Predicted</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="h-px w-3 rounded bg-[#a4a4a4]"
                                                style={{ borderTop: "2px dashed #a4a4a4" }}
                                            />
                                            <span className="text-[#606060]">Observed</span>
                                        </div>
                                    </div>
                                </div>
                                <ResponsiveContainer width="100%" height={220}>
                                    <AreaChart data={ext.chartData}>
                                        <defs>
                                            <linearGradient
                                                id={`grad-${uc.slug}`}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor={uc.color}
                                                    stopOpacity={0.18}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={uc.color}
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#f0ece8"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 10, fill: "#a4a4a4" }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: "#a4a4a4" }}
                                            axisLine={false}
                                            tickLine={false}
                                            domain={[0, 100]}
                                            width={30}
                                        />
                                        <Tooltip content={<CustomTooltip color={uc.color} />} />
                                        <Area
                                            type="monotone"
                                            dataKey="risk"
                                            stroke={uc.color}
                                            strokeWidth={2.5}
                                            fill={`url(#grad-${uc.slug})`}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="observed"
                                            stroke="#a4a4a4"
                                            strokeWidth={1.5}
                                            strokeDasharray="4 3"
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </motion.div>

                            {/* Feature Importance */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-7 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <div className="mb-6 flex items-center gap-2.5">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: uc.bg }}
                                    >
                                        <TrendingUp
                                            size={15}
                                            style={{ color: uc.color, strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <div>
                                        <h2
                                            className="text-base text-[#222]"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            Key Predictive Drivers
                                        </h2>
                                        <p className="text-xs text-[#8e8e8e]">
                                            SHAP feature importance (mean absolute contribution)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3.5">
                                    {ext.drivers.map((d, i) => (
                                        <DriverBar
                                            key={d.label}
                                            driver={d}
                                            color={uc.color}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Case Study */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="rounded-3xl p-7 shadow-md"
                                style={{
                                    background: `linear-gradient(135deg, ${uc.color}08, ${uc.color}04)`,
                                    border: `1px solid ${uc.color}20`,
                                }}
                            >
                                <div className="mb-5 flex items-center gap-2.5">
                                    <div
                                        className="flex h-8 w-8 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: uc.bg }}
                                    >
                                        <BellRing
                                            size={15}
                                            style={{ color: uc.color, strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <h2
                                        className="text-base text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Institutional Case Study
                                    </h2>
                                </div>
                                <div className="mb-4 flex items-start gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-[#222]">
                                            {ext.institutionStory.institution}
                                        </p>
                                        <p className="text-xs text-[#8e8e8e]">
                                            {ext.institutionStory.region}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed text-[#606060]">
                                    {ext.institutionStory.outcome}
                                </p>
                            </motion.div>
                        </div>

                        {/* RIGHT: sidebar */}
                        <div className="flex flex-col gap-6">
                            {/* Metrics */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.05 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <h3
                                    className="mb-4 text-sm text-[#222]"
                                    style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                                >
                                    Model Metrics
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {uc.metrics.map((m) => (
                                        <div
                                            key={m.label}
                                            className="flex items-center justify-between border-b border-[#f0ece8] py-2.5 last:border-0"
                                        >
                                            <span className="text-xs text-[#606060]">
                                                {m.label}
                                            </span>
                                            <span
                                                className="text-sm font-bold"
                                                style={{
                                                    fontFamily: "var(--font-heading)",
                                                    color: uc.color,
                                                }}
                                            >
                                                {m.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Outputs */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <div className="mb-4 flex items-center gap-2.5">
                                    <Database
                                        size={14}
                                        style={{ color: uc.color, strokeWidth: 1.5 }}
                                    />
                                    <h3
                                        className="text-sm text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Model Outputs
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-2.5">
                                    {ext.outputs.map((o) => (
                                        <div key={o} className="flex items-start gap-2.5">
                                            <CheckCircle2
                                                size={13}
                                                style={{ color: uc.color, strokeWidth: 1.5 }}
                                                className="mt-0.5 flex-shrink-0"
                                            />
                                            <span className="text-xs leading-relaxed text-[#606060]">
                                                {o}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Pipeline steps */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.15 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <div className="mb-4 flex items-center gap-2.5">
                                    <Brain
                                        size={14}
                                        style={{ color: uc.color, strokeWidth: 1.5 }}
                                    />
                                    <h3
                                        className="text-sm text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Module Pipeline
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {ext.pipeline.map((step, i) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <div
                                                className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg"
                                                style={{ backgroundColor: `${uc.color}15` }}
                                            >
                                                <span
                                                    className="text-2xs font-bold"
                                                    style={{ color: uc.color }}
                                                >
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <span className="text-xs leading-relaxed text-[#606060]">
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Target users */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-md shadow-black/5 backdrop-blur-xl"
                            >
                                <div className="mb-4 flex items-center gap-2.5">
                                    <Layers
                                        size={14}
                                        style={{ color: uc.color, strokeWidth: 1.5 }}
                                    />
                                    <h3
                                        className="text-sm text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        Target Institutions
                                    </h3>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {uc.users.map((u) => (
                                        <div key={u} className="flex items-center gap-2">
                                            <div
                                                className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                style={{ backgroundColor: uc.color }}
                                            />
                                            <span className="text-xs font-medium text-[#4a4a4a]">
                                                {u}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Next case */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/80 bg-white/60 p-7 shadow-md shadow-black/5 backdrop-blur-xl sm:flex-row"
                    >
                        <div>
                            <p className="mb-1 text-xs font-medium tracking-wider text-[#a4a4a4] uppercase">
                                Next Use Case
                            </p>
                            <h3
                                className="text-lg text-[#222]"
                                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                            >
                                {nextUc.title}
                            </h3>
                        </div>
                        <Link
                            to={`/use-cases/${nextUc.slug}`}
                            className="flex flex-shrink-0 items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background: `linear-gradient(135deg, ${nextUc.color}, ${nextUc.color}cc)`,
                                boxShadow: `0 8px 24px ${nextUc.color}25`,
                            }}
                        >
                            Explore Case
                            <ArrowRight size={15} strokeWidth={1.5} />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}

import { Flame, Wind, Heart, Bug, Droplets, FlaskConical, MapPin } from "lucide-react"

export const useCaseList = [
    {
        slug: "heatstroke",
        icon: Flame,
        color: "#ff5c02",
        bg: "#ff5c0212",
        label: "Thermal Risk",
        title: "Heatstroke & Thermal Stress",
        shortDesc:
            "Predict dangerous heat exposure events using land surface temperature, humidity, and urban morphology for vulnerable populations.",
        heroImage:
            "https://images.unsplash.com/photo-1719575041993-0af139cf209f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF0d2F2ZSUyMHVyYmFuJTIwY2l0eSUyMGFlcmlhbCUyMHN1bW1lcnxlbnwxfHx8fDE3NzQyMDY1NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        metrics: [
            { label: "Forecast Horizon", value: "14 days" },
            { label: "Spatial Resolution", value: "1 km²" },
            { label: "Model AUC", value: "0.91" },
        ],
        users: ["Municipal Health Depts.", "Urban Planning Agencies", "Emergency Services"],
    },
    {
        slug: "respiratory",
        icon: Wind,
        color: "#8c5aff",
        bg: "#8c5aff12",
        label: "Air Quality Risk",
        title: "Respiratory Illness",
        shortDesc:
            "Forecast acute and chronic respiratory disease incidence by integrating PM2.5, NO2, ozone, and wildfire smoke plume data.",
        heroImage:
            "https://images.unsplash.com/photo-1758187948084-2346aed52a37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXIlMjBxdWFsaXR5JTIwcG9sbHV0aW9uJTIwdXJiYW4lMjBzbW9nfGVufDF8fHx8MTc3NDIwNjU1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
        metrics: [
            { label: "Forecast Horizon", value: "10 days" },
            { label: "Pollutants Tracked", value: "6" },
            { label: "Model AUC", value: "0.93" },
        ],
        users: ["Ministries of Environment", "Hospital Systems", "Research Institutions"],
    },
    {
        slug: "cardiovascular",
        icon: Heart,
        color: "#d00416",
        bg: "#d0041612",
        label: "Cardiac Risk",
        title: "Cardiovascular Mortality",
        shortDesc:
            "Model temperature-mortality relationships and identify climate-driven cardiovascular stress periods across demographic subgroups.",
        heroImage:
            "https://images.unsplash.com/photo-1646441453885-86f3cbc260b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkaW92YXNjdWxhciUyMGhlYXJ0JTIwaGVhbHRoJTIwbWVkaWNhbCUyMHJlc2VhcmNofGVufDF8fHx8MTc3NDIwNjU1NXww&ixlib=rb-4.1.0&q=80&w=1080",
        metrics: [
            { label: "Forecast Horizon", value: "7 days" },
            { label: "Age Cohorts", value: "8" },
            { label: "Model AUC", value: "0.89" },
        ],
        users: ["Cardiology Networks", "Public Health Ministries", "Insurance Actuaries"],
    },
    {
        slug: "vector-borne",
        icon: Bug,
        color: "#6b8e7a",
        bg: "#6b8e7a12",
        label: "Vector Risk",
        title: "Vector-Borne Diseases",
        shortDesc:
            "Forecast dengue, malaria, and West Nile virus risk using precipitation, temperature, standing water indices, and vector ecology models.",
        heroImage:
            "https://images.unsplash.com/photo-1758301022356-64cafc926ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMG1vc3F1aXRvJTIwdmVjdG9yJTIwYm9ybmUlMjBkaXNlYXNlJTIwcHJldmVudGlvbnxlbnwxfHx8fDE3NzQyMDY1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        metrics: [
            { label: "Forecast Horizon", value: "21 days" },
            { label: "Diseases Modelled", value: "5" },
            { label: "Model AUC", value: "0.92" },
        ],
        users: ["WHO Regional Offices", "Vector Control Agencies", "NGO Health Programs"],
    },
    {
        slug: "water-borne",
        icon: Droplets,
        color: "#3b82f6",
        bg: "#3b82f612",
        label: "Hydro Risk",
        title: "Water-Borne Diseases",
        shortDesc:
            "Predict cholera, typhoid, and cryptosporidiosis risk by modelling rainfall events, flood extents, and drinking water quality degradation.",
        heroImage:
            "https://images.unsplash.com/photo-1666413767635-78c79a06b4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGNvbnRhbWluYXRpb24lMjBmbG9vZCUyMHdhdGVyYm9ybmUlMjBkaXNlYXNlfGVufDF8fHx8MTc3NDIwNjU1Nnww&ixlib=rb-4.1.0&q=80&w=1080",
        metrics: [
            { label: "Forecast Horizon", value: "14 days" },
            { label: "Pathogens Tracked", value: "7" },
            { label: "Model AUC", value: "0.90" },
        ],
        users: ["WASH Programmes", "Disaster Response Units", "Municipal Water Authorities"],
    },
]

const institutionTypes = [
    {
        icon: Building2,
        label: "National Ministries",
        desc: "Health, environment, and infrastructure agencies.",
    },
    {
        icon: FlaskConical,
        label: "Research Institutions",
        desc: "Universities and think tanks producing evidence for policy.",
    },
    {
        icon: MapPin,
        label: "Municipal Authorities",
        desc: "City planners and local health departments.",
    },
    {
        icon: TrendingUp,
        label: "NGO & International Bodies",
        desc: "WHO, UN agencies, and health-focused NGOs.",
    },
]

function UseCaseCard({ uc, index }: { uc: (typeof useCaseList)[0]; index: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-40px" })
    const Icon = uc.icon

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1 }}
        >
            <Link
                to={`/use-cases/${uc.slug}`}
                className="group block overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-400 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/8"
            >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={uc.heroImage}
                        alt={uc.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Label pill */}
                    <div className="absolute top-4 left-4">
                        <span
                            className="text-2xs rounded-full px-3 py-1.5 font-bold tracking-widest uppercase backdrop-blur-sm"
                            style={{
                                backgroundColor: `${uc.color}25`,
                                color: "white",
                                border: `1px solid ${uc.color}40`,
                            }}
                        >
                            {uc.label}
                        </span>
                    </div>

                    {/* Icon */}
                    <div className="absolute right-4 bottom-4">
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-sm"
                            style={{
                                backgroundColor: `${uc.color}25`,
                                border: `1px solid ${uc.color}30`,
                            }}
                        >
                            <Icon size={18} style={{ color: "white", strokeWidth: 1.5 }} />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <h3
                        className="mb-2 text-lg text-[#222]"
                        style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                    >
                        {uc.title}
                    </h3>
                    <p className="mb-4 text-xs leading-relaxed text-[#606060]">{uc.shortDesc}</p>

                    {/* Metrics */}
                    <div className="mb-4 grid grid-cols-3 gap-2 border-t border-b border-[#f0ece8] py-3">
                        {uc.metrics.map((m) => (
                            <div key={m.label} className="text-center">
                                <div
                                    className="text-sm font-bold"
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        color: uc.color,
                                    }}
                                >
                                    {m.value}
                                </div>
                                <div className="text-2xs mt-0.5 text-[#a4a4a4]">{m.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Arrow CTA */}
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-[#8e8e8e]">{uc.users[0]}</span>
                        <div
                            className="flex items-center gap-1.5 text-xs font-semibold transition-all group-hover:gap-2.5"
                            style={{ color: uc.color }}
                        >
                            Explore
                            <ArrowRight
                                size={13}
                                strokeWidth={2}
                                className="transition-transform group-hover:translate-x-0.5"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export function UseCases() {
    return (
        <main className="bg-[#faf9f7]">
            {/* Hero */}
            <section
                className="relative overflow-hidden pt-40 pb-24"
                style={{
                    background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 50%, #f0f4f1 100%)",
                }}
            >
                <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[600px] rounded-full bg-gradient-to-bl from-[#ff5c02]/8 to-transparent blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #222 1px, transparent 0)",
                        backgroundSize: "40px 40px",
                    }}
                />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl">
                                <TrendingUp size={13} className="text-[#ff5c02]" strokeWidth={2} />
                                <span className="text-xs font-semibold text-[#606060]">
                                    Real-World Applications
                                </span>
                            </div>
                            <h1
                                className="mb-6 text-5xl leading-[1.05] text-[#222222] lg:text-7xl"
                                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                            >
                                Where Sehetna Makes a Difference
                            </h1>
                            <p className="mb-10 max-w-2xl text-base leading-relaxed text-[#606060] lg:text-lg">
                                Five disease-environment risk models, each designed around a
                                specific institutional challenge and calibrated against historical
                                health outcomes.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { val: "5", label: "Risk Models" },
                                    { val: "12+", label: "Institutions Served" },
                                    { val: "6", label: "Countries" },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className="rounded-2xl border border-[#e8e8e8] bg-white/70 px-5 py-3 text-center backdrop-blur-xl"
                                    >
                                        <div
                                            className="text-2xl text-[#222]"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {s.val}
                                        </div>
                                        <div className="mt-0.5 text-xs text-[#8e8e8e]">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Use Case Cards */}
            <section className="relative py-16 pb-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {useCaseList.map((uc, i) => (
                            <UseCaseCard key={uc.slug} uc={uc} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Who is it for */}
            <section
                className="relative overflow-hidden py-24 lg:py-32"
                style={{ background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 100%)" }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-14 text-center">
                        <div className="mb-5 flex items-center justify-center gap-2">
                            <div className="h-px w-8 bg-[#6b8e7a]" />
                            <span className="text-xs font-semibold tracking-widest text-[#6b8e7a] uppercase">
                                Institutional Users
                            </span>
                            <div className="h-px w-8 bg-[#6b8e7a]" />
                        </div>
                        <h2
                            className="text-4xl text-[#222] lg:text-5xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            Built for Decision-Makers
                        </h2>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {institutionTypes.map((item, i) => {
                            const Icon = item.icon
                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="rounded-3xl border border-white/80 bg-white/60 p-6 text-center shadow-sm backdrop-blur-xl"
                                >
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6b8e7a]/12">
                                        <Icon
                                            size={20}
                                            style={{ color: "#6b8e7a", strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <h3
                                        className="mb-1.5 text-sm text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {item.label}
                                    </h3>
                                    <p className="text-xs text-[#606060]">{item.desc}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </main>
    )
}
