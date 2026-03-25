"use client"

import { useMemo, useState } from "react"
import {
    Clock,
    Cookie,
    Dot,
    Eye,
    FileText,
    Globe,
    Lock,
    Server,
    Shield,
    UserCheck,
} from "lucide-react"
import { motion } from "motion/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../shadcn/accordion"
import SectionShell from "./SectionShell"
import { easeBehavior, fadeUp } from "./motion"

type TabKey = "tos" | "privacy" | "cookies"

type PolicyTab = {
    key: TabKey
    label: string
    shortLabel: string
    icon: typeof FileText
    description: string
}

const tabs: PolicyTab[] = [
    {
        key: "tos",
        label: "Terms of Service",
        shortLabel: "Terms",
        icon: FileText,
        description:
            "Platform access, permitted use, service boundaries, and account responsibilities.",
    },
    {
        key: "privacy",
        label: "Privacy Policy",
        shortLabel: "Privacy",
        icon: Shield,
        description:
            "What data we collect, why we process it, and how users can exercise their rights.",
    },
    {
        key: "cookies",
        label: "Cookie Policy",
        shortLabel: "Cookies",
        icon: Cookie,
        description:
            "How cookies support core functionality, analytics, and preference management.",
    },
]

const privacyCollectionItems = [
    {
        icon: UserCheck,
        label: "Account Data",
        desc: "Name, email, role, and organization affiliation used to provision and secure access.",
    },
    {
        icon: Server,
        label: "Usage Data",
        desc: "Feature interactions, diagnostic logs, session timing, and system performance events.",
    },
    {
        icon: Globe,
        label: "Environmental Queries",
        desc: "Coordinates, time ranges, regions, indicators, and disease categories selected in the platform.",
    },
    {
        icon: Eye,
        label: "Device & Browser",
        desc: "Browser family, OS, IP-derived region, and referral context used for security and support.",
    },
]

const cookieTypes = [
    {
        name: "Strictly Necessary",
        required: true,
        toneClassName: "bg-primary-100/40 text-primary",
        iconClassName: "text-primary",
        duration: "Session to 7 days",
        description:
            "Supports login, session continuity, security checks, and core platform behavior.",
    },
    {
        name: "Functional",
        required: false,
        toneClassName: "bg-warning-100/30 text-warning-200",
        iconClassName: "text-warning-200",
        duration: "Up to 90 days",
        description:
            "Remembers user preferences such as language, layout choices, and accessibility settings.",
    },
    {
        name: "Analytics",
        required: false,
        toneClassName: "bg-secondary-100/50 text-secondary",
        iconClassName: "text-secondary",
        duration: "Up to 1 year",
        description:
            "Helps us understand aggregated usage trends and improve platform performance.",
    },
    {
        name: "Marketing",
        required: false,
        toneClassName: "bg-primary-100/50 text-primary",
        iconClassName: "text-primary",
        duration: "Not currently in active use",
        description:
            "Reserved for future outreach experiences and would only be used with appropriate notice.",
    },
]

function PolicySectionIntro({ activeTab }: { activeTab: TabKey }) {
    const active = tabs.find((tab) => tab.key === activeTab)

    return (
        <div className="flex flex-col gap-2">
            <h5 className="text-neutral-1000">{active?.label}</h5>
            <p className="max-w-3xl text-neutral-800">{active?.description}</p>
        </div>
    )
}

