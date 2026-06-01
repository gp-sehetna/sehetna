import { HEALTH_OUTCOMES_KEYS } from "@/shared/config/health-outcomes"
import type {
    ScenarioObservation,
    ScenarioObservationQueryParams,
    ScenarioObservationSortBy,
} from "@/features/scenarios/scenario.types"

const locations = [
    "Cairo, Egypt",
    "Alexandria, Egypt",
    "Giza, Egypt",
    "Aswan, Egypt",
    "Luxor, Egypt",
    "Port Said, Egypt",
    "Mansoura, Egypt",
    "Suez, Egypt",
]

const floodIndicators = ["low", "moderate", "high"] as const

let MOCK_SCENARIO_OBSERVATIONS: ScenarioObservation[] = Array.from({ length: 84 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 5, 1))
    date.setUTCDate(date.getUTCDate() - index * 7)

    const locationName = locations[index % locations.length]
    const base = index + 1

    return {
        id: `scenario-observation-${base}`,
        baseDate: date.toISOString(),
        locationName,
        climate: {
            temperatureCelsius: index % 13 === 0 ? null : 24 + ((base * 1.7) % 18),
            precipitationMm: index % 17 === 0 ? null : 6 + ((base * 9.1) % 180),
            heatWaveDays: index % 19 === 0 ? null : base % 21,
            floodIndicator: floodIndicators[index % floodIndicators.length],
        },
        airQuality: {
            pm25Ugm3: index % 11 === 0 ? null : 8 + ((base * 4.4) % 82),
            aqi: index % 23 === 0 ? null : 28 + ((base * 13) % 220),
        },
        socioeconomic: {
            healthcareAccessIndex: index % 29 === 0 ? null : 42 + ((base * 2.8) % 58),
            foodSecurityIndex: index % 31 === 0 ? null : 38 + ((base * 3.2) % 61),
            gdpPerCapitaUsd: index % 37 === 0 ? null : 3200 + ((base * 625) % 18000),
        },
        healthOutcomes: {
            respiratory_disease_rate: 10 + ((base * 1.9) % 38),
            cardio_mortality_rate: 4 + ((base * 1.2) % 25),
            vector_disease_risk_score: 18 + ((base * 2.4) % 75),
            waterborne_disease_incidents: 2 + ((base * 3) % 45),
            heat_related_admissions: 1 + ((base * 2.1) % 32),
        },
        note: index % 5 === 0 ? "Review with field team" : null,
    }
})

const sortValue = (row: ScenarioObservation, sortBy: ScenarioObservationSortBy) => {
    const values = {
        baseDate: row.baseDate,
        locationName: row.locationName,
        temperatureCelsius: row.climate.temperatureCelsius,
        precipitationMm: row.climate.precipitationMm,
        heatWaveDays: row.climate.heatWaveDays,
        floodIndicator: row.climate.floodIndicator,
        pm25Ugm3: row.airQuality.pm25Ugm3,
        aqi: row.airQuality.aqi,
        healthcareAccessIndex: row.socioeconomic.healthcareAccessIndex,
        foodSecurityIndex: row.socioeconomic.foodSecurityIndex,
        gdpPerCapitaUsd: row.socioeconomic.gdpPerCapitaUsd,
    } satisfies Record<ScenarioObservationSortBy, string | number | null>

    return values[sortBy]
}

const getMockScenarioObservations = (params: ScenarioObservationQueryParams) => {
    const filtered = MOCK_SCENARIO_OBSERVATIONS.filter((row) => {
        const filters = params.filters
        if (!filters) return true

        const baseDate = new Date(row.baseDate)
        const from = filters.dateRange?.from ? new Date(filters.dateRange.from) : null
        const to = filters.dateRange?.to ? new Date(filters.dateRange.to) : null
        const matchesFrom = !from || baseDate >= from
        const matchesTo = !to || baseDate <= to
        const matchesLocation =
            !filters.location ||
            row.locationName.toLowerCase().includes(filters.location.toLowerCase())
        const matchesAqi = !filters.aqiThreshold || (row.airQuality.aqi ?? 0) >= filters.aqiThreshold

        return matchesFrom && matchesTo && matchesLocation && matchesAqi
    })

    const sorted = [...filtered].sort((a, b) => {
        const aValue = sortValue(a, params.sortBy)
        const bValue = sortValue(b, params.sortBy)

        if (aValue == null && bValue == null) return 0
        if (aValue == null) return 1
        if (bValue == null) return -1
        if (aValue > bValue) return params.sortDirection === "asc" ? 1 : -1
        if (aValue < bValue) return params.sortDirection === "asc" ? -1 : 1
        return 0
    })

    const page = Math.max(params.page, 1)
    const limit = Math.max(params.pageSize, 1)
    const total = sorted.length
    const totalPages = Math.max(Math.ceil(total / limit), 1)
    const start = (page - 1) * limit
    const data = sorted.slice(start, start + limit)

    return {
        data,
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    }
}

const deleteMockScenarioObservation = (id: string) => {
    const previousLength = MOCK_SCENARIO_OBSERVATIONS.length

    MOCK_SCENARIO_OBSERVATIONS = MOCK_SCENARIO_OBSERVATIONS.filter((row) => row.id !== id)

    return MOCK_SCENARIO_OBSERVATIONS.length < previousLength
}

const saveMockScenarioObservationNote = (id: string, note: string) => {
    const observation = MOCK_SCENARIO_OBSERVATIONS.find((row) => row.id === id)

    if (!observation) return false

    observation.note = note
    return true
}

const mockScenarioObservationToCsvRows = (rows: ScenarioObservation[]) => [
    [
        "Base Date",
        "Location",
        "Temperature Celsius",
        "Precipitation Mm",
        "Heat Wave Days",
        "Flood Indicator",
        "PM2.5",
        "AQI",
        "Healthcare Access Index",
        "Food Security Index",
        "GDP Per Capita USD",
        ...HEALTH_OUTCOMES_KEYS,
        "Notes",
    ],
    ...rows.map((row) => [
        row.baseDate,
        row.locationName,
        row.climate.temperatureCelsius,
        row.climate.precipitationMm,
        row.climate.heatWaveDays,
        row.climate.floodIndicator,
        row.airQuality.pm25Ugm3,
        row.airQuality.aqi,
        row.socioeconomic.healthcareAccessIndex,
        row.socioeconomic.foodSecurityIndex,
        row.socioeconomic.gdpPerCapitaUsd,
        ...HEALTH_OUTCOMES_KEYS.map((key) => row.healthOutcomes[key]),
        row.note,
    ]),
]

export {
    deleteMockScenarioObservation,
    getMockScenarioObservations,
    MOCK_SCENARIO_OBSERVATIONS,
    mockScenarioObservationToCsvRows,
    saveMockScenarioObservationNote,
}
