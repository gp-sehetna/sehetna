"use client"

import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    Clock,
    Key,
    Lock,
    LogOut,
    Mail,
    Monitor,
    Shield,
    Smartphone,
} from "lucide-react"
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

function StrengthMeter({ password }: { password: string }) {
    const strength = useMemo(() => {
        let score = 0
        if (password.length >= 8) score++
        if (password.length >= 12) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++
        return score
    }, [password])

    const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
    const colorClasses = [
        "",
        "bg-danger-100 text-danger-200",
        "bg-warning-100 text-warning-200",
        "bg-warning-100 text-warning-200",
        "bg-success-100 text-success",
        "bg-success text-white",
    ]

    if (!password) return null

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div
                        key={index}
                        className={
                            index < strength
                                ? `h-1 flex-1 rounded-full ${colorClasses[strength].split(" ")[0]}`
                                : "h-1 flex-1 rounded-full bg-neutral-200"
                        }
                    />
                ))}
            </div>
            <span
                className={`text-2xs w-fit rounded-full px-2 py-0.5 font-medium ${colorClasses[strength] || "text-neutral-500"}`}
            >
                {labels[strength]}
            </span>
        </div>
    )
}

export default function SettingsSecurityClient() {
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passwordSaved, setPasswordSaved] = useState(false)
    const [passwordError, setPasswordError] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [emailSent, setEmailSent] = useState(false)
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

    const qrPattern = useMemo(
        () =>
            Array.from({ length: 25 }, (_, index) =>
                [0, 1, 3, 4, 6, 8, 10, 12, 13, 15, 17, 18, 20, 22, 24].includes((index * 7) % 25)
            ),
        []
    )

    const handlePasswordSave = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("All password fields are required.")
            return
        }
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.")
            return
        }
        if (newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters.")
            return
        }

        setPasswordError("")
        setPasswordSaved(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setTimeout(() => setPasswordSaved(false), 3500)
    }

    const handleEmailChange = () => {
        if (!newEmail || !newEmail.includes("@")) return
        setEmailSent(true)
        setTimeout(() => setEmailSent(false), 5000)
    }

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
                    <SettingsField
                        label="Current Password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        placeholder="Enter your current password"
                        icon={Lock}
                        showToggle
                        isVisible={showCurrent}
                        onToggleVisibility={() => setShowCurrent((value) => !value)}
                    />
                    <SettingsField
                        label="New Password"
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="Enter a new strong password"
                        hint="At least 8 characters, with uppercase, number, and symbol."
                        icon={Lock}
                        showToggle
                        isVisible={showNew}
                        onToggleVisibility={() => setShowNew((value) => !value)}
                    />
                    <StrengthMeter password={newPassword} />
                    <SettingsField
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="Repeat new password"
                        icon={Lock}
                        showToggle
                        isVisible={showConfirm}
                        onToggleVisibility={() => setShowConfirm((value) => !value)}
                    />

                    <AnimatePresence>
                        {passwordError ? (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: easeBehavior }}
                                className="border-danger-100/20 bg-danger-100/8 flex items-center gap-2 rounded-xl border p-3"
                            >
                                <AlertTriangle
                                    size={13}
                                    className="text-danger-200 shrink-0"
                                    strokeWidth={1.5}
                                />
                                <span className="text-danger-200 text-xs">{passwordError}</span>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    <div className="flex items-center justify-between gap-3 pt-1">
                        {passwordSaved ? (
                            <motion.div
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.25, ease: easeBehavior }}
                                className="text-success flex items-center gap-1.5 text-xs font-medium"
                            >
                                <CheckCircle2 size={14} strokeWidth={1.5} />
                                Password updated
                            </motion.div>
                        ) : (
                            <div />
                        )}
                        <Button variant="bright-primary" onClick={handlePasswordSave}>
                            <Key size={13} strokeWidth={1.5} />
                            Update Password
                        </Button>
                    </div>
                </div>
            </SettingsPanel>

            <SettingsPanel
                title="Change Email Address"
                description="A verification link will be sent before the change takes effect."
            >
                <div className="flex flex-col gap-4">
                    <SettingsField
                        label="New Email Address"
                        value={newEmail}
                        onChange={setNewEmail}
                        type="email"
                        placeholder="newemail@institution.org"
                        icon={Mail}
                    />

                    <AnimatePresence>
                        {emailSent ? (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2, ease: easeBehavior }}
                                className="border-success-100/30 bg-success-100/20 flex items-center gap-2 rounded-xl border p-3"
                            >
                                <CheckCircle2
                                    size={13}
                                    className="text-success shrink-0"
                                    strokeWidth={1.5}
                                />
                                <span className="text-success text-xs">
                                    Verification email sent to <strong>{newEmail}</strong>.
                                </span>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    <div className="flex justify-end">
                        <Button variant="bright-primary" onClick={handleEmailChange}>
                            <Mail size={13} strokeWidth={1.5} />
                            Send Verification
                        </Button>
                    </div>
                </div>
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
