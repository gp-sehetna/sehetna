import {
    BarChart3,
    Brain,
    Bug,
    Droplets,
    Flame,
    Heart,
    type LucideIcon,
    TrendingUp,
    Wind,
} from "lucide-react"

export type UseCaseCardData = {
    slug: string
    icon: LucideIcon
    accent: string
    accentSoft: string
    label: string
    title: string
    description: string
    heroImage: string
    metrics: { label: string; value: string }[]
    users: string[]
}

export const useCaseList: UseCaseCardData[] = [
    {
        slug: "heatstroke",
        icon: Flame,
        accent: "var(--color-primary)",
        accentSoft: "bg-primary-100/30 text-primary",
        label: "Thermal risk",
        title: "Heatstroke & thermal stress",
        description:
            "Predict dangerous heat exposure using land temperature, humidity, and urban morphology.",
        heroImage:
            "https://images.unsplash.com/photo-1719575041993-0af139cf209f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        metrics: [
            { label: "Forecast horizon", value: "14 days" },
            { label: "Spatial resolution", value: "1 km2" },
            { label: "Model AUC", value: "0.91" },
        ],
        users: ["Municipal health departments", "Urban planning agencies", "Emergency services"],
    },
    {
        slug: "respiratory",
        icon: Wind,
        accent: "var(--color-secondary-300)",
        accentSoft: "bg-secondary-100/40 text-secondary-300",
        label: "Air quality risk",
        title: "Respiratory illness",
        description:
            "Forecast respiratory disease incidence using PM2.5, NO2, ozone, and smoke data.",
        heroImage:
            "https://images.unsplash.com/photo-1758187948084-2346aed52a37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        metrics: [
            { label: "Forecast horizon", value: "10 days" },
            { label: "Pollutants tracked", value: "6" },
            { label: "Model AUC", value: "0.93" },
        ],
        users: ["Environment ministries", "Hospital systems", "Research institutions"],
    },
    {
        slug: "cardiovascular",
        icon: Heart,
        accent: "var(--color-danger-200)",
        accentSoft: "bg-danger-100/10 text-danger-200",
        label: "Cardiac risk",
        title: "Cardiovascular mortality",
        description:
            "Model temperature-mortality relationships and flag climate-driven cardiac stress periods.",
        heroImage:
            "https://images.unsplash.com/photo-1646441453885-86f3cbc260b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        metrics: [
            { label: "Forecast horizon", value: "7 days" },
            { label: "Age cohorts", value: "8" },
            { label: "Model AUC", value: "0.89" },
        ],
        users: ["Cardiology networks", "Public health ministries", "Insurance actuaries"],
    },
    {
        slug: "vector-borne",
        icon: Bug,
        accent: "var(--color-success-300)",
        accentSoft: "bg-success-100/20 text-success",
        label: "Vector risk",
        title: "Vector-borne diseases",
        description:
            "Forecast dengue, malaria, and West Nile risk using weather, water, and ecology signals.",
        heroImage:
            "https://images.unsplash.com/photo-1758301022356-64cafc926ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        metrics: [
            { label: "Forecast horizon", value: "21 days" },
            { label: "Diseases modelled", value: "5" },
            { label: "Model AUC", value: "0.92" },
        ],
        users: ["WHO regional offices", "Vector control agencies", "NGO health programmes"],
    },
    {
        slug: "water-borne",
        icon: Droplets,
        accent: "var(--color-info-200)",
        accentSoft: "bg-info-100 text-info",
        label: "Hydro risk",
        title: "Water-borne diseases",
        description:
            "Predict cholera and related outbreak risk from rainfall, flood extent, and WASH conditions.",
        heroImage:
            "https://images.unsplash.com/photo-1666413767635-78c79a06b4db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        metrics: [
            { label: "Forecast horizon", value: "14 days" },
            { label: "Pathogens tracked", value: "7" },
            { label: "Model AUC", value: "0.90" },
        ],
        users: ["WASH programmes", "Disaster response units", "Municipal water authorities"],
    },
]

