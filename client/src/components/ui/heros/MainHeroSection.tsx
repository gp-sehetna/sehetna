"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Gradient from "../GlobalComponents/extras/gradient"
import Image from "next/image"
import { useParallax } from "@/hooks/use-parallax"
import { Button } from "../shadcn/button"
import { ArrowLeft, ArrowRight, ArrowUpRight, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useIsMobile } from "@/hooks/use-mobile"

type HeroElement = {
    id: number
    tag: string
    title: string
    cta: string
    ctaHref: string
    tint: string
    subtitle: string
    image: {
        src: string
        alt: string
    }
    color: string
    ctaClassName: string
}

const heroElements: HeroElement[] = [
    {
        id: 0,
        tag: "Climate & Health Intelligence",
        title: "Where Environment Meets\nPublic Health",
        subtitle:
            "Sehetna translates complex environmental data into clear, actionable health risk forecasts — giving decision-makers the insight to protect communities before harm occurs.",
        cta: "Explore Predictions",
        ctaHref: "/data-explorer",
        image: {
            src: "/images/gis-island.jpg",
            alt: "Aerial view of an island used to represent mapped climate insights",
        },
        tint: " via-blue-600/20",
        color: "bg-primary",
        ctaClassName: "from-primary to-primary/75 shadow-primary/20",
    },
    {
        id: 1,
        tag: "AI-Powered Risk Modeling",
        title: "Predicting Health Risks\nBefore They Happen",
        subtitle:
            "Our multi-model AI pipeline integrates climatic, environmental, and demographic data to forecast heatstroke, respiratory illness, cardiovascular risks, and vector-borne disease outbreaks.",
        cta: "View Methodology",
        ctaHref: "/methodology",
        image: {
            src: "/images/gafaf.jpg",
            alt: "Gafaf landscape representing local field documentation",
        },
        tint: "via-orange-700/20",
        color: "bg-secondary",
        ctaClassName: "from-secondary to-secondary/75 shadow-secondary/20",
    },
    {
        id: 2,
        tag: "Decision Support System",
        title: "Empowering Institutions\nWith Clarity",
        subtitle:
            "Scenario-based simulations let health authorities and planners explore how environmental changes propagate into population health outcomes — supporting early intervention and resource allocation.",
        cta: "See Use Cases",
        ctaHref: "/use-cases",
        image: {
            src: "/images/ocean-fresh.jpg",
            alt: "Fresh ocean produce representing sustainable coastal futures",
        },
        tint: "via-blue-600/20",
        color: "bg-success-100",
        ctaClassName: "from-success-100 to-success-100/75 shadow-success-100/20",
    },
    {
        id: 3,
        tag: "Prepared For First Response",
        title: "Predicting Health Risks\nBefore They Happen",
        subtitle:
            "Strengthen emergency readiness with accessible first-aid guidance designed to support fast, confident action.",
        cta: "View Methodology",
        ctaHref: "/methodology",
        image: {
            src: "/images/bw-dust-landscape.jfif",
            alt: "B&W landscape representing local field documentation",
        },
        tint: "via-foreground/40",
        color: "bg-secondary-100",
        ctaClassName:
            "from-secondary-100 text-neutral-900 to-secondary-100/75 shadow-secondary-100/20",
    },
]

type PaginationButtonProps = {
    Icon: LucideIcon
    onClick: () => void
}

