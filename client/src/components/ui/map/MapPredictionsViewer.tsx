"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { Activity, HeartPulse, Thermometer, Droplets, AlertTriangle } from "lucide-react"
import { usePredictionsStore } from "@/stores/map/use-predictions"
import { RadialChart } from "../charts/RadialChart"

export default function PredictionsViewer() {
    const { simulation } = usePredictionsStore()
    const predictions = simulation?.predictions
    useEffect(() => {
        if (predictions && predictions.length > 1) {
            toast.error("Multiple predictions detected. Please refine your simulation input.")
        }
    }, [predictions])

    if (!predictions?.length || predictions.length > 1) return null

    const prediction = predictions[0]

    const chartMetrics = [
        {
            label: "Respiratory",
            value: prediction.respiratory_disease_rate.toFixed(2),
            icon: Activity,
            tooltip:
                "Estimated respiratory disease rate per 100k\n\nPredicts new or existing cases of respiratory conditions (e.g., asthma, bronchitis, COPD) per 100,000 population.\n\nReflects the potential burden of airborne pollutants, allergens, and temperature extremes on lung health.",
            color: "var(--chart-1)",
        },
        {
            label: "Cardio Mortality",
            value: prediction.cardio_mortality_rate.toFixed(2),
            icon: HeartPulse,
            tooltip:
                "Projected cardiovascular mortality rate\n\nEstimates expected deaths due to cardiovascular diseases (including ischemic heart disease and stroke) over a specified period.\n\nIntegrates environmental exposures (air quality, temperature, weather) and demographic risk factors.",
            color: "var(--chart-2)",
        },
        {
            label: "Vectorborne",
            value: prediction.vector_disease_risk_score.toFixed(2),
            icon: AlertTriangle,
            tooltip:
                "Vector-borne disease composite risk score\n\nRisk index for diseases transmitted by vectors (e.g., dengue, malaria, Zika).\n\nCombines temperature, precipitation, and humidity with historical patterns to assess the likelihood of vector proliferation.",
            color: "var(--chart-3)",
        },
        {
            label: "Waterborne",
            value: prediction.waterborne_disease_incidents.toFixed(0),
            icon: Droplets,
            tooltip:
                "Estimated waterborne disease incidents\n\nForecasts illnesses caused by contaminated water (e.g., cholera, typhoid, and diarrheal infections).\n\nConsiders water quality data, sanitation indicators, and climate factors like rainfall and flooding.",
            color: "var(--chart-4)",
        },
        {
            label: "Heat-related",
            value: prediction.heat_related_admissions.toFixed(0),
            icon: Thermometer,
            tooltip:
                "Heat-related hospital admissions\n\nProjects hospitalizations due to heat stress or illnesses (e.g., heatstroke and dehydration).\n\nIncorporates temperature extremes, consecutive hot days, and population vulnerability.",
            color: "var(--chart-5)",
        },
    ]

    return (
        <div className="glassy grid gap-4 rounded-2xl md:grid-cols-3">
            {chartMetrics.map((metric) => (
                <RadialChart
                    key={metric.label}
                    value={metric.value}
                    color={metric.color}
                    chartLabel={metric.label}
                    Icon={metric.icon}
                    tooltip={metric.tooltip}
                    max={100}
                />
            ))}
        </div>
    )
}
