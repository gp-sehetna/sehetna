import ComingSoon from "@/components/ui/ComingSoon"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Services & Policies",
    description: "Review Sehetna's terms of service, privacy policy, and cookie usage guidelines.",
}

const ServicesAndPoliciesPage = () => {
    return (
        <ComingSoon
            title="Services & Policies"
            description="Review Sehetna's terms of service, privacy policy, and cookie usage guidelines."
        />
    )
}

export default ServicesAndPoliciesPage
