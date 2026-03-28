import SettingsAccountClient from "@/components/ui/sections/SettingsAccountClient"
import SettingsShell from "@/components/ui/sections/SettingsShell"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Account Settings",
    description: "Manage your Sehetna account information and personal details.",
    alternates: {
        canonical: "/settings/account",
    },
}

const AccountSettingsPage = () => {
    return (
        <SettingsShell
            activeKey="account"
            title="Account Settings"
            description="Manage your profile, institutional identity, and account preferences in one place."
        >
            <SettingsAccountClient />
        </SettingsShell>
    )
}

export default AccountSettingsPage
