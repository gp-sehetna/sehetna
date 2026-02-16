"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/shadcn/card" // if using shadcn
import { Activity, HeartPulse, Thermometer, Droplets, AlertTriangle } from "lucide-react"
import { usePredictionsStore } from "@/stores/usePredictions"

export default function PredictionViewer() {
    const { simulation } = usePredictionsStore()
    const predictions = simulation?.predictions
    useEffect(() => {
        if (predictions && predictions.length > 1) {
            toast.error("Multiple predictions detected. Please refine your simulation input.")
        }
    }, [predictions])

    if (!predictions?.length || predictions.length > 1) return null

    const prediction = predictions[0]

    const metrics = [
        {
            label: "Respiratory Disease Rate",
            value: prediction.respiratory_disease_rate,
            icon: Activity,
        },
        {
            label: "Cardio Mortality Rate",
            value: prediction.cardio_mortality_rate,
            icon: HeartPulse,
        },
        {
            label: "Vector Disease Risk",
            value: prediction.vector_disease_risk_score,
            icon: AlertTriangle,
        },
        {
            label: "Waterborne Incidents",
            value: prediction.waterborne_disease_incidents,
            icon: Droplets,
        },
        {
            label: "Heat-related Admissions",
            value: prediction.heat_related_admissions,
            icon: Thermometer,
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                    <Card key={metric.label} className="rounded-2xl shadow-sm">
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-muted-foreground text-sm">{metric.label}</p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {metric.value.toFixed(2)}
                                </p>
                            </div>
                            <Icon className="text-muted-foreground h-6 w-6" />
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
