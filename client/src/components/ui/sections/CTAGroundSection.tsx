"use client"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { ArrowUpRight, ToolCase } from "lucide-react"
import Link from "next/link"
import { Button } from "../shadcn/button"
import SectionEyebrow from "./SectionEyebrow"
import SectionShell from "./SectionShell"
import { fadeUp, staggerDelay } from "./motion"

const MotionButton = motion.create(Button)

const trustIndicators = [
    "Built on Peer-Reviewed Research",
    "WHO-Aligned Indicators",
    "Open Environmental Datasets",
    "Institutional-Grade Security",
]

function TrustIndicator({
    label,
    index,
    inView,
}: {
    label: string
    index: number
    inView: boolean
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + staggerDelay(index, 0.1) }}
            className="flex items-center gap-2"
        >
            <div className="bg-primary h-1.5 w-1.5 rounded-full" />
            <span className="text-xs font-medium text-neutral-600">{label}</span>
        </motion.div>
    )
}

export function CTAGroundSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })

    return (
        <SectionShell
            className="from-background to-muted/4 bg-linear-to-l"
            decoration={
                <>
                    <div className="from-primary/8 pointer-events-none absolute -top-20 -left-20 h-100 w-125 rounded-full bg-linear-to-br to-transparent blur-3xl" />
                    <div className="from-secondary-300/8 pointer-events-none absolute -right-20 -bottom-20 h-100 w-125 rounded-full bg-linear-to-tl to-transparent blur-3xl" />
                </>
            }
            containerClassName="max-w-5xl items-center text-center"
            texture="dots"
        >
            <div ref={ref} className="flex w-full flex-col gap-8">
                <motion.div
                    initial={fadeUp.initial}
                    animate={inView ? fadeUp.whileInView : {}}
                    transition={{ ...fadeUp.transition, duration: 0.9 }}
                    className="flex flex-col gap-4"
                >
                    <SectionEyebrow
                        label="Platform Available Now"
                        className="glassy-chip mx-auto text-center"
                        align="center"
                    />

                    <h2>Ready to See Environmental Health Intelligence in Action?</h2>

                    <p className="mx-auto max-w-2xl text-neutral-800">
                        Whether you lead a public health department, research institution, or city
                        authority, Sehetna provides the tools to understand and act on environmental
                        health risks before they escalate.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <MotionButton
                            asChild
                            size="xl"
                            variant="bright-primary"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/map">
                                Explore Map
                                <ArrowUpRight size={16} />
                            </Link>
                        </MotionButton>
                        <MotionButton
                            asChild
                            size="xl"
                            variant="bright"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href="/use-cases">
                                View Use Cases
                                <ToolCase size={16} />
                            </Link>
                        </MotionButton>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-8 lg:gap-10">
                        {trustIndicators.map((item, index) => (
                            <TrustIndicator key={item} label={item} index={index} inView={inView} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </SectionShell>
    )
}
