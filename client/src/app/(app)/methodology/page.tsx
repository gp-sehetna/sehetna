import { Metadata } from "next"
import ComingSoon from "@/components/ui/ComingSoon"

export const metadata: Metadata = {
    title: "Methodology",
    description:
        "Understand the methodology and data sources used by Sehetna to generate healthcare insights.",
    alternates: {
        canonical: "/methodology",
    },
}

export default function MethodologyPage() {
    return (
        <ComingSoon
            title="Our Methodology"
            description="This section will detail our research methodology and data sources."
        />
    )
}
