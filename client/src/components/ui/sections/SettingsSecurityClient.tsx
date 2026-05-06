"use client"

import { EmailInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { EmailSchema } from "@/features/auth/auth.validation"
import { hideEmail } from "@/lib/utils/email"
import { PurposeEnum } from "@/shared/db/enums/auth.enum"
import { useUserStore } from "@/stores/user/use-user"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "motion/react"
import {
    ChevronRight,
    Clock,
    LogOut,
    Mail,
    Monitor,
    Shield,
    Smartphone,
    SquareArrowOutUpRight,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "../shadcn/button"
import { Switch } from "../shadcn/switch"
import SettingsField from "./SettingsField"
import SettingsPanel from "./SettingsPanel"
import { easeBehavior, fadeUp } from "./motion"

const activeSessions = [
    {
        id: 1,
        device: "Chrome on macOS",
        location: "Cairo, Egypt",
        icon: Monitor,
        lastActive: "Active now",
        current: true,
    },
    {
        id: 2,
        device: "Safari on iPhone",
        location: "Cairo, Egypt",
        icon: Smartphone,
        lastActive: "2 hours ago",
        current: false,
    },
]

export default function SettingsSecurityClient() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
    const authService = useMemo(() => new AuthClientService(), [])
    const router = useRouter()
    const profile = useUserStore((s) => s.user)

    const { control, handleSubmit, reset, formState } = useForm<EmailInputsDTO>({
        resolver: zodResolver(EmailSchema),
        mode: "onSubmit",
        defaultValues: {
            email: profile?.email ?? "",
        },
    })

    const qrPattern = useMemo(
        () =>
            Array.from({ length: 25 }, (_, index) =>
                [0, 1, 3, 4, 6, 8, 10, 12, 13, 15, 17, 18, 20, 22, 24].includes((index * 7) % 25)
            ),
        []
    )

    const redirectToVerify = async (fields: EmailInputsDTO) => {
        await authService.generateAndFetchOtp({
            ...fields,
            purpose: PurposeEnum.emailChange,
        })
        router.push(
            `/authenticate/verify?purpose=${PurposeEnum.emailChange}&mail=${encodeURIComponent(hideEmail(fields.email))}`
        )
    }

    useEffect(() => {
        if (!profile?.email) return

        reset({ email: profile.email })
    }, [profile?.email, reset])

    return (
        <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.whileInView}
            transition={{ ...fadeUp.transition, duration: 0.45 }}
            className="flex flex-col gap-5"
        >
            <SettingsPanel
                title="Change Password"
                description="Use a strong, unique password that is not reused elsewhere."
            >
                <div className="flex flex-col gap-4">
                    <div className="flex justify-end">
                        <Button
                            variant="bright-primary"
                            onClick={() => router.push("/authenticate/password/old")}
                        >
                            Update Password
                            <SquareArrowOutUpRight size={13} />
                        </Button>
                    </div>
                </div>
            </SettingsPanel>

            <SettingsPanel
                title="Change Email Address"
                description="A verification link will be sent before the change takes effect."
            >
                <form
                    className="flex flex-col gap-4"
                    noValidate
                    onSubmit={handleSubmit(redirectToVerify)}
                >
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <SettingsField
                                id="settings-new-email"
                                type="email"
                                label="New Email Address"
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                errors={[formState.errors.email]}
                                icon={Mail}
                                placeholder="Enter your new email address"
                                hint={
                                    profile?.email
                                        ? `Current email: ${profile.email}`
                                        : "Use the email address you want to verify and switch to."
                                }
                            />
                        )}
                    />
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="bright-primary"
                            disabled={formState.isSubmitting}
                        >
                            {formState.isSubmitting ? "Sending..." : "Send Verification"}
                            <SquareArrowOutUpRight size={13} />
                        </Button>
                    </div>
                </form>
            </SettingsPanel>

            <SettingsPanel
                disabled
                title="Two-Factor Authentication"
                description="Add an extra layer of security using an authenticator app."
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="bg-secondary-100/50 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                                <Smartphone
                                    size={17}
                                    className="text-secondary"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-neutral-1000 text-sm font-medium">
                                    Authenticator App (TOTP)
                                </p>
                                <p className="text-xs text-neutral-500">
                                    {twoFactorEnabled
                                        ? "2FA is active and helping protect your account."
                                        : "Not enabled yet. Strongly recommended for institutional accounts."}
                                </p>
                            </div>
                        </div>
                        <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>

                    {twoFactorEnabled ? (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, ease: easeBehavior }}
                            className="border-secondary-200/30 bg-secondary-100/25 rounded-2xl border p-4"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <Shield size={13} className="text-secondary" strokeWidth={1.5} />
                                <span className="text-secondary text-xs font-semibold">
                                    2FA Enabled
                                </span>
                            </div>
                            <p className="text-xs text-neutral-700">
                                Scan the QR pattern below with Google Authenticator, Authy, or
                                1Password, then store your backup codes securely.
                            </p>
                            <div className="bg-earth-100 mt-3 flex h-28 w-28 items-center justify-center rounded-xl">
                                <div className="grid h-20 w-20 grid-cols-5 gap-0.5 opacity-70">
                                    {qrPattern.map((filled, index) => (
                                        <div
                                            key={index}
                                            className={
                                                filled
                                                    ? "bg-neutral-1000 rounded-sm"
                                                    : "rounded-sm bg-transparent"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="text-secondary mt-3 flex items-center gap-1 text-xs font-medium hover:underline"
                            >
                                View backup codes
                                <ChevronRight size={11} />
                            </button>
                        </motion.div>
                    ) : null}
                </div>
            </SettingsPanel>

            <SettingsPanel
                disabled
                title="Active Sessions"
                description="Devices currently logged in to your account."
            >
                <div className="flex flex-col gap-3">
                    {activeSessions.map((session) => {
                        const Icon = session.icon

                        return (
                            <div
                                key={session.id}
                                className="bg-earth-100/40 flex items-center gap-4 rounded-2xl border border-neutral-200 p-4"
                            >
                                <div className="bg-background flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm">
                                    <Icon
                                        size={16}
                                        className="text-neutral-700"
                                        strokeWidth={1.5}
                                    />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-neutral-1000 truncate text-xs font-semibold">
                                        {session.device}
                                    </p>
                                    <div className="text-2xs mt-0.5 flex items-center gap-2 text-neutral-500">
                                        <span>{session.location}</span>
                                        <span className="text-neutral-300">•</span>
                                        <div className="flex items-center gap-1">
                                            <Clock size={10} />
                                            <span>{session.lastActive}</span>
                                        </div>
                                    </div>
                                </div>
                                {session.current ? (
                                    <span className="bg-success-100/30 text-2xs text-success rounded-full px-2.5 py-1 font-semibold">
                                        Current
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        className="text-2xs text-danger-200 hover:text-danger-100 flex shrink-0 items-center gap-1 font-medium transition-colors"
                                    >
                                        <LogOut size={11} strokeWidth={1.5} />
                                        Revoke
                                    </button>
                                )}
                            </div>
                        )
                    })}

                    <button
                        type="button"
                        className="text-danger-200 hover:text-danger-100 mt-1 flex items-center gap-1.5 text-xs font-medium transition-colors"
                    >
                        <LogOut size={13} strokeWidth={1.5} />
                        Sign out of all other sessions
                    </button>
                </div>
            </SettingsPanel>

            <SettingsPanel
                disabled
                title="Account Recovery"
                description="Make sure you can always regain access to your account."
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-neutral-900">Recovery Email</p>
                        <p className="text-xs text-neutral-500">
                            a.khalil.recovery@gmail.com
                            <span className="text-success ml-2 font-medium">Verified</span>
                        </p>
                    </div>
                    <Button variant="bright" size="sm">
                        Update Recovery Email
                    </Button>
                </div>
            </SettingsPanel>
        </motion.div>
    )
}
