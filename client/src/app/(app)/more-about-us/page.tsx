import { Metadata } from "next"

import { useRef } from "react"
import { motion, useInView } from "motion/react"
import {
    Quote,
    ArrowRight,
    Globe,
    Microscope,
    Brain,
    BarChart3,
    Users,
    Leaf,
    Star,
    Linkedin,
    Twitter,
} from "lucide-react"

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Sehetna, our goals, and how we aim to improve healthcare transparency and accessibility.",
    alternates: {
        canonical: "/more-about-us",
    },
}
/* ── Team Data ─────────────────────────────────────── */
const leader = {
    name: "Dr. Amina El-Rashidi",
    title: "Founder & Director of Research",
    affiliation: "Environmental Health Intelligence Lab",
    photo: "https://images.unsplash.com/photo-1588756872380-9449ff801aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwaGVhbHRoJTIwcmVzZWFyY2glMjBzY2llbnRpc3QlMjB3b21hbnxlbnwxfHx8fDE3NzQyMDY1NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    quote: "The boundary between climate science and public health has never been more urgent to dissolve. Sehetna exists because communities deserve to know what tomorrow's environment means for their bodies today.",
    bio: "Dr. El-Rashidi is an epidemiologist and environmental data scientist with 14 years of field research across the MENA region. She holds a doctorate in Climate-Health Systems from the American University in Cairo and has advised WHO Regional Offices on environmental risk frameworks. Her work fuses satellite earth observation, population health modelling, and machine learning into actionable insight for decision-makers.",
    tags: ["Epidemiology", "Earth Observation", "AI Ethics", "Public Policy"],
}

const team = [
    {
        name: "Karim Osman",
        title: "Lead AI Engineer",
        icon: Brain,
        color: "#8c5aff",
        bg: "#8c5aff12",
        photo: "https://images.unsplash.com/photo-1726842172813-55c6e284f8b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW50aXN0JTIwbWFuJTIwd29ya2luZyUyMHJlc2VhcmNofGVufDF8fHx8MTc3NDIwNjU1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
        quote: "Good models whisper; bad data shouts. We spend most of our time making the quiet signals audible.",
        focus: "Deep learning architectures for spatio-temporal risk forecasting.",
    },
    {
        name: "Salma Nour",
        title: "Senior Data Scientist",
        icon: BarChart3,
        color: "#c4a882",
        bg: "#c4a88212",
        photo: "https://images.unsplash.com/photo-1712174766230-cb7304feaafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGRhdGElMjBhbmFseXN0JTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc0MjA2NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        quote: "I came for the data, but I stayed for the chance to show a ministry a map that might save lives.",
        focus: "Feature engineering, model validation, and uncertainty quantification.",
    },
    {
        name: "Dr. Yusuf Baraka",
        title: "Environmental Scientist",
        icon: Leaf,
        color: "#6b8e7a",
        bg: "#6b8e7a12",
        photo: "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzY2llbnRpc3QlMjBlcGlkZW1pb2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3NDIwNjU2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        quote: "Nature never hides its signals. We just need to learn how to read them in the right units.",
        focus: "Remote sensing integration, environmental indicator design, and field validation.",
    },
    {
        name: "Hana Boutros",
        title: "Health Systems Analyst",
        icon: Users,
        color: "#ff5c02",
        bg: "#ff5c0212",
        photo: "https://images.unsplash.com/photo-1618053448748-b7251851d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlc2VhcmNoZXIlMjBzY2llbnRpc3QlMjBwb3J0cmFpdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzQyMDY1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080",
        quote: "The technology is only as useful as the policy change it enables. We track the whole chain.",
        focus: "Institutional partnerships, use-case design, and policy translation.",
    },
]

const values = [
    {
        icon: Microscope,
        title: "Scientific Integrity",
        desc: "Every claim is anchored in peer-reviewed methodology. We publish our model limitations as prominently as our results.",
        color: "#6b8e7a",
    },
    {
        icon: Globe,
        title: "Equitable Impact",
        desc: "We prioritise underserved regions with high environmental burden and limited health infrastructure in our data and partnerships.",
        color: "#c4a882",
    },
    {
        icon: Brain,
        title: "Explainable AI",
        desc: "No black-box outputs. Every prediction comes with interpretable drivers that institutional users can interrogate and audit.",
        color: "#8c5aff",
    },
    {
        icon: Star,
        title: "Institutional Humility",
        desc: "Our forecasts support, not replace, human judgment. We design every tool assuming the expert in the room knows more than the model.",
        color: "#ff5c02",
    },
]

