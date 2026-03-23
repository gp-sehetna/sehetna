"use client"
import { useRef } from "react"
import { motion, useInView } from "motion/react"
import { ArrowUpRight, ToolCase } from "lucide-react"
import { Button } from "../shadcn/button"
import Link from "next/link"
import Divider from "../GlobalControls/Divider"

const MotionButton = motion.create(Button)

export function CTAGroundSection() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-80px" })
    return (
        <section
            ref={ref}
            className="from-background to-muted/4 relative overflow-hidden bg-linear-to-l py-16 lg:py-32"
        >
            {/* Decorative blobs */}
            <div className="from-primary/8 pointer-events-none absolute -top-20 -left-20 h-100 w-125 rounded-full bg-linear-to-br to-transparent blur-3xl" />
            <div className="from-secondary-300/8 pointer-events-none absolute -right-20 -bottom-20 h-100 w-125 rounded-full bg-linear-to-tl to-transparent blur-3xl" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: "radial-gradient(circle at 1px 1px, #222 1px, transparent 0)",
                    backgroundSize: "36px 36px",
                }}
            />

            <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 text-center">
                <motion.div
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, y: 32 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                    {/* Badge */}
                    <Divider hideDecorations>
                        <div className="glassy-chip inline-flex items-center gap-2">
                            <div className="bg-success-200 h-1.5 w-1.5 animate-pulse rounded-full" />
                            <span>Platform Available Now</span>
                        </div>
                    </Divider>

                    {/* Headline */}
                    <h2
                        className="text-neutral-1000 text-4xl leading-[1.06] lg:text-6xl"
                        style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                    >
                        Ready to See Environmental Health Intelligence in Action?
                    </h2>

                    {/* Subtext */}
                    <p className="mx-auto mb-4 max-w-2xl text-base leading-relaxed text-neutral-800">
                        Whether you lead a public health department, research institution, or city
                        authority — Sehetna provides the tools to understand and act on
                        environmental health risks before they escalate.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
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
                            <Link href="/use-cases/health-monitoring">
                                View Use Cases
                                <ToolCase size={16} />
                            </Link>
                        </MotionButton>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 lg:gap-10">
                        {[
                            "Built on Peer-Reviewed Research",
                            "WHO-Aligned Indicators",
                            "Open Environmental Datasets",
                            "Institutional-Grade Security",
                        ].map((item, i) => (
                            <motion.div
                                key={item}
                                initial={{ opacity: 0, y: 12 }}
                                animate={inView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="flex items-center gap-2"
                            >
                                <div className="bg-primary h-1.5 w-1.5 rounded-full" />
                                <span className="text-xs font-medium text-neutral-600">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
