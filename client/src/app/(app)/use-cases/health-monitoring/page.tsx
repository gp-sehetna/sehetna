import UseCaseDetailClient from "@/components/ui/sections/UseCaseDetailClient"
import {
    extendedUseCases,
    UseCase,
    useCases,
    UseCasesKey,
} from "@/components/ui/sections/useCases.data"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
    title: "Health Monitoring",
    description:
        "Real-time surveillance and tracking of disease patterns, health indicators, and population wellness metrics.",
    alternates: {
        canonical: `/use-cases/health-monitoring`,
    },
}

export default function HealthMonitoringPage() {
    const slug = "health-monitoring"
    const useCase = useCases[slug]
    const extended = extendedUseCases[slug]

    if (!useCase || !extended) notFound()

    const useCasesList = Object.entries(useCases)
    const currentIndex = useCasesList.findIndex(([key]) => key === slug)

    if (currentIndex === -1) return undefined

    const nextUseCase = useCasesList[(currentIndex + 1) % useCasesList.length] as [
        UseCasesKey,
        UseCase,
    ]

    return <UseCaseDetailClient useCase={useCase} extended={extended} nextUseCase={nextUseCase} />
}
