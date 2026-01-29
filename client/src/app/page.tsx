import ComingSoon from "@/components/ui/ComingSoon"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Home",
    description:
        "Sehetna is a healthcare platform by From Masr focused on data-driven insights, mapping, and health exploration tools.",
}

export default function Home() {
    return (
        <ComingSoon
            title="Home"
            description="A healthcare and data exploration platform by From Masr, built to provide insights, mapping tools, and transparent methodologies."
        />
    )
}
