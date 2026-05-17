import SectionHeading from "@/components/ui/sections/SectionHeading"
import { useCases } from "@/components/ui/sections/useCases.data"
import Texture from "@/components/ui/textures"
import { ArrowRight, BarChart3, Brain, LucideIcon, TrendingUp } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

type InstitutionType = {
    icon: LucideIcon
    title: string
    description: string
}

const institutionTypes: InstitutionType[] = [
    {
        icon: TrendingUp,
        title: "National ministries",
        description: "Health, environment, and infrastructure agencies.",
    },
    {
        icon: Brain,
        title: "Research institutions",
        description: "Universities and evidence-producing labs.",
    },
    {
        icon: BarChart3,
        title: "Municipal authorities",
        description: "City health teams and local planners.",
    },
]

export const metadata: Metadata = {
    title: "Use Cases",
    description:
        "Explore the institutional use cases and disease-risk modules supported by Sehetna.",
    alternates: {
        canonical: "/use-cases",
    },
}

export default function UseCasesPage() {
    return (
        <>
            <section className="relative mt-24 overflow-hidden py-12">
                <Texture texture="dots" />
                <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <p className="text-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
                            Real-world applications
                        </p>
                        <h2>Where Sehetna makes a difference</h2>
                        <p className="mt-5 text-lg text-neutral-800">
                            Five disease-environment risk modules, each designed around an
                            institutional decision-making need.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            ["5", "Risk models"],
                            ["12+", "Institutions served"],
                            ["6", "Countries active"],
                        ].map(([value, label]) => (
                            <div
                                key={label}
                                className="bg-background/70 rounded-2xl border px-5 py-4 text-center backdrop-blur-xl"
                            >
                                <div className="text-neutral-1000 text-3xl">{value}</div>
                                <div className="text-xs text-neutral-600">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="from-background to-secondary-100/20 bg-linear-to-b py-8 pb-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {Object.entries(useCases).map(([slug, useCase]) => {
                            return (
                                <Link
                                    key={slug}
                                    href={`/use-cases/${slug}`}
                                    className="group bg-background/60 overflow-hidden rounded-3xl border border-white/80 shadow-md shadow-black/5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8"
                                >
                                    <div className="relative h-52 overflow-hidden">
                                        <Image
                                            src={useCase.heroImage}
                                            alt={useCase.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 1280px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
                                        <div className="text-2xs bg-background/10 absolute top-4 left-4 rounded-full border border-white/20 px-3 py-1.5 font-bold tracking-widest text-white uppercase backdrop-blur-sm">
                                            {useCase.label}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 p-6">
                                        <div>
                                            <h6>{useCase.title}</h6>
                                            <p className="mt-2 text-sm text-neutral-800">
                                                {useCase.description}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 border-y py-3">
                                            {useCase.metrics.map((metric) => (
                                                <div key={metric.label} className="text-center">
                                                    <div
                                                        className="text-sm font-bold"
                                                        style={{ color: useCase.accent }}
                                                    >
                                                        {metric.value}
                                                    </div>
                                                    <div className="text-2xs mt-1 text-neutral-500">
                                                        {metric.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-xs text-neutral-600">
                                                {useCase.users[0]}
                                            </span>
                                            <span
                                                className="inline-flex items-center gap-1.5 font-semibold"
                                                style={{ color: useCase.accent }}
                                            >
                                                Explore
                                                <ArrowRight
                                                    size={13}
                                                    strokeWidth={2}
                                                    className="transition-transform group-hover:translate-x-0.5"
                                                />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="from-secondary-100/20 to-background bg-linear-to-b py-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
                    <SectionHeading label="Institutional Users" title="Built for decision-makers" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {institutionTypes.map((item) => {
                            const Icon = item.icon
                            return (
                                <div
                                    key={item.title}
                                    className="bg-background/60 rounded-3xl border border-white/80 p-6 text-center shadow-sm backdrop-blur-xl"
                                >
                                    <div className="bg-primary-100/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                                        <Icon
                                            size={20}
                                            className="text-primary"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h6 className="text-sm">{item.title}</h6>
                                    <p className="mt-2 text-sm text-neutral-800">
                                        {item.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>
        </>
    )
}