function TermsOfService() {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem variant="card" value="acceptance">
                <AccordionTrigger>Acceptance of Terms</AccordionTrigger>
                <AccordionContent>
                    By accessing or using the Sehetna platform, you agree to these Terms of Service
                    and to any related operational, privacy, or security notices published alongside
                    the service. If you are using the platform on behalf of an institution, you
                    represent that you are authorized to accept these terms for that institution.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="service-scope">
                <AccordionTrigger>Platform Scope and Intended Use</AccordionTrigger>
                <AccordionContent>
                    Sehetna provides environmental-health intelligence, risk forecasting, and
                    decision-support tools intended to support planning, research, and institutional
                    response workflows.
                    <br />
                    The platform does not replace clinical judgment, emergency medical advice, or
                    formal regulatory determinations. Users remain responsible for how they
                    interpret and operationalize insights.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="account-responsibilities">
                <AccordionTrigger>Accounts and User Responsibilities</AccordionTrigger>
                <AccordionContent>
                    <ul className="flex flex-col gap-1 text-neutral-800">
                        {[
                            "Maintain accurate account details and protect login credentials.",
                            "Use the platform only for lawful and authorized purposes.",
                            "Avoid attempts to reverse engineer, disrupt, scrape, or overload the service.",
                            "Respect applicable confidentiality, procurement, and data-sharing obligations.",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-2">
                                <Dot />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="availability">
                <AccordionTrigger>Availability, Changes, and Support</AccordionTrigger>
                <AccordionContent>
                    We work to keep the platform reliable and secure, but availability may be
                    affected by maintenance, infrastructure events, data-source interruptions, or
                    product updates.
                    <br />
                    Sehetna may improve, suspend, or retire features when needed to preserve
                    platform quality, security, or compliance.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="intellectual-property">
                <AccordionTrigger>Intellectual Property and Content Use</AccordionTrigger>
                <AccordionContent>
                    The Sehetna platform, interface, documentation, and original analytical methods
                    remain protected intellectual property unless explicitly licensed otherwise.
                    <br />
                    Users may reference outputs for internal decision support, reporting, or
                    institutional analysis in line with their agreement and applicable law.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

function PrivacyPolicy() {
    return (
        <Accordion type="single" collapsible>
            <AccordionItem variant="card" value="data-collection">
                <AccordionTrigger>Data We Collect</AccordionTrigger>
                <AccordionContent>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {privacyCollectionItems.map((item) => {
                            const Icon = item.icon

                            return (
                                <div
                                    key={item.label}
                                    className="bg-primary-100/20 flex items-start gap-3 rounded-2xl p-4"
                                >
                                    <Icon size={14} className="text-primary mt-0.5 shrink-0" />
                                    <div className="flex flex-col gap-1">
                                        <div className="text-neutral-1000 text-xs font-semibold">
                                            {item.label}
                                        </div>
                                        <p className="text-xs text-neutral-700">{item.desc}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="data-usage">
                <AccordionTrigger>How We Use Your Data</AccordionTrigger>
                <AccordionContent>
                    <ul className="flex flex-col gap-1 text-neutral-800">
                        {[
                            "Provide and improve the platform and user experience.",
                            "Authenticate users and enforce role-based access controls.",
                            "Generate aggregated analytics, health intelligence views, and service diagnostics.",
                            "Deliver service updates, security notifications, and support communications.",
                            "Comply with legal, contractual, and audit-related obligations.",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-1">
                                <Dot />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="sharing-and-processors">
                <AccordionTrigger>Sharing and Processors</AccordionTrigger>
                <AccordionContent>
                    We may work with trusted infrastructure, hosting, authentication, and analytics
                    providers to operate the platform. These providers process data under
                    contractual and security controls appropriate to their role. <br />
                    We do not sell personal data, and we limit sharing to what is necessary for
                    platform delivery, support, and lawful compliance.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="retention">
                <AccordionTrigger>Data Retention</AccordionTrigger>
                <AccordionContent>
                    We retain data only for as long as required to fulfill the purposes described in
                    this policy, support legitimate operational needs, and satisfy legal
                    obligations. <br />
                    Retention periods may vary depending on account status, contractual
                    requirements, security events, and regulatory expectations.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="rights">
                <AccordionTrigger>Your Rights</AccordionTrigger>
                <AccordionContent>
                    <ul className="flex flex-col gap-1">
                        {[
                            "Request access to personal data associated with your account.",
                            "Correct inaccurate or incomplete information.",
                            "Request deletion where applicable and legally permissible.",
                            "Restrict or object to certain processing activities.",
                            "Request data portability when supported by applicable law.",
                        ].map((item) => (
                            <li key={item} className="flex items-center gap-1">
                                <Dot />
                                <span className="text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem variant="card" value="security">
                <AccordionTrigger>Security Measures</AccordionTrigger>
                <AccordionContent>
                    <div className="flex items-start gap-3">
                        <Lock size={15} className="text-primary mt-0.5 shrink-0" />
                        Sehetna uses layered safeguards such as encryption in transit and at rest,
                        role-based access controls, logging, and routine security review processes
                        designed to protect platform and user data.
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}

function CookiePolicy() {
    return (
        <div className="flex flex-col gap-6">
            <div className="bg-earth-100/40 flex items-start gap-3 rounded-2xl border p-4">
                <Cookie size={18} className="text-warning-200 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">What are cookies?</p>
                    <p className="text-xs text-neutral-800">
                        Cookies are small text files placed on your device by websites you visit.
                        They are widely used to make websites work efficiently, remember your
                        preferences, and provide anonymised analytics. Sehetna uses cookies
                        judiciously and transparently.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {cookieTypes.map((type) => (
                    <div key={type.name} className="home-surface rounded-2xl p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h6 className="text-neutral-1000 font-bold">{type.name}</h6>
                            <span
                                className={`text-2xs rounded-full px-2 py-0.5 font-semibold ${type.toneClassName}`}
                            >
                                {type.required ? "Required" : "Optional"}
                            </span>
                        </div>
                        <div className="mb-2 flex items-center gap-2">
                            <Clock size={11} className={type.iconClassName} />
                            <span className="text-2xs text-neutral-600">
                                Retention: {type.duration}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-800">{type.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function ServicesPoliciesPolicyTabs() {
    const [activeTab, setActiveTab] = useState<TabKey>("tos")

    const activeContent = useMemo(() => {
        if (activeTab === "privacy") return <PrivacyPolicy />
        if (activeTab === "cookies") return <CookiePolicy />
        return <TermsOfService />
    }, [activeTab])

    return (
        <SectionShell
            className="bg-background py-12 pb-0"
            containerClassName="max-w-4xl gap-8 lg:px-8"
        >
            <div className="bg-earth-300/15 flex gap-2 rounded-2xl p-1.5">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const active = activeTab === tab.key

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setActiveTab(tab.key)}
                            className={
                                active
                                    ? "bg-background text-neutral-1000 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-md shadow-black/5"
                                    : "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                            }
                        >
                            <Icon
                                size={14}
                                strokeWidth={1.5}
                                className={active ? "text-primary" : "text-current"}
                            />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.shortLabel}</span>
                        </button>
                    )
                })}
            </div>

            <motion.div
                key={activeTab}
                initial={fadeUp.initial}
                animate={fadeUp.whileInView}
                transition={{ duration: 0.4, ease: easeBehavior }}
                className="flex flex-col gap-6"
            >
                <PolicySectionIntro activeTab={activeTab} />
                {activeContent}
            </motion.div>
        </SectionShell>
    )
}
