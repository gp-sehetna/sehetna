"use client"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Services & Policies",
    description: "Review Sehetna's terms of service, privacy policy, and cookie usage guidelines.",
    alternates: {
        canonical: "/support/services-and-policies",
    },
}

import { useState } from "react"
import { motion } from "motion/react"
import {
    FileText,
    Shield,
    Cookie,
    ChevronDown,
    ChevronRight,
    Lock,
    Eye,
    Server,
    UserCheck,
    AlertTriangle,
    Mail,
    Globe,
    Clock,
} from "lucide-react"

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
    accentColor = "#6b8e7a",
}: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
    accentColor?: string
}) {
    const [open, setOpen] = useState(defaultOpen)
    return (
        <div className="overflow-hidden rounded-2xl border border-[#e8e8e8]/80 bg-white/60 backdrop-blur-sm">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[#f5f0eb]/40"
            >
                <span
                    className="text-sm text-[#222]"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}
                >
                    {title}
                </span>
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
                <div className="border-t border-[#f0ece8] px-6 pb-5 text-sm leading-relaxed text-[#606060]">
                    <div className="pt-4">{children}</div>
                </div>
            </motion.div>
        </div>
    )
}

function TermsOfService() {
    return (
        <div className="flex flex-col gap-4">
            <AccordionItem title="1. Acceptance of Terms" defaultOpen accentColor="#ff5c02">
                <p>
                    By accessing or using the Sehetna analytics platform ("Platform"), you agree to
                    be bound by these Terms of Service ("Terms"). If you disagree with any part of
                    the Terms, you may not access the Platform.
                </p>
                <p className="mt-3">
                    These Terms apply to all visitors, users, and others who access or use the
                    Platform. Sehetna reserves the right to modify these Terms at any time, with
                    notice provided via in-Platform notifications or email.
                </p>
            </AccordionItem>

            <AccordionItem title="2. Permitted Use & Restrictions" accentColor="#ff5c02">
                <p>
                    The Platform is intended for use by authorised institutional users, including
                    public health departments, research institutions, municipal authorities, and
                    non-governmental health organisations. You agree to use the Platform solely for
                    lawful decision-support purposes aligned with public health improvement
                    objectives.
                </p>
                <ul className="mt-3 space-y-2">
                    {[
                        "You may not use outputs as a substitute for professional medical diagnosis or clinical decision-making.",
                        "Redistribution or resale of Platform data, risk outputs, or predictions without written permission is prohibited.",
                        "Automated scraping, bulk data extraction, or reverse engineering of the Platform's AI models is not permitted.",
                        "You must not attempt to circumvent access controls or probe for system vulnerabilities.",
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#ff5c02]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </AccordionItem>

            <AccordionItem title="3. Intellectual Property" accentColor="#ff5c02">
                <p>
                    The Platform, including all code, AI models, data visualisations, methodological
                    frameworks, and design assets, are the intellectual property of Sehetna and its
                    licensors. No part of the Platform may be reproduced, distributed, or
                    transmitted in any form without prior written consent.
                </p>
                <p className="mt-3">
                    Environmental datasets sourced from third-party providers (e.g., NASA EarthData,
                    ECMWF) are subject to their respective open-data licences. Users are responsible
                    for complying with those terms when using derived outputs.
                </p>
            </AccordionItem>

            <AccordionItem title="4. Disclaimers & Limitation of Liability" accentColor="#ff5c02">
                <p>
                    Sehetna provides probabilistic health risk forecasts based on environmental and
                    climatic data. All predictions carry inherent uncertainty and should be
                    interpreted in the context of domain expertise. The Platform does not guarantee
                    the accuracy, completeness, or fitness of any output for a specific purpose.
                </p>
                <div className="mt-3 rounded-xl border border-[#ff5c02]/20 bg-[#fff5f0] p-4">
                    <div className="flex items-start gap-2.5">
                        <AlertTriangle
                            size={15}
                            className="mt-0.5 flex-shrink-0 text-[#ff5c02]"
                            strokeWidth={1.5}
                        />
                        <p className="text-xs">
                            To the maximum extent permitted by applicable law, Sehetna shall not be
                            liable for any indirect, incidental, special, or consequential damages
                            arising from reliance on Platform outputs, including decisions affecting
                            public health resource allocation.
                        </p>
                    </div>
                </div>
            </AccordionItem>

            <AccordionItem title="5. Governing Law" accentColor="#ff5c02">
                <p>
                    These Terms shall be governed by and construed in accordance with applicable
                    international law and the jurisdiction in which Sehetna is registered. Disputes
                    shall be resolved through binding arbitration before recourse to courts of law.
                </p>
            </AccordionItem>

            <AccordionItem title="6. Contact & Notices" accentColor="#ff5c02">
                <p>
                    For questions regarding these Terms, please contact our legal team at{" "}
                    <span className="font-medium text-[#ff5c02]">legal@sehetna.org</span>. Formal
                    notices must be submitted in writing to our registered address.
                </p>
            </AccordionItem>
        </div>
    )
}

function PrivacyPolicy() {
    return (
        <div className="flex flex-col gap-4">
            <AccordionItem title="1. Data We Collect" defaultOpen accentColor="#6b8e7a">
                <p>We collect the following categories of information:</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[
                        {
                            icon: UserCheck,
                            label: "Account Data",
                            desc: "Name, institutional email, role, and organisation affiliation provided at registration.",
                        },
                        {
                            icon: Server,
                            label: "Usage Data",
                            desc: "Page views, feature interactions, query parameters, and session durations collected via server logs.",
                        },
                        {
                            icon: Globe,
                            label: "Environmental Queries",
                            desc: "Geographic coordinates, date ranges, and disease categories selected during Platform sessions.",
                        },
                        {
                            icon: Eye,
                            label: "Device & Browser",
                            desc: "IP address, browser type, OS, screen resolution, and referral URLs for security and analytics.",
                        },
                    ].map((item) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.label}
                                className="flex items-start gap-3 rounded-xl bg-[#f0f4f1]/60 p-3"
                            >
                                <Icon
                                    size={14}
                                    className="mt-0.5 flex-shrink-0 text-[#6b8e7a]"
                                    strokeWidth={1.5}
                                />
                                <div>
                                    <div className="mb-0.5 text-xs font-semibold text-[#222]">
                                        {item.label}
                                    </div>
                                    <p className="text-xs text-[#777]">{item.desc}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </AccordionItem>

            <AccordionItem title="2. How We Use Your Data" accentColor="#6b8e7a">
                <p>We process collected data for the following purposes:</p>
                <ul className="mt-3 space-y-2">
                    {[
                        "Providing, maintaining, and improving the Platform's core functionality.",
                        "Authenticating users and enforcing access controls for institutional accounts.",
                        "Generating aggregated, anonymised usage analytics to improve model and UX performance.",
                        "Sending service-related notifications (alerts, updates, maintenance windows).",
                        "Complying with legal obligations and responding to lawful requests from authorities.",
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <div className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-[#6b8e7a]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-3">
                    We do not sell, rent, or trade personal data to third parties for commercial
                    purposes under any circumstances.
                </p>
            </AccordionItem>

            <AccordionItem title="3. Data Retention" accentColor="#6b8e7a">
                <p>
                    Account data is retained for the duration of the institutional subscription,
                    plus 90 days following account termination, after which it is permanently
                    purged. Usage logs are retained for 12 months for security auditing and then
                    anonymised for longitudinal analytics. Environmental query histories are
                    retained for 6 months by default, configurable per user.
                </p>
            </AccordionItem>

            <AccordionItem title="4. Your Rights" accentColor="#6b8e7a">
                <p>Subject to applicable data protection legislation, you have the right to:</p>
                <ul className="mt-3 space-y-2">
                    {[
                        "Access a copy of the personal data we hold about you.",
                        "Correct inaccurate or incomplete data.",
                        "Request erasure of your data (right to be forgotten).",
                        "Object to or restrict certain processing activities.",
                        "Data portability — receive your data in a structured, machine-readable format.",
                    ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                            <ChevronRight size={12} className="mt-1 flex-shrink-0 text-[#6b8e7a]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="mt-3">
                    To exercise any of these rights, contact{" "}
                    <span className="font-medium text-[#6b8e7a]">privacy@sehetna.org</span>.
                </p>
            </AccordionItem>

            <AccordionItem title="5. Data Security" accentColor="#6b8e7a">
                <div className="mb-3 flex items-start gap-3">
                    <Lock
                        size={15}
                        className="mt-0.5 flex-shrink-0 text-[#6b8e7a]"
                        strokeWidth={1.5}
                    />
                    <p>
                        Sehetna implements AES-256 encryption at rest, TLS 1.3 in transit,
                        role-based access control, and regular penetration testing. Our
                        infrastructure is hosted on ISO 27001-certified cloud providers. Despite
                        these measures, no system is impenetrable; we cannot guarantee absolute
                        security.
                    </p>
                </div>
            </AccordionItem>

            <AccordionItem title="6. International Transfers" accentColor="#6b8e7a">
                <p>
                    Data may be processed in data centres located outside your home jurisdiction.
                    All cross-border transfers are conducted under Standard Contractual Clauses
                    (SCCs) or equivalent approved transfer mechanisms to ensure equivalent data
                    protection standards.
                </p>
            </AccordionItem>
        </div>
    )
}

function CookiePolicy() {
    const cookieTypes = [
        {
            name: "Strictly Necessary",
            required: true,
            color: "#6b8e7a",
            desc: "Essential for the Platform to function. Includes authentication tokens, CSRF protection cookies, and session management.",
            examples: ["sehetna_session", "csrf_token", "auth_refresh"],
            duration: "Session / 7 days",
        },
        {
            name: "Functional",
            required: false,
            color: "#c4a882",
            desc: "Remember your preferences such as selected region, dashboard layout, and language settings for improved personalisation.",
            examples: ["user_prefs", "region_cache", "theme_mode"],
            duration: "90 days",
        },
        {
            name: "Analytics",
            required: false,
            color: "#8c5aff",
            desc: "Collect aggregated, anonymised data about Platform usage via Plausible Analytics (a privacy-first, GDPR-compliant tool).",
            examples: ["plausible_id", "session_count"],
            duration: "1 year",
        },
        {
            name: "Marketing",
            required: false,
            color: "#ff5c02",
            desc: "Currently not used. Sehetna does not deploy third-party advertising or behavioural tracking cookies.",
            examples: ["None deployed"],
            duration: "N/A",
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-[#e8e8e8] bg-[#f5f0eb]/60 p-5">
                <div className="flex items-start gap-3">
                    <Cookie
                        size={18}
                        className="mt-0.5 flex-shrink-0 text-[#c4a882]"
                        strokeWidth={1.5}
                    />
                    <div>
                        <h4
                            className="mb-1 text-sm text-[#222]"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            What Are Cookies?
                        </h4>
                        <p className="text-xs leading-relaxed text-[#606060]">
                            Cookies are small text files placed on your device by websites you
                            visit. They are widely used to make websites work efficiently, remember
                            your preferences, and provide anonymised analytics. Sehetna uses cookies
                            judiciously and transparently.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {cookieTypes.map((type) => (
                    <div
                        key={type.name}
                        className="rounded-2xl border border-white/80 bg-white/60 p-5 shadow-sm backdrop-blur-sm"
                    >
                        <div className="mb-3 flex items-center justify-between">
                            <h4
                                className="text-sm text-[#222]"
                                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                            >
                                {type.name}
                            </h4>
                            <span
                                className="text-2xs rounded-full px-2 py-0.5 font-semibold"
                                style={{
                                    backgroundColor: `${type.color}15`,
                                    color: type.color,
                                }}
                            >
                                {type.required ? "Required" : "Optional"}
                            </span>
                        </div>
                        <p className="mb-3 text-xs leading-relaxed text-[#606060]">{type.desc}</p>
                        <div className="mb-2 flex items-center gap-2">
                            <Clock size={11} style={{ color: type.color }} strokeWidth={1.5} />
                            <span className="text-2xs text-[#8e8e8e]">
                                Retention: {type.duration}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {type.examples.map((ex) => (
                                <span
                                    key={ex}
                                    className="text-2xs rounded-md px-2 py-0.5 font-mono"
                                    style={{
                                        backgroundColor: `${type.color}10`,
                                        color: type.color,
                                    }}
                                >
                                    {ex}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <AccordionItem
                title="Managing Your Cookie Preferences"
                defaultOpen
                accentColor="#c4a882"
            >
                <p>
                    You can manage or withdraw consent for non-essential cookies at any time via the
                    cookie preferences panel in your account settings. You may also configure your
                    browser to block or delete cookies; however, this may affect Platform
                    functionality.
                </p>
                <p className="mt-3">
                    Sehetna respects Do Not Track (DNT) browser signals and disables all optional
                    tracking when DNT is detected. For more information, contact{" "}
                    <span className="font-medium text-[#c4a882]">privacy@sehetna.org</span>.
                </p>
            </AccordionItem>
        </div>
    )
}

export default function ServicesAndPolicies() {
    const [activeTab, setActiveTab] = useState<TabKey>("tos")

    return (
        <main className="min-h-screen bg-[#faf9f7]">
            {/* Hero */}
            <section
                className="relative overflow-hidden pt-40 pb-16"
                style={{
                    background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 60%, #f0f4f1 100%)",
                }}
            >
                <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[500px] rounded-full bg-gradient-to-bl from-[#6b8e7a]/10 to-transparent blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #222 1px, transparent 0)",
                        backgroundSize: "36px 36px",
                    }}
                />
                <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl">
                            <Shield size={13} className="text-[#6b8e7a]" strokeWidth={2} />
                            <span className="text-xs font-semibold text-[#606060]">
                                Legal & Governance
                            </span>
                        </div>
                        <h1
                            className="mb-5 text-5xl leading-[1.06] text-[#222222] lg:text-6xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            Services & Policies
                        </h1>
                        <p className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-[#606060]">
                            Sehetna is committed to transparency in how we operate, handle data, and
                            protect user rights. Review our governing documents below.
                        </p>
                        <div className="mt-2 flex items-center justify-center gap-1.5">
                            <Clock size={12} className="text-[#a4a4a4]" strokeWidth={1.5} />
                            <span className="text-xs text-[#a4a4a4]">
                                Last updated: March 22, 2026
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="relative py-12 pb-24">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    {/* Tab switcher */}
                    <div className="mb-8 flex gap-2 rounded-2xl border border-[#e8e8e8] bg-white/60 p-1.5 shadow-sm backdrop-blur-xl">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                        activeTab === tab.key
                                            ? "bg-white text-[#222] shadow-md shadow-black/5"
                                            : "text-[#8e8e8e] hover:text-[#4a4a4a]"
                                    }`}
                                >
                                    <Icon
                                        size={14}
                                        strokeWidth={1.5}
                                        className={
                                            activeTab === tab.key
                                                ? "text-[#6b8e7a]"
                                                : "text-current"
                                        }
                                    />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Tab content */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Section heading */}
                        <div className="mb-6 flex items-center gap-3">
                            {(() => {
                                const tab = tabs.find((t) => t.key === activeTab)!
                                const Icon = tab.icon
                                return (
                                    <>
                                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6b8e7a]/12">
                                            <Icon
                                                size={17}
                                                style={{ color: "#6b8e7a", strokeWidth: 1.5 }}
                                            />
                                        </div>
                                        <h2
                                            className="text-xl text-[#222]"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {tab.label}
                                        </h2>
                                    </>
                                )
                            })()}
                        </div>

                        {activeTab === "tos" && <TermsOfService />}
                        {activeTab === "privacy" && <PrivacyPolicy />}
                        {activeTab === "cookies" && <CookiePolicy />}
                    </motion.div>

                    {/* Contact banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-[#e8e8e8] bg-gradient-to-r from-[#f5f0eb] to-[#f0f4f1] p-6 sm:flex-row"
                    >
                        <div className="flex-1">
                            <h4
                                className="mb-1 text-sm text-[#222]"
                                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                            >
                                Questions about our policies?
                            </h4>
                            <p className="text-xs text-[#606060]">
                                Our compliance team is available to address institutional queries,
                                data processing agreements, and legal concerns.
                            </p>
                        </div>
                        <a
                            href="mailto:legal@sehetna.org"
                            className="flex flex-shrink-0 items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                            style={{
                                background: "linear-gradient(135deg, #6b8e7a, #8aae9a)",
                                boxShadow: "0 6px 20px rgba(107,142,122,0.25)",
                            }}
                        >
                            <Mail size={14} strokeWidth={1.5} />
                            Contact Legal Team
                        </a>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
