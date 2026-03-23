"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { ArrowDownRight, ArrowUpRight, LucideIcon, Minus } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils/index"

const metricCardVariants = cva(
    "group relative overflow-hidden rounded-3xl border backdrop-blur-xl",
    {
        variants: {
            variant: {
                default:
                    "bg-background/70 border-white/80 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/8",
                soft: "border-transparent bg-linear-to-br from-white/90 via-white/75 to-white/55 shadow-md shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                contrast:
                    "border-neutral-1000/10 bg-neutral-1000 text-white shadow-xl shadow-black/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
            },
            size: {
                sm: "p-4",
                default: "p-6",
                lg: "p-7",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

type TrendDirection = "up" | "down" | "neutral"

export interface MetricCardProps
    extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof metricCardVariants> {
    label: React.ReactNode
    value: React.ReactNode
    description?: React.ReactNode
    icon?: LucideIcon
    badge?: React.ReactNode
    trend?: React.ReactNode
    trendLabel?: React.ReactNode
    trendDirection?: TrendDirection
    accent?: string
    valueSuffix?: React.ReactNode
}

function TrendGlyph({ direction }: { direction: TrendDirection }) {
    if (direction === "up") {
        return <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
    }

    if (direction === "down") {
        return <ArrowDownRight className="size-3.5" strokeWidth={1.8} />
    }

    return <Minus className="size-3.5" strokeWidth={1.8} />
}

const trendTone: Record<TrendDirection, string> = {
    up: "bg-success-100/25 text-success",
    down: "bg-danger/12 text-danger",
    neutral: "bg-neutral-200/70 text-neutral-700",
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
    (
        {
            className,
            variant = "default",
            size = "default",
            label,
            value,
            description,
            icon: Icon,
            badge,
            trend,
            trendLabel,
            trendDirection = "up",
            accent = "var(--color-primary-300)",
            valueSuffix,
            style,
            ...props
        },
        ref
    ) => {
        const metricStyle = {
            ...style,
            ["--metric-accent" as string]: accent,
        } as React.CSSProperties

        const mutedTextClass = variant === "contrast" ? "text-white/68" : "text-neutral-700"
        const labelTextClass = variant === "contrast" ? "text-white/72" : "text-neutral-700"
        const valueTextClass = variant === "contrast" ? "text-white" : "text-neutral-1000"

        return (
            <div
                ref={ref}
                className={cn(metricCardVariants({ variant, size }), className)}
                style={metricStyle}
                {...props}
            >
                <div
                    className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-30"
                    style={{ backgroundColor: "var(--metric-accent)" }}
                />
                <div
                    className={cn(
                        "pointer-events-none absolute inset-x-0 top-0 h-px opacity-80",
                        variant === "contrast"
                            ? "bg-linear-to-r from-transparent via-white/60 to-transparent"
                            : "bg-linear-to-r from-transparent via-[var(--metric-accent)] to-transparent"
                    )}
                />

                <div className="relative flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <p
                                className={cn(
                                    "text-xs font-semibold tracking-[0.18em] uppercase",
                                    labelTextClass
                                )}
                            >
                                {label}
                            </p>
                            {badge}
                        </div>
                    </div>
                    {Icon ? (
                        <Icon
                            className="size-5"
                            strokeWidth={1.8}
                            style={{ color: "var(--metric-accent)" }}
                        />
                    ) : null}
                </div>

                <div className="relative mt-5 flex items-end gap-2">
                    <span
                        className={cn(
                            "leading-none font-semibold tracking-tight",
                            valueTextClass,
                            size === "sm" && "text-3xl",
                            size === "default" && "text-4xl",
                            size === "lg" && "text-5xl"
                        )}
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {value}
                    </span>
                    {valueSuffix ? (
                        <span
                            className={cn(
                                "pb-1 text-lg font-semibold",
                                variant === "contrast" ? "text-white/80" : "text-neutral-700"
                            )}
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            {valueSuffix}
                        </span>
                    ) : null}
                </div>

                {description ? (
                    <p
                        className={cn(
                            "relative mt-3 max-w-[28ch] text-sm leading-relaxed",
                            mutedTextClass
                        )}
                    >
                        {description}
                    </p>
                ) : null}

                {trend || trendLabel ? (
                    <div className="relative mt-5 flex flex-wrap items-center gap-2">
                        {trend ? (
                            <div
                                className={cn(
                                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                                    trendTone[trendDirection]
                                )}
                            >
                                <TrendGlyph direction={trendDirection} />
                                <span>{trend}</span>
                            </div>
                        ) : null}
                        {trendLabel ? (
                            <span className={cn("text-xs", mutedTextClass)}>{trendLabel}</span>
                        ) : null}
                    </div>
                ) : null}
            </div>
        )
    }
)

MetricCard.displayName = "MetricCard"

export { MetricCard, metricCardVariants }
