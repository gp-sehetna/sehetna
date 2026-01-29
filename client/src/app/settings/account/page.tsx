import ComingSoon from "@/components/ui/ComingSoon"
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
        <ComingSoon
            title="Account Settings"
            description="Manage your Sehetna account information and personal details."
        />
    )
}

export default AccountSettingsPage
