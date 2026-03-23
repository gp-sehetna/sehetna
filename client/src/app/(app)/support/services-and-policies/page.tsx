import { Metadata } from "next"
import ServicesAndPoliciesClient from "@/components/ui/sections/ServicesAndPoliciesClient"

export const metadata: Metadata = {
    title: "Services & Policies",
    description: "Review Sehetna's terms of service, privacy policy, and cookie usage guidelines.",
    alternates: {
        canonical: "/support/services-and-policies",
    },
}

export default function ServicesAndPoliciesPage() {
    return <ServicesAndPoliciesClient />
}