export const useCaseExtendedData: Record<
    string,
    {
        overview: string
        drivers: { label: string; weight: number }[]
        outputs: string[]
        institutionStory: { institution: string; region: string; outcome: string }
        chartData: { month: string; risk: number; observed: number }[]
        pipeline: string[]
    }
> = {
    heatstroke: {
        overview:
            "This module combines satellite land temperature, humidity, urban heat island signals, and population vulnerability to forecast thermal stress before health systems are overwhelmed.",
        drivers: [
            { label: "Land surface temperature", weight: 28 },
            { label: "Wet-bulb humidity", weight: 22 },
            { label: "Urban heat island index", weight: 18 },
            { label: "Older population share", weight: 16 },
        ],
        outputs: [
            "District heat stress index",
            "Heat emergency exceedance probability",
            "Affected population estimates",
            "Rolling anomaly map",
        ],
        institutionStory: {
            institution: "Cairo Governorate Health Directorate",
            region: "Greater Cairo, Egypt",
            outcome:
                "Thermal alerts were used to pre-position cooling support and reduce admissions during peak summer events.",
        },
        chartData: [
            { month: "Jan", risk: 12, observed: 10 },
            { month: "Mar", risk: 22, observed: 20 },
            { month: "May", risk: 58, observed: 55 },
            { month: "Jul", risk: 91, observed: 89 },
            { month: "Sep", risk: 65, observed: 62 },
            { month: "Nov", risk: 24, observed: 22 },
        ],
        pipeline: [
            "Ingest thermal and meteorological feeds",
            "Compute heat stress indicators",
            "Overlay demographic vulnerability",
            "Run temporal ensemble forecast",
        ],
    },
    respiratory: {
        overview:
            "The respiratory module fuses pollutant measurements, satellite aerosol signals, and dispersion patterns to anticipate acute respiratory burden.",
        drivers: [
            { label: "PM2.5 concentration", weight: 32 },
            { label: "Ozone peak", weight: 20 },
            { label: "NO2 column density", weight: 18 },
            { label: "Aerosol optical depth", weight: 15 },
        ],
        outputs: [
            "Air quality health index",
            "ED visit surge probability",
            "Age-stratified exposure view",
            "Pollutant source attribution",
        ],
        institutionStory: {
            institution: "Lebanese Ministry of Environment",
            region: "Greater Beirut & Mount Lebanon",
            outcome:
                "Forecasts supported proactive advisories and helped institutions respond ahead of high-risk air-quality episodes.",
        },
        chartData: [
            { month: "Jan", risk: 55, observed: 52 },
            { month: "Mar", risk: 42, observed: 44 },
            { month: "May", risk: 30, observed: 28 },
            { month: "Jul", risk: 20, observed: 18 },
            { month: "Sep", risk: 34, observed: 32 },
            { month: "Nov", risk: 58, observed: 56 },
        ],
        pipeline: [
            "Ingest ground-station and satellite pollutant data",
            "Fuse with transport-model outputs",
            "Apply exposure vulnerability layers",
            "Generate short-range ensemble forecast",
        ],
    },
    cardiovascular: {
        overview:
            "This module models non-linear temperature and humidity stress against cardiovascular outcomes, with special focus on older adults and comorbidity burden.",
        drivers: [
            { label: "Temperature deviation", weight: 30 },
            { label: "Older population density", weight: 24 },
            { label: "Comorbidity prevalence", weight: 18 },
            { label: "Humidity stress", weight: 14 },
        ],
        outputs: [
            "Excess mortality probability",
            "ICU demand surge probability",
            "Age-stratified stress scores",
            "Seasonal baseline comparison",
        ],
        institutionStory: {
            institution: "Jordanian Royal Medical Services",
            region: "Amman & Zarqa Governorates",
            outcome:
                "The forecasts were used to stage cardiac emergency resources ahead of severe cold periods.",
        },
        chartData: [
            { month: "Jan", risk: 75, observed: 72 },
            { month: "Mar", risk: 55, observed: 58 },
            { month: "May", risk: 30, observed: 32 },
            { month: "Jul", risk: 45, observed: 42 },
            { month: "Sep", risk: 38, observed: 35 },
            { month: "Nov", risk: 60, observed: 62 },
        ],
        pipeline: [
            "Ingest temperature and humidity fields",
            "Apply lag-aware mortality modeling",
            "Overlay demographics and access metrics",
            "Forecast excess burden against baseline",
        ],
    },
    "vector-borne": {
        overview:
            "The vector-borne module uses temperature, rainfall, standing water, and ecological suitability to anticipate disease transmission conditions.",
        drivers: [
            { label: "Precipitation anomaly", weight: 26 },
            { label: "Degree-days", weight: 22 },
            { label: "Standing water index", weight: 20 },
            { label: "Habitat suitability", weight: 18 },
        ],
        outputs: [
            "Transmission intensity index",
            "Epidemic threshold probability",
            "Breeding-site heatmap",
            "Species uncertainty range",
        ],
        institutionStory: {
            institution: "Sudan Federal Ministry of Health",
            region: "Blue Nile & Sennar States",
            outcome:
                "Forecasts informed vector-control timing ahead of seasonal rains and improved campaign prioritisation.",
        },
        chartData: [
            { month: "Jan", risk: 20, observed: 18 },
            { month: "Mar", risk: 25, observed: 22 },
            { month: "May", risk: 62, observed: 58 },
            { month: "Jul", risk: 85, observed: 88 },
            { month: "Sep", risk: 65, observed: 60 },
            { month: "Nov", risk: 30, observed: 28 },
        ],
        pipeline: [
            "Ingest rainfall and surface-water indicators",
            "Model ecological suitability",
            "Overlay mobility and susceptibility factors",
            "Forecast transmission intensity",
        ],
    },
    "water-borne": {
        overview:
            "This module links rainfall, flood extent, sanitation access, and outbreak history to estimate post-flood water-borne disease risk.",
        drivers: [
            { label: "Extreme rainfall magnitude", weight: 28 },
            { label: "Flood inundation extent", weight: 24 },
            { label: "WASH coverage", weight: 20 },
            { label: "Sanitation access rate", weight: 14 },
        ],
        outputs: [
            "Outbreak probability window",
            "Contaminated water source index",
            "Pre-positioning demand estimate",
            "Priority intervention map",
        ],
        institutionStory: {
            institution: "UNICEF WASH Programme",
            region: "Sudan & South Sudan",
            outcome:
                "Alerts were used to stage purification supplies and reduce response lag after flooding events.",
        },
        chartData: [
            { month: "Jan", risk: 18, observed: 16 },
            { month: "Mar", risk: 22, observed: 20 },
            { month: "May", risk: 55, observed: 52 },
            { month: "Jul", risk: 80, observed: 82 },
            { month: "Sep", risk: 72, observed: 70 },
            { month: "Nov", risk: 28, observed: 26 },
        ],
        pipeline: [
            "Ingest rainfall and flood-extent signals",
            "Estimate contamination transfer risk",
            "Overlay WASH and sanitation access",
            "Flag high-risk catchments",
        ],
    },
}

export const institutionTypes = [
    {
        icon: TrendingUp,
        title: "National ministries",
        description: "Health, environment, and infrastructure agencies.",
    },
    {
        icon: Brain,
        title: "Research institutions",
        description: "Universities and evidence-producing labs.",
    },
    {
        icon: BarChart3,
        title: "Municipal authorities",
        description: "City health teams and local planners.",
    },
]

export function getUseCase(slug: string) {
    return useCaseList.find((item) => item.slug === slug)
}
