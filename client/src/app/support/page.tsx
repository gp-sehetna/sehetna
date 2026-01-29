import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Support",
    description: "Get support, help, and assistance for using the Sehetna platform.",
    alternates: {
        canonical: "/support",
    },
}

const SupportPage = () => {
    return (
        <ComingSoon
            title="Support"
            description="Get support, help, and assistance for using the Sehetna platform."
        />
    )
}

export default SupportPage
