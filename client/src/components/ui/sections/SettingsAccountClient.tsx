"use client"

import {
    Building2,
    Camera,
    CheckCircle2,
    FileText,
    Globe,
    Mail,
    MapPin,
    Save,
    Trash2,
    User,
} from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { Button } from "../shadcn/button"
import SettingsField from "./SettingsField"
import SettingsPanel from "./SettingsPanel"
import { easeBehavior, fadeUp } from "./motion"

export default function SettingsAccountClient() {
    const [saved, setSaved] = useState(false)
    const [profile, setProfile] = useState({
        firstName: "Amina",
        lastName: "Khalil",
        email: "a.khalil@sehetna.org",
        title: "Director of Environmental Health Intelligence",
        organization: "Sehetna Analytics",
        website: "https://sehetna.org",
        location: "Cairo, Egypt",
        bio: "Leading interdisciplinary research at the intersection of climate science and public health. Building decision tools that matter.",
    })
    // const profile = useUserStore((s) => s.user)
    // const setProfile = useUserStore((s) => s.setUser)
    // // TODO: handle routing when profile is not found
    // if (!profile) return
    // const avatarInitials = getInitials(profile.fullName)

    const avatarInitials = `${profile.firstName[0]}${profile.lastName[0]}`

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    return (
        <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.whileInView}
            transition={{ ...fadeUp.transition, duration: 0.45 }}
            className="flex flex-col gap-5"
        >
            <SettingsPanel
                disabled
                title="Profile Photo"
                description="This appears on your profile and in collaborative reports."
            >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="group relative">
                        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-2xl text-xl font-bold text-white">
                            {avatarInitials}
                        </div>
                        <button
                            type="button"
                            className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <Camera size={18} className="text-white" strokeWidth={1.5} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <p className="text-xs">Upload a photo to personalise your account.</p>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="tonal" size="sm">
                                Upload Photo
                            </Button>
                            <Button variant="ghost" size="sm">
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            </SettingsPanel>

            <SettingsPanel
                title="Personal Information"
                description="Your name, email, and professional role."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <SettingsField
                        label="First Name"
                        value={profile.firstName}
                        onChange={(value) => setProfile({ ...profile, firstName: value })}
                        icon={User}
                        placeholder="First name"
                    />
                    <SettingsField
                        label="Last Name"
                        value={profile.lastName}
                        onChange={(value) => setProfile({ ...profile, lastName: value })}
                        placeholder="Last name"
                    />
                    <SettingsField
                        label="Email Address"
                        value={profile.email}
                        onChange={(value) => setProfile({ ...profile, email: value })}
                        type="email"
                        icon={Mail}
                        placeholder="your@institution.org"
                        hint="Used for login and account notifications."
                    />
                    <SettingsField
                        label="Job Title"
                        value={profile.title}
                        onChange={(value) => setProfile({ ...profile, title: value })}
                        icon={FileText}
                        placeholder="Your professional role"
                    />
                </div>
            </SettingsPanel>
            <SettingsPanel title="Danger Zone" description="Irreversible account actions.">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium text-neutral-900">Delete Account</p>
                        <p className="text-xs text-neutral-500">
                            Permanently remove your account and all associated data from Sehetna.
                            This action cannot be undone.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="border-danger-100/30 bg-danger-100/8 text-danger-200 hover:bg-danger-100/12"
                    >
                        <Trash2 size={14} strokeWidth={1.5} />
                        Delete Account
                    </Button>
                </div>
            </SettingsPanel>
            <SettingsPanel
                disabled
                title="Organization and Location"
                description="Shown in institutional attribution and shared workspace contexts."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <SettingsField
                        label="Organization"
                        value={profile.organization}
                        onChange={(value) => setProfile({ ...profile, organization: value })}
                        icon={Building2}
                        placeholder="Institution or department"
                    />
                    <SettingsField
                        label="Location"
                        value={profile.location}
                        onChange={(value) => setProfile({ ...profile, location: value })}
                        icon={MapPin}
                        placeholder="City, Country"
                    />
                    <div className="sm:col-span-2">
                        <SettingsField
                            label="Website"
                            value={profile.website}
                            onChange={(value) => setProfile({ ...profile, website: value })}
                            icon={Globe}
                            placeholder="https://your-institution.org"
                        />
                    </div>
                </div>
            </SettingsPanel>

            <SettingsPanel
                disabled
                title="Short Bio"
                description="A brief summary of your work, research focus, or team role."
            >
                <div className="flex flex-col gap-2">
                    <SettingsField
                        label="Bio"
                        value={profile.bio}
                        onChange={(value) => setProfile({ ...profile, bio: value })}
                        multiline
                        rows={4}
                        maxLength={240}
                        placeholder="Tell us about your role and current focus areas."
                    />
                    <p className="text-2xs text-right text-neutral-500">
                        {profile.bio.length}/240 characters
                    </p>
                </div>
            </SettingsPanel>

            <div className="flex items-center justify-end gap-3 pt-1">
                {saved ? (
                    <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, ease: easeBehavior }}
                        className="text-success flex items-center gap-1.5 text-xs font-medium"
                    >
                        <CheckCircle2 size={14} strokeWidth={1.5} />
                        Changes saved
                    </motion.div>
                ) : null}
                <Button variant="bright-primary" size="lg" onClick={handleSave}>
                    <Save size={14} />
                    Save Changes
                </Button>
            </div>
        </motion.div>
    )
}
