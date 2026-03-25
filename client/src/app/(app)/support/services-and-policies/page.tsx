import { Metadata } from "next"
import ServicesPoliciesContact from "@/components/ui/sections/ServicesPoliciesContact"
import ServicesPoliciesHero from "@/components/ui/sections/ServicesPoliciesHero"
import ServicesPoliciesPolicyTabs from "@/components/ui/sections/ServicesPoliciesPolicyTabs"

export const metadata: Metadata = {
    title: "Services & Policies",
    description: "Review Sehetna's terms of service, privacy policy, and cookie usage guidelines.",
    alternates: {
        canonical: "/support/services-and-policies",
    },
}

export default function ServicesAndPoliciesPage() {
    return (
        <>
            <ServicesPoliciesHero />
            <ServicesPoliciesPolicyTabs />
            <ServicesPoliciesContact />
        </>
    )
}
