"use client"

import {
    AlertTriangle,
    ChevronDown,
    ChevronRight,
    Clock,
    Cookie,
    Eye,
    FileText,
    Globe,
    Lock,
    Mail,
    Server,
    Shield,
    UserCheck,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "../shadcn/button"
import SectionHeading from "./SectionHeading"

type TabKey = "tos" | "privacy" | "cookies"

const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
    { key: "tos", label: "Terms of Service", icon: FileText },
    { key: "privacy", label: "Privacy Policy", icon: Shield },
    { key: "cookies", label: "Cookie Policy", icon: Cookie },
]

function AccordionItem({
    title,
    children,
    defaultOpen = false,
    accentColor = "var(--color-success-300)",
}: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    accentColor?: string
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="bg-background/60 overflow-hidden rounded-2xl border border-neutral-200/80 backdrop-blur-sm">
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="hover:bg-primary-50/60 flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left transition-colors"
            >
                <span className="text-neutral-1000 text-sm font-semibold">{title}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} style={{ color: accentColor }} strokeWidth={1.5} />
                </motion.div>
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
            >
                <div className="border-t px-6 pb-5 text-sm leading-relaxed text-neutral-800">
                    <div className="pt-4">{children}</div>
                </div>
            </motion.div>
        </div>
    )
}

