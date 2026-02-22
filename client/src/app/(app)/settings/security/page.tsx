import ComingSoon from "@/components/ui/ComingSoon"
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
        <ComingSoon
            title="Security Settings"
            description="Manage security preferences, authentication, and account protection settings."
        />
    )
}

export default SecuritySettingsPage
