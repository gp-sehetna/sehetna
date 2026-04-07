import SettingsSecurityClient from "@/components/ui/sections/SettingsSecurityClient"
import SettingsShell from "@/components/ui/sections/SettingsShell"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Security Settings",
    description: "Manage security preferences, authentication, and account protection settings.",
    alternates: {
        canonical: "/settings/security",
    },
}

const SecuritySettingsPage = () => {
    return (
        <SettingsShell
            activeKey="security"
            title="Security Settings"
            description="Manage passwords, authentication, active sessions, and recovery options."
        >
            <SettingsSecurityClient />
        </SettingsShell>
    )
}

export default SecuritySettingsPage
