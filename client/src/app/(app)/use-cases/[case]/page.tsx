import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"
import { notFound } from "next/navigation"

const useCaseMap: Record<string, { title: string; description: string }> = {
    "health-monitoring": {
        title: "Health Monitoring",
        description:
            "Monitor your health and well-being with Sehetna's healthcare analytics and insights.",
    },
    "health-preparedness": {
        title: "Health Preparedness",
        description:
            "Prepare for potential health issues with Sehetna's health preparedness tools and resources.",
    },
    "policy-planning": {
        title: "Policy Planning",
        description:
            "Plan and implement healthcare policies with Sehetna's policy planning tools and resources.",
    },
    "research-insights": {
        title: "Research Insights",
        description:
            "Gain insights into healthcare research and innovations with Sehetna's research insights and resources.",
    },
}

type UseCasePageProps = {
    params: { case: string }
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
    const { case: useCase } = await params
    if (!useCase || !useCaseMap?.[useCase]) return {}

    return {
        title: `${useCaseMap[useCase]?.title} · Sehetna`,
        description: useCaseMap[useCase]?.description,
        alternates: {
            canonical: `/use-cases/${useCase}`,
        },
    }
}

export default async function UseCasePage({ params }: UseCasePageProps) {
    const { case: useCase } = await params
    if (!useCase || !useCaseMap?.[useCase]) return notFound()

    return (
        <ComingSoon
            title={useCaseMap[useCase].title}
            description={useCaseMap[useCase].description}
        />
    )
}
