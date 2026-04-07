import type { ReactNode } from "react"
import Link from "next/link"
import {
    Bell,
    ChevronRight,
    Settings as SettingsIcon,
    Shield,
    User,
    type LucideIcon,
} from "lucide-react"
import SectionShell from "./SectionShell"

const settingsNav: {
    key: "account" | "security" | "notifications"
    label: string
    icon: LucideIcon
    href: string
    description: string
    disabled?: boolean
}[] = [
    {
        key: "account",
        label: "Account",
        icon: User,
        href: "/settings/account",
        description: "Profile and preferences",
    },
    {
        key: "security",
        label: "Security",
        icon: Shield,
        href: "/settings/security",
        description: "Password and authentication",
    },
    {
        key: "notifications",
        label: "Notifications",
        icon: Bell,
        href: "/settings/notifications",
        description: "Alert preferences",
        disabled: true,
    },
]

type SettingsShellProps = {
    activeKey: "account" | "security"
    title: string
    description: string
    children: ReactNode
}

export default function SettingsShell({
    activeKey,
    title,
    description,
    children,
}: SettingsShellProps) {
    return (
        <>
            <SectionShell
                className="from-earth-100 via-background to-earth-100/40 bg-linear-to-br pt-28 pb-10 lg:pt-36"
                decoration={
                    <div className="from-earth/10 pointer-events-none absolute -top-20 right-0 h-75 w-100 rounded-full bg-linear-to-bl to-transparent blur-3xl" />
                }
                containerClassName="max-w-5xl gap-2 lg:px-8"
            >
                <div className="flex items-center gap-1 text-neutral-500">
                    <SettingsIcon size={16} />
                    <span className="text-xs font-medium">Settings</span>
                </div>
                <div className="flex flex-col gap-2">
                    <h2>{title}</h2>
                    <p className="max-w-2xl text-sm text-neutral-700">{description}</p>
                </div>
            </SectionShell>

            <SectionShell
                className="from-earth-100/40 via-background to-primary-100/10 bg-linear-to-b py-10"
                containerClassName="max-w-5xl gap-6 lg:px-8 "
            >
                <div className="flex flex-col gap-6 lg:flex-row">
                    <aside className="shrink-0 lg:w-64">
                        <nav className="flex flex-col gap-1.5">
                            {settingsNav.map((item) => {
                                const Icon = item.icon
                                const isActive = activeKey === item.key

                                return item.disabled ? (
                                    <div
                                        key={item.key}
                                        className="flex items-center gap-3 rounded-2xl px-4 py-3 opacity-45"
                                    >
                                        <div className="bg-earth-100 flex h-8 w-8 items-center justify-center rounded-xl">
                                            <Icon
                                                size={15}
                                                className="text-neutral-500"
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium text-neutral-700">
                                                {item.label}
                                            </div>
                                            <div className="text-2xs text-neutral-500">
                                                {item.description}
                                            </div>
                                        </div>
                                        <span className="bg-earth-100 text-2xs rounded-full px-2 py-0.5 font-medium text-neutral-500">
                                            Soon
                                        </span>
                                    </div>
                                ) : (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        className={
                                            isActive
                                                ? "home-surface text-neutral-1000 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-md shadow-black/5"
                                                : "hover:bg-background/70 hover:text-neutral-1000 flex items-center gap-3 rounded-2xl px-4 py-3 text-neutral-700 transition-colors"
                                        }
                                    >
                                        <div
                                            className={
                                                isActive
                                                    ? "bg-primary-100/30 flex h-8 w-8 items-center justify-center rounded-xl"
                                                    : "bg-earth-100 flex h-8 w-8 items-center justify-center rounded-xl"
                                            }
                                        >
                                            <Icon
                                                size={15}
                                                className={
                                                    isActive ? "text-primary" : "text-neutral-500"
                                                }
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-medium">{item.label}</div>
                                            <div className="text-2xs text-neutral-500">
                                                {item.description}
                                            </div>
                                        </div>
                                        {isActive ? (
                                            <ChevronRight size={13} className="text-primary" />
                                        ) : null}
                                    </Link>
                                )
                            })}
                        </nav>
                    </aside>

                    <div className="min-w-0 flex-1">{children}</div>
                </div>
            </SectionShell>
        </>
    )
}