const PaginationButton = ({ Icon, onClick }: PaginationButtonProps) => {
    return (
        <Button
            variant="glassy"
            className="border-muted-foreground/40 text-background/80 bg-transparent"
            size="icon-xl"
            onClick={onClick}
        >
            <Icon size={32} />
        </Button>
    )
}
function MainHeroSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const isMobile = useIsMobile()

    useParallax(containerRef, imageRef, {
        speed: -40,
        scale: 1.1,
    })

    const totalHeroes = heroElements.length

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }
    const paginate = useCallback(
        (direction: number) => {
            setCurrentIndex(
                (previousIndex) => (previousIndex + direction + totalHeroes) % totalHeroes
            )
        },
        [totalHeroes]
    )

    useEffect(() => {
        const timer = setInterval(() => {
            paginate(1)
        }, 6500)
        return () => clearInterval(timer)
    }, [paginate])

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
            <div ref={imageRef} className="absolute inset-0">
                {heroElements.map((heroElement, index) => (
                    <div
                        key={index}
                        className={cn(
                            "absolute inset-0 transition-all duration-1200 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                            index === currentIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
                        )}
                    >
                        <Image
                            src={heroElement.image.src}
                            alt={heroElement.image.alt}
                            fill
                            priority={index === 0}
                            className="object-cover"
                        />
                    </div>
                ))}
                <Gradient className={heroElements[currentIndex].tint} />
            </div>

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "62px 62px",
                }}
            />

            <div className="relative flex h-full items-center justify-center px-4 md:justify-start md:px-12">
                <div className="relative min-h-50 w-full max-w-2xl">
                    {heroElements.map((heroElement, index) => (
                        <div
                            key={heroElement.id}
                            className={cn(
                                "absolute inset-0 flex flex-col items-center justify-around gap-2 text-center transition-all duration-500 ease-out md:items-start md:text-start",
                                index === currentIndex
                                    ? "translate-y-0 opacity-100"
                                    : "pointer-events-none translate-y-6 opacity-0"
                            )}
                        >
                            <div className="mb-5 inline-flex items-center gap-2">
                                <span
                                    className={cn("h-1.5 w-1.5 rounded-full", heroElement.color)}
                                />
                                <span className="text-xs font-medium tracking-widest text-white/70 uppercase">
                                    {heroElement.tag}
                                </span>
                            </div>
                            <h1 className="text-background text-shadow-lg">{heroElement.title}</h1>
                            <p className="text-muted text-shadow-lg">{heroElement.subtitle}</p>
                            <div className="mt-4 inline-flex gap-4">
                                <Button
                                    className={cn(
                                        "bg-transparent bg-linear-to-br shadow-xl",
                                        heroElement.ctaClassName
                                    )}
                                    size="xl"
                                    asChild
                                >
                                    <Link href={heroElement.ctaHref}>{heroElement.cta}</Link>
                                </Button>
                                <Button size="xl" variant="bright" asChild>
                                    <Link href="/more-about-us">
                                        More About Us
                                        <ArrowUpRight />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 left-1/2 mb-8 flex -translate-x-1/2 transform items-center gap-2">
                <div className="flex items-center gap-2">
                    {heroElements.map((heroElement, index) => (
                        <button
                            key={index}
                            type="button"
                            aria-label={`Go to hero ${index + 1}: ${heroElement.title}`}
                            aria-current={index === currentIndex}
                            onClick={() => goToSlide(index)}
                            className={cn(
                                "base-transition h-2.5 cursor-pointer rounded-full",
                                index === currentIndex
                                    ? "bg-background w-24"
                                    : "bg-background/20 hover:bg-background/80 w-2.5"
                            )}
                        />
                    ))}
                </div>
            </div>
            <div className="absolute right-0 bottom-0 m-8 flex flex-col items-end gap-4 md:items-start">
                <div className="flex items-center justify-center gap-4 md:justify-start">
                    <PaginationButton Icon={ArrowLeft} onClick={() => paginate(-1)} />
                    <PaginationButton Icon={ArrowRight} onClick={() => paginate(1)} />
                </div>
            </div>
            {!isMobile ? (
                <div className="absolute bottom-0 left-40 mb-4 flex flex-col items-center gap-2">
                    <div className="flex h-10.5 w-6.5 justify-center rounded-sm rounded-br-3xl border-2 border-white/50 p-1.5">
                        <div className="h-2 w-1 animate-bounce rounded-full bg-white" />
                    </div>

                    <span className="text-background animate-pulse text-[8px] font-bold tracking-widest uppercase">
                        Scroll to Explore
                    </span>
                </div>
            ) : (
                <></>
            )}
        </section>
    )
}

export default MainHeroSection
