import { Metadata } from "next"
import { notFound } from "next/navigation"
import UseCaseDetailClient from "@/components/ui/sections/UseCaseDetailClient"
import {
    getUseCase,
    useCaseExtendedData,
    useCaseList,
} from "@/components/ui/sections/useCases.data"

type UseCasePageProps = {
    params: Promise<{ case: string }>
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
    const { case: slug } = await params
    const useCase = getUseCase(slug)

    if (!useCase) return {}

    return {
        title: `${useCase.title} | Sehetna`,
        description: useCase.description,
        alternates: {
            canonical: `/use-cases/${slug}`,
        },
    }
}

export default async function UseCasePage({ params }: UseCasePageProps) {
    const { case: slug } = await params
    const useCase = getUseCase(slug)
    const extended = useCaseExtendedData[slug]

    if (!useCase || !extended) notFound()

    const currentIndex = useCaseList.findIndex((item) => item.slug === slug)
    const nextUseCase = useCaseList[(currentIndex + 1) % useCaseList.length]

    return <UseCaseDetailClient useCase={useCase} extended={extended} nextUseCase={nextUseCase} />
}
