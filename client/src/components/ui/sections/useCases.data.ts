export type UseCasesKey =
    | "heatstroke"
    | "respiratory"
    | "cardiovascular"
    | "vector-borne"
    | "water-borne"
    | "health-monitoring"
    | "health-preparedness"
    | "policy-planning"
    | "research-insights"

export type UseCase = {
    accent: string
    accentSoft: string
    label: string
    title: string
    description: string
    heroImage: string
    metrics: { label: string; value: string }[]
    users: string[]
}

type UseCases = Record<string, UseCase>

export const useCases: UseCases = {
    heatstroke: {
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
    respiratory: {
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
    cardiovascular: {
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
    "vector-borne": {
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
    "water-borne": {
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
    "health-monitoring": {
        accent: "var(--color-success-300)",
        accentSoft: "bg-success-100/20 text-success",
        label: "Disease tracking",
        title: "Health Monitoring",
        description:
            "Real-time surveillance and tracking of disease patterns, health indicators, and population wellness metrics.",
        heroImage:
            "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
        metrics: [
            { label: "Update frequency", value: "Daily" },
            { label: "Indicators tracked", value: "50+" },
            { label: "Accuracy", value: "96%" },
        ],
        users: ["Ministry of Health", "Disease surveillance units", "Public health agencies"],
    },
    "health-preparedness": {
        accent: "var(--color-danger-200)",
        accentSoft: "bg-danger-100/10 text-danger-200",
        label: "Emergency readiness",
        title: "Health Preparedness",
        description:
            "Strategic planning and resource allocation for epidemic preparedness and emergency response capacity.",
        heroImage:
            "https://images.unsplash.com/photo-1584515933487-779824d29309?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
        metrics: [
            { label: "Response time", value: "< 24hrs" },
            { label: "Coverage", value: "100%" },
            { label: "Readiness score", value: "94%" },
        ],
        users: ["Emergency management", "Hospital networks", "Public health authorities"],
    },
    "policy-planning": {
        accent: "var(--color-primary)",
        accentSoft: "bg-primary-100/30 text-primary",
        label: "Strategy & planning",
        title: "Policy Planning",
        description:
            "Evidence-based policy recommendations and long-term health system strengthening strategies.",
        heroImage:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
        metrics: [
            { label: "Stakeholders", value: "12+" },
            { label: "Evidence base", value: "Multi-modal" },
            { label: "Impact", value: "High" },
        ],
        users: ["Policy makers", "Ministries", "Government agencies"],
    },
    "research-insights": {
        accent: "var(--color-secondary-300)",
        accentSoft: "bg-secondary-100/40 text-secondary-300",
        label: "Scientific research",
        title: "Research Insights",
        description:
            "Advanced analytics and scientific insights supporting research institutions and evidence generation.",
        heroImage:
            "https://images.unsplash.com/photo-1532094349884-543bc11b234d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
        metrics: [
            { label: "Publications", value: "25+" },
            { label: "Datasets", value: "15+" },
            { label: "Research areas", value: "8" },
        ],
        users: ["Universities", "Research labs", "Academic institutions"],
    },
}

type ExtendedUseCase = {
    overview: string
    drivers: { label: string; weight: number }[]
    outputs: string[]
    institutionStory: { institution: string; region: string; outcome: string }
    chartData: { month: string; risk: number; observed: number }[]
    pipeline: string[]
}

type ExtendedUseCases = Record<string, ExtendedUseCase>

export const extendedUseCases: ExtendedUseCases = {
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
    "health-monitoring": {
        overview:
            "Comprehensive real-time surveillance system that integrates multiple data sources to provide continuous health monitoring and early detection of disease patterns and health crises.",
        drivers: [
            { label: "Syndromic surveillance data", weight: 28 },
            { label: "Laboratory confirmations", weight: 24 },
            { label: "Hospital admission rates", weight: 22 },
            { label: "Population density factors", weight: 16 },
        ],
        outputs: [
            "Daily disease incidence dashboard",
            "Emerging outbreak alerts",
            "Geographic risk hotspots",
            "Trend analysis reports",
        ],
        institutionStory: {
            institution: "Ministry of Health - Disease Surveillance Division",
            region: "National Level, Multi-region Coverage",
            outcome:
                "Real-time monitoring enabled rapid detection of 3 potential outbreaks, reducing response time by 60% and preventing estimated 2,000+ cases.",
        },
        chartData: [
            { month: "Jan", risk: 15, observed: 14 },
            { month: "Feb", risk: 18, observed: 17 },
            { month: "Mar", risk: 22, observed: 21 },
            { month: "Apr", risk: 28, observed: 29 },
            { month: "May", risk: 35, observed: 36 },
            { month: "Jun", risk: 32, observed: 31 },
        ],
        pipeline: [
            "Integrate syndromic surveillance feeds",
            "Aggregate laboratory test results",
            "Correlate hospital admission data",
            "Generate real-time dashboards",
        ],
    },
    "health-preparedness": {
        overview:
            "Strategic capacity building and resource optimization framework designed to enhance health system readiness for epidemic response and emergency situations.",
        drivers: [
            { label: "Healthcare facility capacity", weight: 26 },
            { label: "Supply chain readiness", weight: 24 },
            { label: "Healthcare worker availability", weight: 24 },
            { label: "Infrastructure resilience", weight: 16 },
        ],
        outputs: [
            "Readiness assessment scores",
            "Resource gap analysis",
            "Capacity forecasts",
            "Priority intervention lists",
        ],
        institutionStory: {
            institution: "Regional Hospital Network & Emergency Services",
            region: "3 Governorates, 45 Health Facilities",
            outcome:
                "Preparedness planning improved response capacity by 85% and reduced equipment shortages by 72% during surge events.",
        },
        chartData: [
            { month: "Jan", risk: 65, observed: 68 },
            { month: "Feb", risk: 70, observed: 72 },
            { month: "Mar", risk: 75, observed: 78 },
            { month: "Apr", risk: 82, observed: 85 },
            { month: "May", risk: 88, observed: 90 },
            { month: "Jun", risk: 92, observed: 94 },
        ],
        pipeline: [
            "Assess health facility capacity",
            "Evaluate supply chain status",
            "Analyze workforce distribution",
            "Generate readiness scores",
        ],
    },
    "policy-planning": {
        overview:
            "Data-driven policy development framework that synthesizes evidence from multiple sources to inform health system strengthening, resource allocation, and strategic health policy.",
        drivers: [
            { label: "Disease burden analysis", weight: 26 },
            { label: "Cost-effectiveness studies", weight: 22 },
            { label: "Implementation evidence", weight: 24 },
            { label: "Stakeholder input", weight: 18 },
        ],
        outputs: [
            "Policy briefing documents",
            "Strategic plans",
            "Budget allocation guides",
            "Implementation roadmaps",
        ],
        institutionStory: {
            institution: "National Health Policy Division",
            region: "Government of Egypt - Multi-sector",
            outcome:
                "Evidence-based policies improved health service efficiency by 45% and increased budget allocation to high-impact interventions.",
        },
        chartData: [
            { month: "Jan", risk: 35, observed: 38 },
            { month: "Feb", risk: 42, observed: 44 },
            { month: "Mar", risk: 48, observed: 50 },
            { month: "Apr", risk: 56, observed: 58 },
            { month: "May", risk: 64, observed: 65 },
            { month: "Jun", risk: 72, observed: 74 },
        ],
        pipeline: [
            "Collect evidence from multiple sources",
            "Conduct stakeholder consultations",
            "Analyze policy options",
            "Generate recommendations",
        ],
    },
    "research-insights": {
        overview:
            "Advanced research platform providing scientists, universities, and research institutions with integrated datasets, analytical tools, and evidence synthesis for health research.",
        drivers: [
            { label: "Multi-modal datasets", weight: 28 },
            { label: "Advanced analytics", weight: 24 },
            { label: "Publication impact", weight: 22 },
            { label: "Research collaboration", weight: 16 },
        ],
        outputs: [
            "Research datasets",
            "Analysis notebooks",
            "Publication support",
            "Collaboration network",
        ],
        institutionStory: {
            institution: "Universities & Research Institutes Network",
            region: "Multi-country, 8 Research Institutions",
            outcome:
                "Research platform enabled 25+ peer-reviewed publications and supported 18 doctoral research projects on climate-health relationships.",
        },
        chartData: [
            { month: "Jan", risk: 8, observed: 6 },
            { month: "Feb", risk: 12, observed: 10 },
            { month: "Mar", risk: 16, observed: 14 },
            { month: "Apr", risk: 22, observed: 20 },
            { month: "May", risk: 28, observed: 26 },
            { month: "Jun", risk: 34, observed: 32 },
        ],
        pipeline: [
            "Prepare integrated research datasets",
            "Develop analytical notebooks",
            "Support research projects",
            "Facilitate collaboration",
        ],
    },
}
