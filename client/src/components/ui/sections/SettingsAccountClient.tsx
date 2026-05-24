"use client"

import { CheckCircle2, Save, Trash2, User } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { ManipulatedUserDataInputsDTO } from "@/features/auth/auth.dto"
import { AuthClientService } from "@/features/auth/auth.service.client"
import { ManipulatedUserDataSchema } from "@/features/auth/auth.validation"
import { GenderEnum } from "@/shared/db/enums/auth.enum"
import { useUserStore } from "@/stores/user/use-user"
import { Button } from "../shadcn/button"
import SettingsField from "./SettingsField"
import SettingsPanel from "./SettingsPanel"
import { easeBehavior, fadeUp } from "./motion"

const getDefaultValues = (profile: {
    firstName?: string
    lastName?: string
    gender?: GenderEnum
}): ManipulatedUserDataInputsDTO => ({
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    gender: profile.gender,
})

export default function SettingsAccountClient() {
    const authService = useMemo(() => new AuthClientService(), [])
    const [saved, setSaved] = useState(false)

    const profile = useUserStore((s) => s.user)
    const setProfile = useUserStore((s) => s.setUser)

    const { control, handleSubmit, reset, formState } = useForm<ManipulatedUserDataInputsDTO>({
        resolver: zodResolver(ManipulatedUserDataSchema),
        mode: "onSubmit",
        defaultValues: getDefaultValues({
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            gender: profile?.gender,
        }),
    })

    useEffect(() => {
        if (!profile) return

        reset(getDefaultValues(profile))
    }, [profile, reset])

    const onSubmit = async (fields: ManipulatedUserDataInputsDTO) => {
        const payload: ManipulatedUserDataInputsDTO = {
            ...fields,
            gender: fields.gender || undefined,
        }

        const { user, message } = await authService.updateUserData(payload)

        setProfile(user)
        setSaved(true)
        reset(getDefaultValues(user))
        toast.success(message)
    }

    return (
        <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.whileInView}
            transition={{ ...fadeUp.transition, duration: 0.45 }}
            className="flex flex-col gap-5"
        >
            <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit(onSubmit)}>
                <SettingsPanel
                    title="Personal Information"
                    description="Includes profile information, such as your name and gender."
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Controller
                            control={control}
                            name="firstName"
                            render={({ field }) => (
                                <SettingsField
                                    id="settings-first-name"
                                    label="First Name"
                                    value={field.value ?? ""}
                                    onChange={(value) => {
                                        setSaved(false)
                                        field.onChange(value)
                                    }}
                                    errors={[formState.errors.firstName]}
                                    icon={User}
                                    placeholder="Enter your first name"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="lastName"
                            render={({ field }) => (
                                <SettingsField
                                    id="settings-last-name"
                                    label="Last Name"
                                    value={field.value ?? ""}
                                    onChange={(value) => {
                                        setSaved(false)
                                        field.onChange(value)
                                    }}
                                    errors={[formState.errors.lastName]}
                                    placeholder="Enter your last name"
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="gender"
                            render={({ field }) => (
                                <SettingsField
                                    id="settings-gender"
                                    label="Gender"
                                    value={field.value ?? ""}
                                    onChange={(value) => {
                                        setSaved(false)
                                        field.onChange(value as GenderEnum)
                                    }}
                                    errors={[formState.errors.gender]}
                                    icon={User}
                                    placeholder="Enter your gender"
                                />
                            )}
                        />
                    </div>
                </SettingsPanel>
                <SettingsPanel title="Danger Zone">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-neutral-500">
                                Permanently remove your account and all associated data from
                                Sehetna. This action cannot be undone.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="border-danger-100/30 bg-danger-100/8 text-danger-200 hover:bg-danger-100/12"
                        >
                            <Trash2 size={14} strokeWidth={1.5} />
                            Delete Account
                        </Button>
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
                            <CheckCircle2 size={14} />
                            Changes saved
                        </motion.div>
                    ) : null}
                    <Button
                        type="submit"
                        variant="bright-primary"
                        size="lg"
                        disabled={formState.isSubmitting}
                    >
                        <Save size={14} />
                        {formState.isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </motion.div>
    )
}
