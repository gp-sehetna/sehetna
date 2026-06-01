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
    title: "Health Preparedness",
    description:
        "Strategic planning and resource allocation for epidemic preparedness and emergency response capacity.",
    alternates: {
        canonical: `/use-cases/health-preparedness`,
    },
}

export default function HealthPreparednessPage() {
    const slug = "health-preparedness"
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
