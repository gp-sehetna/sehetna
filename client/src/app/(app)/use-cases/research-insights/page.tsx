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
    title: "Research Insights",
    description:
        "Advanced analytics and scientific insights supporting research institutions and evidence generation.",
    alternates: {
        canonical: `/use-cases/research-insights`,
    },
}

export default function ResearchInsightsPage() {
    const slug = "research-insights"
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
