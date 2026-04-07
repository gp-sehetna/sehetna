import { Metadata } from "next"
import MethodologyClient from "@/components/ui/sections/MethodologyClient"

export const metadata: Metadata = {
    title: "Methodology",
    description:
        "Understand the methodology and data sources used by Sehetna to generate healthcare insights.",
    alternates: {
        canonical: "/methodology",
    },
}

export default function MethodologyPage() {
    return <MethodologyClient />
}