function TermsOfService() {
    return (
        <div className="flex flex-col gap-4">
            <AccordionItem
                title="1. Acceptance of Terms"
                defaultOpen
                accentColor="var(--color-primary)"
            >
                <p>
                    By accessing or using the Sehetna analytics platform {'("Platform")'}, you agree
                    to be bound by these Terms of Service.
                </p>
                <p className="mt-3">
                    Sehetna may update these Terms periodically. We will provide notice through the
                    Platform or by email where appropriate.
                </p>
            </AccordionItem>
            <AccordionItem
                title="2. Permitted Use & Restrictions"
                accentColor="var(--color-primary)"
            >
                <p>
                    The Platform is intended for authorised institutional users and lawful
                    decision-support use.
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                    {[
                        "Do not use outputs as a substitute for professional medical diagnosis.",
                        "Do not redistribute or resell Platform data or predictions without permission.",
                        "Do not scrape, reverse engineer, or probe system vulnerabilities.",
                        "Do not attempt to bypass access controls.",
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <span className="bg-primary mt-2 h-1 w-1 shrink-0 rounded-full" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </AccordionItem>
            <AccordionItem title="3. Intellectual Property" accentColor="var(--color-primary)">
                <p>
                    The Platform, including code, models, data visualisations, and design assets, is
                    protected intellectual property.
                </p>
            </AccordionItem>
            <AccordionItem
                title="4. Disclaimers & Limitation of Liability"
                accentColor="var(--color-primary)"
            >
                <p>
                    Predictions are probabilistic and carry inherent uncertainty. Sehetna does not
                    guarantee that outputs are complete, accurate, or fit for a specific purpose.
                </p>
                <div className="border-primary-200 bg-primary-50 mt-3 rounded-xl border p-4">
                    <div className="flex items-start gap-2.5">
                        <AlertTriangle size={15} className="text-primary mt-0.5 shrink-0" />
                        <p className="text-xs">
                            To the maximum extent permitted by law, Sehetna is not liable for
                            indirect or consequential damages arising from reliance on Platform
                            outputs.
                        </p>
                    </div>
                </div>
            </AccordionItem>
            <AccordionItem title="5. Governing Law" accentColor="var(--color-primary)">
                <p>These Terms are governed by the jurisdiction in which Sehetna is registered.</p>
            </AccordionItem>
        </div>
    )
}

function PrivacyPolicy() {
    return (
        <div className="flex flex-col gap-4">
            <AccordionItem
                title="1. Data We Collect"
                defaultOpen
                accentColor="var(--color-success-300)"
            >
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        {
                            icon: UserCheck,
                            label: "Account Data",
                            desc: "Name, email, role, and organisation affiliation.",
                        },
                        {
                            icon: Server,
                            label: "Usage Data",
                            desc: "Feature interactions, session duration, and logs.",
                        },
                        {
                            icon: Globe,
                            label: "Environmental Queries",
                            desc: "Coordinates, dates, and disease categories.",
                        },
                        {
                            icon: Eye,
                            label: "Device & Browser",
                            desc: "IP address, browser, OS, and referral data.",
                        },
                    ].map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.label}
                                className="bg-success-100/20 flex items-start gap-3 rounded-xl p-3"
                            >
                                <Icon size={14} className="text-success mt-0.5 shrink-0" />
                                <div>
                                    <div className="text-neutral-1000 text-xs font-semibold">
                                        {item.label}
                                    </div>
                                    <p className="text-xs text-neutral-700">{item.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </AccordionItem>
            <AccordionItem title="2. How We Use Your Data" accentColor="var(--color-success-300)">
                <ul className="flex flex-col gap-2">
                    {[
                        "Provide and improve the Platform.",
                        "Authenticate users and enforce access controls.",
                        "Generate aggregated analytics.",
                        "Send service-related notifications.",
                        "Comply with legal obligations.",
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <span className="bg-success mt-2 h-1 w-1 shrink-0 rounded-full" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </AccordionItem>
            <AccordionItem title="3. Data Retention" accentColor="var(--color-success-300)">
                <p>
                    We retain data only as long as needed for the stated purpose and legal
                    compliance.
                </p>
            </AccordionItem>
            <AccordionItem title="4. Your Rights" accentColor="var(--color-success-300)">
                <ul className="flex flex-col gap-2">
                    {["Access", "Correct", "Erase", "Restrict processing", "Data portability"].map(
                        (item) => (
                            <li key={item} className="flex items-start gap-2">
                                <ChevronRight size={12} className="text-success mt-1 shrink-0" />
                                <span>{item}</span>
                            </li>
                        )
                    )}
                </ul>
            </AccordionItem>
            <AccordionItem title="5. Data Security" accentColor="var(--color-success-300)">
                <div className="flex items-start gap-3">
                    <Lock size={15} className="text-success mt-0.5 shrink-0" />
                    <p>
                        Sehetna uses encryption in transit and at rest, role-based access control,
                        and routine security testing.
                    </p>
                </div>
            </AccordionItem>
        </div>
    )
}

function CookiePolicy() {
    const cookieTypes = [
        {
            name: "Strictly Necessary",
            required: true,
            color: "var(--color-success-300)",
            duration: "Session / 7 days",
        },
        {
            name: "Functional",
            required: false,
            color: "var(--color-warning-200)",
            duration: "90 days",
        },
        {
            name: "Analytics",
            required: false,
            color: "var(--color-secondary-300)",
            duration: "1 year",
        },
        { name: "Marketing", required: false, color: "var(--color-primary-400)", duration: "N/A" },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-background/60 rounded-2xl border p-5">
                <div className="flex items-start gap-3">
                    <Cookie size={18} className="text-warning-200 mt-0.5 shrink-0" />
                    <div>
                        <h4 className="text-neutral-1000 mb-1 text-sm font-semibold">
                            What Are Cookies?
                        </h4>
                        <p className="text-xs leading-relaxed text-neutral-800">
                            Cookies are small files used to keep the Platform functional, remember
                            preferences, and provide analytics.
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {cookieTypes.map((type) => (
                    <div
                        key={type.name}
                        className="bg-background/60 rounded-2xl border border-white/80 p-5 shadow-sm backdrop-blur-sm"
                    >
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h4 className="text-neutral-1000 text-sm font-semibold">{type.name}</h4>
                            <span
                                className="text-2xs rounded-full px-2 py-0.5 font-semibold"
                                style={{ backgroundColor: `${type.color}15`, color: type.color }}
                            >
                                {type.required ? "Required" : "Optional"}
                            </span>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                            <Clock size={11} style={{ color: type.color }} />
                            <span className="text-2xs text-neutral-600">
                                Retention: {type.duration}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ServicesAndPoliciesClient() {
    const [activeTab, setActiveTab] = useState<TabKey>("tos")

    return (
        <main className="bg-primary-50 min-h-screen">
            <section className="from-primary-50 via-background to-success-100/20 relative overflow-hidden bg-linear-to-b py-24">
                <div className="from-success-300/10 pointer-events-none absolute -top-32 right-0 h-100 w-125 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #222 1px, transparent 0)",
                        backgroundSize: "36px 36px",
                    }}
                />
                <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
                    <div className="bg-background/80 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm backdrop-blur-xl">
                        <Shield size={13} className="text-success" strokeWidth={2} />
                        <span className="text-xs font-semibold text-neutral-800">
                            Legal & Governance
                        </span>
                    </div>
                    <h1 className="text-neutral-1000 text-5xl leading-[1.06] lg:text-6xl">
                        Services & Policies
                    </h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-800">
                        Sehetna is committed to transparency in how we operate, handle data, and
                        protect user rights.
                    </p>
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                        <Clock size={12} className="text-neutral-500" />
                        <span className="text-xs text-neutral-500">
                            Last updated: March 22, 2026
                        </span>
                    </div>
                </div>
            </section>

            <section className="relative py-12 pb-24">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="bg-background/60 mb-8 flex gap-2 rounded-2xl border p-1.5 shadow-sm backdrop-blur-xl">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            const active = activeTab === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                                        active
                                            ? "text-neutral-1000 bg-background shadow-md shadow-black/5"
                                            : "text-neutral-600"
                                    }`}
                                >
                                    <Icon
                                        size={14}
                                        strokeWidth={1.5}
                                        className={active ? "text-success" : "text-current"}
                                    />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                                </button>
                            )
                        })}
                    </div>

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="mb-6">
                            <SectionHeading
                                label="Policy Documents"
                                title={tabs.find((tab) => tab.key === activeTab)?.label ?? ""}
                                labelClassName="text-success"
                                titleClassName="text-xl text-neutral-1000"
                                className="max-w-none text-left"
                            />
                        </div>
                        {activeTab === "tos" && <TermsOfService />}
                        {activeTab === "privacy" && <PrivacyPolicy />}
                        {activeTab === "cookies" && <CookiePolicy />}
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="from-primary-100/10 to-primary-100/45 mx-6 mt-12 flex max-w-6xl flex-col items-center gap-4 rounded-3xl border bg-linear-to-r p-6 sm:flex-row xl:mx-auto"
                >
                    <div className="flex-1">
                        <h4 className="text-neutral-1000 mb-1 text-sm font-semibold">
                            Questions about our policies?
                        </h4>
                        <p className="text-xs text-neutral-800">
                            Our compliance team can help with institutional queries and legal
                            concerns.
                        </p>
                    </div>
                    <Button
                        variant="bright-primary"
                        size="xl"
                        className="transition-all hover:-translate-y-0.5"
                        asChild
                    >
                        <Link href="mailto:support@sehetna.from-masr.com">
                            <Mail size={14} strokeWidth={1.5} />
                            Contact Legal Team
                        </Link>
                    </Button>
                </motion.div>
            </section>
        </main>
    )
}
