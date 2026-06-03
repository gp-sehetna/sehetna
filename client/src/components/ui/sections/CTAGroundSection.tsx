"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { ArrowUpRight, ToolCase } from "lucide-react"
import Link from "next/link"
import { Button } from "../shadcn/button"
import SectionEyebrow from "./SectionEyebrow"
import SectionShell from "./SectionShell"
import { fadeUp, staggerDelay } from "./motion"
import { MirroredPrimarySecondaryDecoration } from "../GlobalComponents/extras/BackgroundDecorations"

const trustIndicators = [
    "Built on Peer-Reviewed Research",
    "WHO-Aligned Indicators",
    "Open Environmental Datasets",
    "Institutional-Grade Security",
]

type TrustIndicatorProps = {
    label: string
    index: number
    inView: boolean
}

function TrustIndicator({ label, index, inView }: TrustIndicatorProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + staggerDelay(index, 0.1) }}
            className="flex items-center gap-2"
        >
            <div className="bg-primary h-1.5 w-1.5 rounded-full" />
            <span className="text-xs font-medium text-neutral-500">{label}</span>
        </motion.div>
    )
}

export function CTAGroundSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <SectionShell
            decoration={<MirroredPrimarySecondaryDecoration />}
            containerClassName="max-w-5xl items-center text-center"
            texture="dots"
        >
            <div ref={ref} className="flex w-full flex-col gap-8">
                <motion.div
                    initial={fadeUp.initial}
                    animate={inView ? fadeUp.whileInView : {}}
                    transition={{ ...fadeUp.transition, duration: 0.9 }}
                    className="flex flex-col items-center gap-6"
                >
                    <SectionEyebrow label="Platform Available Now" className="glassy-chip" />

                    <h2>Ready to See Environmental Health Intelligence in Action?</h2>

                    <p className="max-w-2xl text-neutral-500">
                        Whether you lead a public health department, research institution, or city
                        authority, Sehetna provides the tools to understand and act on environmental
                        health risks before they escalate.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button asChild size="xl" variant="bright-primary">
                            <Link href="/map">
                                Explore Map
                                <ArrowUpRight />
                            </Link>
                        </Button>
                        <Button asChild size="xl" variant="bright">
                            <Link href="/use-cases">
                                View Use Cases
                                <ToolCase />
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                        {trustIndicators.map((item, index) => (
                            <TrustIndicator key={item} label={item} index={index} inView={inView} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </SectionShell>
    )
}