const milestones = [
    { year: "2019", event: "Research programme launched at AUC with WHO seed grant." },
    {
        year: "2021",
        event: "First validated multi-disease risk model deployed in Upper Egypt pilot.",
    },
    {
        year: "2022",
        event: "Sehetna formalised as a scientific analytics platform. Partnership with ECMWF.",
    },
    {
        year: "2023",
        event: "Expanded to 6 MENA countries. 2 published papers in Nature Climate Change.",
    },
    {
        year: "2024",
        event: "Introduced scenario simulation engine and real-time alert infrastructure.",
    },
    {
        year: "2025",
        event: "Sehetna adopted by 3 national Ministries of Health as decision-support tool.",
    },
    { year: "2026", event: "Public platform launch with expanded open-access data explorer." },
]

/* ── Components ──────────────────────────────────────── */

function TeamMemberCard({ member, index }: { member: (typeof team)[0]; index: number }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: "-40px" })
    const Icon = member.icon

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className="group overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-md shadow-black/5 backdrop-blur-xl transition-all duration-400 hover:-translate-y-1 hover:shadow-lg"
        >
            {/* Photo */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div
                    className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: member.bg, border: `1px solid ${member.color}30` }}
                >
                    <Icon size={16} style={{ color: member.color, strokeWidth: 1.5 }} />
                </div>
            </div>

            {/* Info */}
            <div className="p-5">
                <h3
                    className="text-base text-[#222]"
                    style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                >
                    {member.name}
                </h3>
                <p className="mt-0.5 mb-3 text-xs font-medium" style={{ color: member.color }}>
                    {member.title}
                </p>

                {/* Quote */}
                <div className="relative mb-3">
                    <Quote
                        size={16}
                        className="absolute -top-1 -left-1 opacity-20"
                        style={{ color: member.color }}
                        strokeWidth={1.5}
                    />
                    <p className="pl-4 text-xs leading-relaxed text-[#606060] italic">
                        {member.quote}
                    </p>
                </div>

                <p className="border-t border-[#f0ece8] pt-3 text-xs text-[#8e8e8e]">
                    {member.focus}
                </p>
            </div>
        </motion.div>
    )
}

