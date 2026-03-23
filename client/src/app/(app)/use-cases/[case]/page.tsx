import UseCaseDetailClient from "@/components/ui/sections/UseCaseDetailClient"
import {
    extendedUseCases,
    UseCase,
    useCases,
    UseCasesKey,
} from "@/components/ui/sections/useCases.data"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type UseCasePageProps = {
    params: Promise<{ case: string }>
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
    const { case: slug } = await params
    const useCase = useCases[slug]

    if (!useCase)
        return {
            title: "404",
            description: "Page not found",
            robots: { index: false, follow: false },
        }

    return {
        title: useCase.title,
        description: useCase.description,
        alternates: {
            canonical: `/use-cases/${slug}`,
        },
    }
}

export default async function UseCasePage({ params }: UseCasePageProps) {
    const { case: slug } = await params
    const useCase = useCases[slug]
    const extended = extendedUseCases[slug]

    if (!useCase || !extended) notFound()
    const useCasesList = Object.entries(useCases)

    if (!useCasesList.length) return undefined

    const currentIndex = useCasesList.findIndex(([key]) => key === slug)

    if (currentIndex === -1) return undefined

    const nextUseCase = useCasesList[(currentIndex + 1) % useCasesList.length] as [
        UseCasesKey,
        UseCase,
    ]

    return <UseCaseDetailClient useCase={useCase} extended={extended} nextUseCase={nextUseCase} />
}
