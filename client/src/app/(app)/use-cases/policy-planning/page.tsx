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
    title: "Policy Planning",
    description:
        "Evidence-based policy recommendations and long-term health system strengthening strategies.",
    alternates: {
        canonical: `/use-cases/policy-planning`,
    },
}

export default function PolicyPlanningPage() {
    const slug = "policy-planning"
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
