import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Methodology",
    description:
        "Understand the methodology and data sources used by Sehetna to generate healthcare insights.",
    alternates: {
        canonical: "/methodology",
    },
}

const MethodologyPage = () => {
    return (
        <ComingSoon
            title="Methodology"
            description="Understand the methodology and data sources used by Sehetna to generate healthcare insights."
        />
    )
}

export default MethodologyPage
