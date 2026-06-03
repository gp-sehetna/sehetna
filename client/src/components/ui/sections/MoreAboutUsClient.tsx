"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import {
    ArrowRight,
    BarChart3,
    Brain,
    Globe,
    Leaf,
    Microscope,
    Quote,
    Star,
    Users,
} from "lucide-react"
import Texture from "@/components/ui/textures"
import Divider from "@/components/ui/GlobalControls/Divider"
import Gradient from "@/components/ui/GlobalComponents/extras/gradient"
import SectionHeading from "./SectionHeading"

const leader = {
    name: "Dr. Amina El-Rashidi",
    title: "Founder & Director of Research",
    affiliation: "Environmental Health Intelligence Lab",
    photo: "https://images.unsplash.com/photo-1588756872380-9449ff801aee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    quote: "Sehetna exists because communities deserve to know what tomorrow's environment means for their bodies today.",
    bio: "Dr. El-Rashidi is an epidemiologist and environmental data scientist whose work spans climate-health systems, satellite observation, and institutional decision support across the MENA region.",
    tags: ["Epidemiology", "Earth observation", "AI ethics", "Public policy"],
}

const team = [
    {
        name: "Karim Osman",
        title: "Lead AI Engineer",
        icon: Brain,
        accent: "text-secondary-300",
        surface: "bg-secondary-100/40",
        photo: "https://images.unsplash.com/photo-1726842172813-55c6e284f8b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        focus: "Spatio-temporal forecasting systems.",
    },
    {
        name: "Salma Nour",
        title: "Senior Data Scientist",
        icon: BarChart3,
        accent: "text-warning-200",
        surface: "bg-warning-100/20",
        photo: "https://images.unsplash.com/photo-1712174766230-cb7304feaafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        focus: "Feature engineering and uncertainty analysis.",
    },
    {
        name: "Dr. Yusuf Baraka",
        title: "Environmental Scientist",
        icon: Leaf,
        accent: "text-success",
        surface: "bg-success-100/20",
        photo: "https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        focus: "Remote sensing and field validation.",
    },
    {
        name: "Hana Boutros",
        title: "Health Systems Analyst",
        icon: Users,
        accent: "text-primary",
        surface: "bg-primary-100/30",
        photo: "https://images.unsplash.com/photo-1618053448748-b7251851d014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        focus: "Partnerships, translation, and policy design.",
    },
]

const values = [
    {
        icon: Microscope,
        title: "Scientific integrity",
        text: "We foreground evidence, limits, and reproducibility.",
        accent: "text-success",
        surface: "bg-success-100/20",
    },
    {
        icon: Globe,
        title: "Equitable impact",
        text: "We prioritise regions facing high environmental burden and low institutional visibility.",
        accent: "text-warning-200",
        surface: "bg-warning-100/20",
    },
    {
        icon: Brain,
        title: "Explainable AI",
        text: "Predictions should come with interpretable signals, not black-box authority.",
        accent: "text-secondary-300",
        surface: "bg-secondary-100/40",
    },
    {
        icon: Star,
        title: "Institutional humility",
        text: "Our tools support domain experts rather than replacing them.",
        accent: "text-primary",
        surface: "bg-primary-100/30",
    },
]