export default function MoreAboutUsPage() {
    const heroRef = useRef(null)
    const leaderRef = useRef(null)
    const leaderInView = useInView(leaderRef, { once: true, margin: "-60px" })

    return (
        <main className="bg-[#faf9f7]">
            {/* Hero */}
            <section
                className="relative overflow-hidden pt-40 pb-24"
                style={{
                    background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 50%, #f0f4f1 100%)",
                }}
            >
                <div className="pointer-events-none absolute -top-40 -right-20 h-[600px] w-[700px] rounded-full bg-gradient-to-bl from-[#ff5c02]/6 via-[#c4a882]/8 to-transparent blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #222 1px, transparent 0)",
                        backgroundSize: "44px 44px",
                    }}
                />

                <div ref={heroRef} className="relative mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e8e8e8] bg-white/80 px-4 py-2 shadow-sm backdrop-blur-xl">
                                <Users size={13} className="text-[#ff5c02]" strokeWidth={2} />
                                <span className="text-xs font-semibold text-[#606060]">
                                    The People Behind Sehetna
                                </span>
                            </div>
                            <h1
                                className="mb-6 text-5xl leading-[1.06] text-[#222222] lg:text-6xl"
                                style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                            >
                                Science Is a{" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #ff5c02, #c4a882)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    Team Sport
                                </span>
                            </h1>
                            <p className="mb-8 max-w-lg text-base leading-relaxed text-[#606060]">
                                Sehetna brings together epidemiologists, AI engineers, environmental
                                scientists, and health policy analysts — united by a shared
                                conviction that environmental data should prevent suffering, not
                                merely describe it.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { val: "4", label: "Core Researchers" },
                                    { val: "14+", label: "Years Combined Field Work" },
                                    { val: "6", label: "Countries Active" },
                                ].map((s) => (
                                    <div
                                        key={s.label}
                                        className="rounded-2xl border border-[#e8e8e8] bg-white/70 px-5 py-3 text-center backdrop-blur-xl"
                                    >
                                        <div
                                            className="text-2xl text-[#222]"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                fontWeight: 700,
                                            }}
                                        >
                                            {s.val}
                                        </div>
                                        <div className="mt-0.5 text-xs text-[#8e8e8e]">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Decorative team mosaic */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="hidden grid-cols-2 gap-3 lg:grid"
                        >
                            {[leader, ...team].map((m, i) => (
                                <div
                                    key={m.name}
                                    className={`relative overflow-hidden rounded-3xl ${
                                        i === 0 ? "col-span-2 h-48" : "h-36"
                                    }`}
                                >
                                    <img
                                        src={m.photo}
                                        alt={m.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-2.5 left-3">
                                        <p className="text-xs font-semibold text-white">{m.name}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Leader Feature */}
            <section className="relative overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-14 flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-[#ff5c02]" />
                        <span className="text-xs font-semibold tracking-widest text-[#ff5c02] uppercase">
                            Leadership
                        </span>
                        <div className="h-px w-8 bg-[#ff5c02]" />
                    </div>

                    <motion.div
                        ref={leaderRef}
                        initial={{ opacity: 0, y: 32 }}
                        animate={leaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="grid items-center gap-12 lg:grid-cols-2"
                    >
                        {/* Photo */}
                        <div className="relative">
                            <div className="relative mx-auto aspect-[4/5] max-w-sm overflow-hidden rounded-4xl shadow-2xl shadow-black/10 lg:mx-0">
                                <img
                                    src={leader.photo}
                                    alt={leader.name}
                                    className="h-full w-full object-cover"
                                />
                                {/* Decorative overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0e00]/60 via-transparent to-transparent" />
                                <div className="absolute right-6 bottom-6 left-6">
                                    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                                        <p className="text-sm font-semibold text-white">
                                            {leader.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-white/70">
                                            {leader.title}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {leader.affiliation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative blob */}
                            <div className="absolute -bottom-8 -left-8 -z-10 h-64 w-64 rounded-full bg-gradient-to-br from-[#ff5c02]/10 to-transparent blur-3xl" />
                        </div>

                        {/* Text */}
                        <div>
                            {/* Giant quote */}
                            <div className="relative mb-8">
                                <Quote
                                    size={56}
                                    className="absolute -top-4 -left-2 text-[#ff5c02]/15"
                                    strokeWidth={1}
                                />
                                <blockquote
                                    className="pl-4 text-2xl leading-[1.35] text-[#222] lg:text-3xl"
                                    style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                                >
                                    {leader.quote}
                                </blockquote>
                                <div
                                    className="mt-4 ml-4 h-0.5 w-12"
                                    style={{
                                        background: "linear-gradient(90deg, #ff5c02, transparent)",
                                    }}
                                />
                            </div>

                            <p className="mb-6 text-sm leading-relaxed text-[#606060]">
                                {leader.bio}
                            </p>

                            {/* Tags */}
                            <div className="mb-6 flex flex-wrap gap-2">
                                {leader.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full border border-[#ff5c02]/15 bg-[#ff5c02]/8 px-3 py-1.5 text-xs font-medium text-[#ff5c02]"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Social */}
                            <div className="flex items-center gap-3">
                                <button className="group flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0eb] transition-colors hover:bg-[#ff5c02]/10">
                                    <Linkedin
                                        size={15}
                                        className="text-[#8e8e8e] transition-colors group-hover:text-[#ff5c02]"
                                        strokeWidth={1.5}
                                    />
                                </button>
                                <button className="group flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0eb] transition-colors hover:bg-[#ff5c02]/10">
                                    <Twitter
                                        size={15}
                                        className="text-[#8e8e8e] transition-colors group-hover:text-[#ff5c02]"
                                        strokeWidth={1.5}
                                    />
                                </button>
                                <button className="group flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f0eb] transition-colors hover:bg-[#ff5c02]/10">
                                    <Globe
                                        size={15}
                                        className="text-[#8e8e8e] transition-colors group-hover:text-[#ff5c02]"
                                        strokeWidth={1.5}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Team */}
            <section
                className="relative overflow-hidden py-24 lg:py-32"
                style={{ background: "linear-gradient(160deg, #f5f0eb 0%, #faf9f7 100%)" }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <div className="mb-5 flex items-center justify-center gap-2">
                            <div className="h-px w-8 bg-[#6b8e7a]" />
                            <span className="text-xs font-semibold tracking-widest text-[#6b8e7a] uppercase">
                                The Team
                            </span>
                            <div className="h-px w-8 bg-[#6b8e7a]" />
                        </div>
                        <h2
                            className="text-4xl text-[#222] lg:text-5xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            Minds Behind the Models
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {team.map((member, i) => (
                            <TeamMemberCard key={member.name} member={member} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="relative overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent" />
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <div className="mb-5 flex items-center justify-center gap-2">
                            <div className="h-px w-8 bg-[#c4a882]" />
                            <span className="text-xs font-semibold tracking-widest text-[#c4a882] uppercase">
                                What We Stand For
                            </span>
                            <div className="h-px w-8 bg-[#c4a882]" />
                        </div>
                        <h2
                            className="text-4xl text-[#222] lg:text-5xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            Our Core Values
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((v, i) => {
                            const Icon = v.icon
                            return (
                                <motion.div
                                    key={v.title}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className="rounded-3xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-xl transition-all hover:shadow-md"
                                >
                                    <div
                                        className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                                        style={{ backgroundColor: `${v.color}15` }}
                                    >
                                        <Icon
                                            size={20}
                                            style={{ color: v.color, strokeWidth: 1.5 }}
                                        />
                                    </div>
                                    <h3
                                        className="mb-2 text-sm text-[#222]"
                                        style={{
                                            fontFamily: "var(--font-heading)",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {v.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-[#606060]">
                                        {v.desc}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section
                className="relative overflow-hidden py-24 lg:py-32"
                style={{ background: "linear-gradient(160deg, #f0f4f1 0%, #faf9f7 100%)" }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent" />
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <div className="mb-5 flex items-center justify-center gap-2">
                            <div className="h-px w-8 bg-[#6b8e7a]" />
                            <span className="text-xs font-semibold tracking-widest text-[#6b8e7a] uppercase">
                                Our Journey
                            </span>
                            <div className="h-px w-8 bg-[#6b8e7a]" />
                        </div>
                        <h2
                            className="text-4xl text-[#222] lg:text-5xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            From Research to Platform
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute top-0 bottom-0 left-[calc(theme(spacing.20)+1px)] hidden w-px bg-gradient-to-b from-[#c4a882]/30 via-[#6b8e7a]/30 to-transparent sm:block" />

                        <div className="flex flex-col gap-6">
                            {milestones.map((m, i) => (
                                <motion.div
                                    key={m.year}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-30px" }}
                                    transition={{ duration: 0.6, delay: i * 0.08 }}
                                    className="flex items-start gap-6"
                                >
                                    <div className="w-20 flex-shrink-0 text-right">
                                        <span
                                            className="text-sm font-bold"
                                            style={{
                                                fontFamily: "var(--font-heading)",
                                                color:
                                                    i === milestones.length - 1
                                                        ? "#ff5c02"
                                                        : "#c4a882",
                                            }}
                                        >
                                            {m.year}
                                        </span>
                                    </div>
                                    {/* Dot */}
                                    <div className="relative hidden flex-shrink-0 items-center justify-center sm:flex">
                                        <div
                                            className="h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm"
                                            style={{
                                                backgroundColor:
                                                    i === milestones.length - 1
                                                        ? "#ff5c02"
                                                        : "#c4a882",
                                                marginTop: "3px",
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 pb-0">
                                        <div
                                            className={`rounded-2xl border border-white/80 bg-white/60 px-5 py-3.5 shadow-sm backdrop-blur-xl ${
                                                i === milestones.length - 1
                                                    ? "border-[#ff5c02]/20 bg-[#ff5c02]/5"
                                                    : ""
                                            }`}
                                        >
                                            <p className="text-sm leading-relaxed text-[#4a4a4a]">
                                                {m.event}
                                            </p>
                                            {i === milestones.length - 1 && (
                                                <span className="text-2xs mt-2 inline-flex items-center gap-1 rounded-full bg-[#ff5c02]/10 px-2.5 py-0.5 font-semibold text-[#ff5c02]">
                                                    <span className="h-1 w-1 animate-pulse rounded-full bg-[#ff5c02]" />
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section
                className="relative overflow-hidden py-24 lg:py-32"
                style={{ background: "linear-gradient(160deg, #faf9f7 0%, #f5f0eb 100%)" }}
            >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8e8e8] to-transparent" />
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div
                            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
                            style={{ background: "linear-gradient(135deg, #ff5c02, #ff752a)" }}
                        >
                            <Users size={26} className="text-white" strokeWidth={1.5} />
                        </div>
                        <h2
                            className="mb-5 text-4xl leading-[1.1] text-[#222] lg:text-5xl"
                            style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}
                        >
                            Want to Work With Us?
                        </h2>
                        <p className="mb-8 text-base leading-relaxed text-[#606060]">
                            We actively seek institutional partners, research collaborators, and
                            domain experts who share our conviction that environmental data can
                            become public health foresight.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <a
                                href="/methodology"
                                className="flex items-center gap-2.5 rounded-2xl px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                                style={{
                                    background: "linear-gradient(135deg, #ff5c02, #ff752a)",
                                    boxShadow: "0 10px 30px rgba(255,92,2,0.25)",
                                }}
                            >
                                Explore Our Methods
                                <ArrowRight size={16} strokeWidth={1.5} />
                            </a>
                            <a
                                href="/support/contact-us"
                                className="flex items-center gap-2.5 rounded-2xl border border-[#e8e8e8] bg-white/80 px-8 py-4 text-sm font-semibold text-[#4a4a4a] shadow-sm backdrop-blur-xl transition-all hover:border-[#ff5c02]/30"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    )
}
