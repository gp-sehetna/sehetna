"use client"

import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/shadcn/accordion"
import { Card, CardContent } from "@/components/ui/shadcn/card"
import { Skeleton } from "@/components/ui/shadcn/skeleton"
import { InterpretationResponse } from "@/features/environment/week/week.types"
import { cn } from "@/lib/utils"
import {
    OctagonAlert,
    ShieldAlert,
    ShieldCheck,
    Sparkles,
    TriangleAlert,
    type LucideIcon,
} from "lucide-react"
import { useState } from "react"

type InterpreterMessageBannerProps = {
    loading: boolean
} & InterpretationResponse

type SeverityTone = {
    badgeClassName: string
    containerClassName: string
    contentClassName: string
    icon: LucideIcon
    label: string
    metaClassName: string
}

const INSIGHT_ITEM_VALUE = "simulation-insight"

const severityTones: Record<InterpretationResponse["severity"], SeverityTone> = {
    low: {
        label: "Low severity",
        icon: ShieldCheck,
        containerClassName:
            "border-success-200/40 bg-linear-to-br from-success-100/18 via-white/96 to-white shadow-success-300/10",
        badgeClassName: "border-success-200/40 bg-success-100/65 text-success",
        contentClassName: "border-success-200/35 bg-success-100/20",
        metaClassName: "text-success",
    },
    medium: {
        label: "Medium severity",
        icon: TriangleAlert,
        containerClassName:
            "border-warning-100/60 bg-linear-to-br from-warning-100/16 via-white/96 to-white shadow-warning-100/10",
        badgeClassName: "border-warning-100/70 bg-warning-100/60 text-warning-200",
        contentClassName: "border-warning-100/55 bg-warning-100/18",
        metaClassName: "text-warning-200",
    },
    high: {
        label: "High severity",
        icon: ShieldAlert,
        containerClassName:
            "border-primary-200/60 bg-linear-to-br from-primary-100/32 via-white/95 to-white shadow-primary/10",
        badgeClassName: "border-primary-200/60 bg-primary-100/75 text-primary-700",
        contentClassName: "border-primary-200/45 bg-primary-50",
        metaClassName: "text-primary-600",
    },
    critical: {
        label: "Critical severity",
        icon: OctagonAlert,
        containerClassName:
            "border-destructive/25 bg-linear-to-br from-destructive/10 via-white/96 to-white shadow-destructive/10",
        badgeClassName: "border-destructive/25 bg-destructive/12 text-destructive",
        contentClassName: "border-destructive/20 bg-destructive/6",
        metaClassName: "text-destructive",
    },
}

export const InterpreterMessageBanner = ({
    loading,
    message,
    severity,
}: InterpreterMessageBannerProps) => {
    const [openItem, setOpenItem] = useState("")

    const normalizedMessage = message.replace(/\s+/g, " ").trim()

    const tone = severityTones?.[severity] || severityTones.medium
    const isOpen = openItem === INSIGHT_ITEM_VALUE

    if (!loading && !normalizedMessage) return null

    if (loading) {
        return (
            <Card className="border-primary-200/55 from-primary-50 m-4 overflow-hidden bg-linear-to-br via-white to-white shadow-sm">
                <CardContent className="p-0">
                    <div className="from-primary-200/40 via-primary-100/10 absolute inset-x-6 top-0 h-px bg-linear-to-r to-transparent" />

                    <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                        <div className="w-100 space-y-2">
                            <div className="flex items-center gap-2">
                                <Sparkles className={cn("size-3", tone.metaClassName)} />
                                <p className="text-neutral-1000 text-sm font-semibold">
                                    Analysing simulation...
                                </p>
                            </div>
                            <Skeleton className="bg-primary-100/70 h-4 w-full rounded-full" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Accordion
            type="single"
            collapsible
            value={openItem}
            onValueChange={setOpenItem}
            className="m-4"
        >
            <AccordionItem
                value={INSIGHT_ITEM_VALUE}
                variant="card"
                className={cn(
                    "overflow-hidden border shadow-sm backdrop-blur-sm",
                    tone.containerClassName
                )}
            >
                <AccordionTrigger className="gap-2 sm:px-5">
                    <div className="flex items-start gap-3">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Sparkles className={cn("size-3", tone.metaClassName)} />
                                <p className="text-neutral-1000 text-sm font-semibold">
                                    Simulation insight
                                </p>
                            </div>
                            <p
                                className={cn(
                                    "text-muted-foreground pr-2 text-sm leading-6",
                                    !isOpen && "line-clamp-1"
                                )}
                            >
                                {normalizedMessage}
                            </p>
                        </div>
                    </div>
                </AccordionTrigger>
            </AccordionItem>
        </Accordion>
    )
}