export default function MoreAboutUsClient() {
    return (
        <main className="bg-primary-50">
            <section className="relative overflow-hidden py-24">
                <Texture texture="dots" />
                <div className="from-primary-100/50 via-warning-100/40 pointer-events-none absolute -top-32 -right-16 h-96 w-136 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
                <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
                    <div className="flex flex-col gap-6">
                        <div className="bg-background/80 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 shadow-sm backdrop-blur-xl">
                            <Users size={13} className="text-primary" strokeWidth={2} />
                            <span className="text-xs font-semibold text-neutral-800">
                                The people behind Sehetna
                            </span>
                        </div>
                        <h1>
                            Science is a{" "}
                            <span className="from-primary to-warning-200 bg-linear-to-r bg-clip-text text-6xl text-transparent">
                                team sport
                            </span>
                        </h1>
                        <p className="max-w-2xl text-lg text-neutral-800">
                            Sehetna brings together researchers, engineers, and policy practitioners
                            who believe environmental intelligence should improve public-health
                            decisions before harm escalates.
                        </p>
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                ["4", "Core researchers"],
                                ["14+", "Years of field work"],
                                ["6", "Countries active"],
                            ].map(([value, label]) => (
                                <div
                                    key={label}
                                    className="bg-background/70 rounded-2xl border px-5 py-4 text-center backdrop-blur-xl"
                                >
                                    <div className="text-neutral-1000 text-3xl">{value}</div>
                                    <div className="text-xs text-neutral-600">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {[leader, ...team].map((member, index) => (
                            <div
                                key={member.name}
                                className={`relative overflow-hidden rounded-3xl ${index === 0 ? "col-span-2 h-52" : "h-40"}`}
                            >
                                <Image
                                    src={member.photo}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                                <div className="absolute bottom-3 left-4 text-white">
                                    <p className="text-sm font-semibold">{member.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="relative py-24">
                <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
                    <div className="relative mx-auto aspect-4/5 w-full max-w-sm overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10">
                        <Image
                            src={leader.photo}
                            alt={leader.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 100vw, 28rem"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                        <div className="bg-background/10 absolute inset-x-6 bottom-6 rounded-2xl border border-white/20 p-4 backdrop-blur-md">
                            <p className="text-sm font-semibold text-white">{leader.name}</p>
                            <p className="text-xs text-white/75">{leader.title}</p>
                            <p className="text-xs text-white/55">{leader.affiliation}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <Divider hideDecorations className="justify-start">
                            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                                Leadership
                            </span>
                        </Divider>
                        <blockquote className="text-neutral-1000 relative pl-6 text-2xl leading-[1.35] lg:text-3xl">
                            <Quote
                                size={52}
                                className="fill-primary-300 absolute -top-12 -left-4 text-transparent"
                            />
                            {leader.quote}
                        </blockquote>
                        <p className="text-sm text-neutral-800">{leader.bio}</p>
                        <div className="flex flex-wrap gap-2">
                            {leader.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="border-primary/15 bg-primary/8 text-primary rounded-full border px-3 py-1.5 text-xs font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="from-primary-50 to-background relative bg-linear-to-b py-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
                    <SectionHeading
                        label="The Team"
                        title="Minds behind the models"
                        labelClassName="text-success"
                    />
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {team.map((member) => {
                            const Icon = member.icon
                            return (
                                <motion.article
                                    key={member.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="bg-background/60 overflow-hidden rounded-3xl border border-white/80 shadow-md shadow-black/5 backdrop-blur-xl"
                                >
                                    <div className="relative h-56">
                                        <Image
                                            src={member.photo}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 1024px) 50vw, 25vw"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                                        <div
                                            className={`absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-xl ${member.surface}`}
                                        >
                                            <Icon
                                                size={16}
                                                className={member.accent}
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 p-5">
                                        <h3 className="text-base">{member.name}</h3>
                                        <p className={`text-xs font-medium ${member.accent}`}>
                                            {member.title}
                                        </p>
                                        <p className="text-xs text-neutral-700">{member.focus}</p>
                                    </div>
                                </motion.article>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="relative py-24">
                <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 lg:px-8">
                    <SectionHeading
                        label="What We Stand For"
                        title="Our core values"
                        labelClassName="text-warning-200"
                    />
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {values.map((value) => {
                            const Icon = value.icon
                            return (
                                <motion.div
                                    key={value.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="bg-background/60 rounded-3xl border border-white/80 p-6 shadow-sm backdrop-blur-xl"
                                >
                                    <div
                                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${value.surface}`}
                                    >
                                        <Icon
                                            size={20}
                                            className={value.accent}
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <h3 className="text-sm">{value.title}</h3>
                                    <p className="mt-2 text-sm text-neutral-800">{value.text}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </section>
            <section className="relative overflow-hidden py-24">
                <Gradient
                    where="bottom"
                    className="opacity-25"
                    tint="from-primary-100 to-transparent"
                />
                <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center lg:px-8">
                    <div className="from-primary to-primary-300 flex h-16 w-16 items-center justify-center rounded-3xl bg-linear-to-r text-white">
                        <Users size={26} strokeWidth={1.5} />
                    </div>
                    <h2>Want to work with us?</h2>
                    <p className="text-base text-neutral-800">
                        We welcome research collaborators, public-sector partners, and domain
                        experts who want to turn environmental data into public-health foresight.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/methodology"
                            className="from-primary to-primary-300 inline-flex items-center gap-2.5 rounded-2xl bg-linear-to-r px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                        >
                            Explore our methods
                            <ArrowRight size={16} strokeWidth={1.5} />
                        </Link>
                        <Link
                            href="/support/contact-us"
                            className="hover:border-primary/30 bg-background/80 inline-flex items-center gap-2.5 rounded-2xl border px-8 py-4 text-sm font-semibold text-neutral-900 shadow-sm backdrop-blur-xl transition-all"
                        >
                            Get in touch
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}
